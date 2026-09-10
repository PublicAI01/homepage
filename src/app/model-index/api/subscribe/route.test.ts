import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { POST } from './route';

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
    const res = await post({ email: 'Reader@Example.com' }, '10.0.0.1');
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
      expect((await post({ email: `r${i}@example.com` }, ip)).status).toBe(200);
    }
    const res = await post({ email: 'r4@example.com' }, ip);
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
});
