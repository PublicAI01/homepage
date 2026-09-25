import { afterEach, describe, expect, it, vi } from 'vitest';

import { assessRecaptcha, verifyRecaptchaToken } from '@/server/recaptcha';

const PARAMS = {
  apiKey: 'api-key',
  siteKey: 'site-key',
  token: 'tok',
  expectedAction: 'contact_submit',
  remoteIp: '203.0.113.9',
};

const ACCEPTED = {
  tokenProperties: {
    valid: true,
    action: 'contact_submit',
    hostname: 'publicai.io',
  },
  riskAnalysis: { score: 0.9 },
};

function mockAssessment(payload: unknown, ok = true) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok,
    json: () => Promise.resolve(payload),
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('verifyRecaptchaToken', () => {
  it('accepts a passing assessment', async () => {
    const fetchMock = mockAssessment(ACCEPTED);
    await expect(verifyRecaptchaToken(PARAMS)).resolves.toBe(true);

    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/assessments?key=api-key');
    expect(JSON.parse(init.body as string)).toEqual({
      event: {
        token: 'tok',
        siteKey: 'site-key',
        expectedAction: 'contact_submit',
        userIpAddress: '203.0.113.9',
      },
    });
  });

  // www.publicai.io serves the site without redirecting to the apex, so a
  // token minted there names the www host; production rejected it and the
  // contact form failed for every www visitor (2026-09-19).
  it('accepts www.publicai.io in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    mockAssessment({
      ...ACCEPTED,
      tokenProperties: {
        ...ACCEPTED.tokenProperties,
        hostname: 'www.publicai.io',
      },
    });
    await expect(verifyRecaptchaToken(PARAMS)).resolves.toBe(true);
  });

  it.each(['localhost', '127.0.0.1'])(
    'accepts %s outside production',
    async (hostname) => {
      mockAssessment({
        ...ACCEPTED,
        tokenProperties: { ...ACCEPTED.tokenProperties, hostname },
      });
      await expect(verifyRecaptchaToken(PARAMS)).resolves.toBe(true);
    },
  );

  it.each([
    [
      'invalid token',
      {
        ...ACCEPTED,
        tokenProperties: { ...ACCEPTED.tokenProperties, valid: false },
      },
    ],
    ['low score', { ...ACCEPTED, riskAnalysis: { score: 0.3 } }],
    ['missing score', { ...ACCEPTED, riskAnalysis: {} }],
    [
      'action mismatch',
      {
        ...ACCEPTED,
        tokenProperties: { ...ACCEPTED.tokenProperties, action: 'login' },
      },
    ],
    [
      'wrong hostname',
      {
        ...ACCEPTED,
        tokenProperties: {
          ...ACCEPTED.tokenProperties,
          hostname: 'evil.example',
        },
      },
    ],
    ['empty payload', {}],
  ])('rejects a %s', async (_label, payload) => {
    mockAssessment(payload);
    await expect(verifyRecaptchaToken(PARAMS)).resolves.toBe(false);
  });

  it('rejects when the assessment API responds non-2xx', async () => {
    mockAssessment(ACCEPTED, false);
    await expect(verifyRecaptchaToken(PARAMS)).resolves.toBe(false);
  });

  it('rejects when the request throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')));
    await expect(verifyRecaptchaToken(PARAMS)).resolves.toBe(false);
  });

  it('omits userIpAddress when not provided', async () => {
    const fetchMock = mockAssessment(ACCEPTED);
    await verifyRecaptchaToken({ ...PARAMS, remoteIp: undefined });
    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body.event).not.toHaveProperty('userIpAddress');
  });

  // Every refusal used to be a bare `false`: the www hostname gap kept the
  // contact form dead for days with nothing in the log (2026-09-19). A
  // rotated key, a spent quota or a changed domain list fail the same way,
  // so each is now a line naming the route and the reason — never the
  // token or the key.
  describe('logs why an assessment was refused', () => {
    it.each([
      [
        'an invalid token',
        {
          ...ACCEPTED,
          tokenProperties: {
            ...ACCEPTED.tokenProperties,
            valid: false,
            invalidReason: 'EXPIRED',
          },
        },
        'token invalid (EXPIRED)',
      ],
      [
        'a low score',
        { ...ACCEPTED, riskAnalysis: { score: 0.3 } },
        'score 0.3',
      ],
      [
        'an action mismatch',
        {
          ...ACCEPTED,
          tokenProperties: { ...ACCEPTED.tokenProperties, action: 'login' },
        },
        'action "login"',
      ],
      [
        'a wrong hostname',
        {
          ...ACCEPTED,
          tokenProperties: {
            ...ACCEPTED.tokenProperties,
            hostname: 'evil.example',
          },
        },
        'hostname "evil.example"',
      ],
    ])('%s', async (_label, payload, reason) => {
      const log = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockAssessment(payload);
      await expect(verifyRecaptchaToken(PARAMS)).resolves.toBe(false);
      expect(log).toHaveBeenCalledTimes(1);
      const line = String(log.mock.calls[0][0]);
      expect(line).toContain('contact_submit');
      expect(line).toContain(reason);
    });

    it('a non-2xx answer, with the status', async () => {
      const log = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({ ok: false, status: 403 }),
      );
      await expect(verifyRecaptchaToken(PARAMS)).resolves.toBe(false);
      expect(String(log.mock.calls[0][0])).toContain('answered 403');
    });

    it('a request that throws, with the error name', async () => {
      const log = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.stubGlobal(
        'fetch',
        vi.fn().mockRejectedValue(new DOMException('t/o', 'TimeoutError')),
      );
      await expect(verifyRecaptchaToken(PARAMS)).resolves.toBe(false);
      expect(String(log.mock.calls[0][0])).toContain(
        'unreachable (TimeoutError)',
      );
    });

    it('never the token or the API key, and nothing on success', async () => {
      const log = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockAssessment({ ...ACCEPTED, riskAnalysis: { score: 0.1 } });
      await verifyRecaptchaToken(PARAMS);
      const line = String(log.mock.calls[0][0]);
      expect(line).not.toContain('tok');
      expect(line).not.toContain('api-key');

      log.mockClear();
      mockAssessment(ACCEPTED);
      await expect(verifyRecaptchaToken(PARAMS)).resolves.toBe(true);
      expect(log).not.toHaveBeenCalled();
    });

    it('assessRecaptcha reports the reason without logging', async () => {
      const log = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockAssessment({});
      await expect(assessRecaptcha(PARAMS)).resolves.toEqual({
        ok: false,
        reason: 'token invalid (no reason given)',
      });
      expect(log).not.toHaveBeenCalled();
    });
  });
});
