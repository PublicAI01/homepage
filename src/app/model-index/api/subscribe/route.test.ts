import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { verifyRecaptchaToken } from '@/server/recaptcha';

import { POST } from './route';

vi.mock('@/server/recaptcha', () => ({ verifyRecaptchaToken: vi.fn() }));

// The route buckets by the address Cloudflare vouches for, as in production.
process.env.TRUSTED_PROXY = 'cloudflare';

const post = (
  body: unknown,
  ip: string,
  headers: Record<string, string> = {},
) =>
  POST(
    new Request('https://publicai.io/model-index/api/subscribe', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'cf-connecting-ip': ip,
        ...headers,
      },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
  );

describe('subscribe route', () => {
  beforeEach(() => {
    vi.stubEnv('RESEND_API_KEY', 'test-key');
    vi.stubEnv('RESEND_AUDIENCE_ID', 'aud');
    vi.stubEnv('RECAPTCHA_SECRET_KEY', 'secret');
    vi.stubEnv('NEXT_PUBLIC_RECAPTCHA_SITE_KEY', 'site');
    vi.mocked(verifyRecaptchaToken).mockResolvedValue(true);
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 201 }),
    );
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('forwards a valid address and never echoes it', async () => {
    const res = await post(
      { email: 'Reader@Example.com', recaptchaToken: 'tok' },
      '10.0.0.1',
    );
    expect(res.status).toBe(200);
    expect(await res.text()).not.toContain('example.com');
    const [, init] = (fetch as unknown as ReturnType<typeof vi.fn>).mock
      .calls[0];
    expect(JSON.parse(init.body)).toEqual({
      email: 'reader@example.com',
      unsubscribed: false,
    });
  });

  it('rate-limits a burst from one address before touching Resend', async () => {
    const ip = '10.0.0.2';
    for (let i = 0; i < 3; i++) {
      expect(
        (await post({ email: `r${i}@example.com`, recaptchaToken: 'tok' }, ip))
          .status,
      ).toBe(200);
    }
    const res = await post(
      { email: 'r4@example.com', recaptchaToken: 'tok' },
      ip,
    );
    expect(res.status).toBe(429);
    expect(res.headers.get('retry-after')).toMatch(/^\d+$/);
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it('rejects a non-JSON content type and an oversized body', async () => {
    const wrongType = await post({ email: 'a@b.co' }, '10.0.0.3', {
      'content-type': 'text/plain',
    });
    expect(wrongType.status).toBe(415);
    const big = await post(
      { email: 'a@b.co', pad: 'x'.repeat(20_000) },
      '10.0.0.3',
    );
    expect(big.status).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('refuses a sign-up without a captcha token, or with one Google rejects', async () => {
    // A script with many machines could sign strangers up one by one
    // (2026-09-20); the token says a person was at the keyboard.
    const none = await post({ email: 'a@example.com' }, '10.0.0.4');
    expect(none.status).toBe(400);
    vi.mocked(verifyRecaptchaToken).mockResolvedValueOnce(false);
    const bad = await post(
      { email: 'a@example.com', recaptchaToken: 'forged' },
      '10.0.0.5',
    );
    expect(bad.status).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
    // The check is bound to the sign-up action and the visitor's address.
    await post({ email: 'a@example.com', recaptchaToken: 'tok' }, '10.0.0.6');
    expect(verifyRecaptchaToken).toHaveBeenLastCalledWith(
      expect.objectContaining({
        expectedAction: 'subscribe',
        remoteIp: '10.0.0.6',
        token: 'tok',
      }),
    );
  });

  it('counts an IPv6 visitor by the /64, so a new address is not a fresh limit', async () => {
    for (let i = 0; i < 3; i++)
      expect(
        (
          await post(
            { email: `v${i}@example.com`, recaptchaToken: 'tok' },
            `2001:db8:9:9::${i + 1}`,
          )
        ).status,
      ).toBe(200);
    const res = await post(
      { email: 'v4@example.com', recaptchaToken: 'tok' },
      '2001:db8:9:9:ffff::1',
    );
    expect(res.status).toBe(429);
  });

  it('answers 503 rather than skipping the captcha when production lacks the keys', async () => {
    vi.stubEnv('RECAPTCHA_SECRET_KEY', '');
    vi.stubEnv('NODE_ENV', 'production');
    const res = await post(
      { email: 'a@example.com', recaptchaToken: 'tok' },
      '10.0.0.7',
    );
    expect(res.status).toBe(503);
    expect(fetch).not.toHaveBeenCalled();
  });
});
