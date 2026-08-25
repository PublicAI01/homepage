import { afterEach, describe, expect, it, vi } from 'vitest';

import { verifyRecaptchaToken } from '@/server/recaptcha';

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
});
