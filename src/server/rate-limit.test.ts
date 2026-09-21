import { describe, expect, it } from 'vitest';

import { clientIp, createRateLimiter, ipBucket } from '@/server/rate-limit';

const MINUTE = 60_000;
const DAY = 86_400_000;

const RULES = [
  { limit: 3, windowMs: MINUTE },
  { limit: 10, windowMs: DAY },
];

describe('createRateLimiter', () => {
  it('allows requests up to the per-minute limit', () => {
    const limiter = createRateLimiter(RULES);
    const t0 = 1_000_000;
    expect(limiter.check('ip', t0)).toEqual({ allowed: true });
    expect(limiter.check('ip', t0 + 1000)).toEqual({ allowed: true });
    expect(limiter.check('ip', t0 + 2000)).toEqual({ allowed: true });
  });

  it('rejects the request over the per-minute limit with retry-after', () => {
    const limiter = createRateLimiter(RULES);
    const t0 = 1_000_000;
    limiter.check('ip', t0);
    limiter.check('ip', t0 + 1000);
    limiter.check('ip', t0 + 2000);
    const result = limiter.check('ip', t0 + 3000);
    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      // Oldest hit (t0) leaves the minute window at t0 + 60s.
      expect(result.retryAfterSeconds).toBe(57);
    }
  });

  it('slides the window: allows again once the oldest hit expires', () => {
    const limiter = createRateLimiter(RULES);
    const t0 = 1_000_000;
    limiter.check('ip', t0);
    limiter.check('ip', t0 + 1000);
    limiter.check('ip', t0 + 2000);
    expect(limiter.check('ip', t0 + MINUTE - 1).allowed).toBe(false);
    expect(limiter.check('ip', t0 + MINUTE).allowed).toBe(true);
  });

  it('does not extend the window for rejected requests', () => {
    const limiter = createRateLimiter(RULES);
    const t0 = 1_000_000;
    limiter.check('ip', t0);
    limiter.check('ip', t0 + 1000);
    limiter.check('ip', t0 + 2000);
    limiter.check('ip', t0 + 30_000);
    expect(limiter.check('ip', t0 + MINUTE + 1).allowed).toBe(true);
  });

  it('enforces the per-day limit across minute windows', () => {
    const limiter = createRateLimiter(RULES);
    const t0 = 1_000_000;
    for (let i = 0; i < 10; i++) {
      expect(limiter.check('ip', t0 + i * 2 * MINUTE).allowed).toBe(true);
    }
    const result = limiter.check('ip', t0 + 20 * MINUTE);
    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      // Oldest of the 10 hits leaves the day window at t0 + 1 day.
      expect(result.retryAfterSeconds).toBe((DAY - 20 * MINUTE) / 1000);
    }
    expect(limiter.check('ip', t0 + DAY + 1).allowed).toBe(true);
  });

  it('tracks keys independently', () => {
    const limiter = createRateLimiter(RULES);
    const t0 = 1_000_000;
    limiter.check('a', t0);
    limiter.check('a', t0 + 1);
    limiter.check('a', t0 + 2);
    expect(limiter.check('a', t0 + 3).allowed).toBe(false);
    expect(limiter.check('b', t0 + 3).allowed).toBe(true);
  });
});

describe('clientIp', () => {
  const req = (h: Record<string, string>) =>
    new Request('https://publicai.io/x', { headers: h });

  it('behind Cloudflare, reads only the header Cloudflare overwrites', () => {
    expect(
      clientIp(
        req({
          'cf-connecting-ip': '203.0.113.9',
          'x-forwarded-for': '1.1.1.1',
        }),
        'cloudflare',
      ),
    ).toBe('203.0.113.9');
    // A forged x-forwarded-for on its own buys nothing.
    expect(clientIp(req({ 'x-forwarded-for': '1.1.1.1' }), 'cloudflare')).toBe(
      'unknown',
    );
  });

  it('behind nginx, takes the address nginx appended, not the one the client sent', () => {
    expect(
      clientIp(req({ 'x-forwarded-for': '9.9.9.9, 203.0.113.9' }), 'nginx'),
    ).toBe('203.0.113.9');
    expect(clientIp(req({ 'cf-connecting-ip': '9.9.9.9' }), 'nginx')).toBe(
      'unknown',
    );
  });

  it('with nothing trusted in front, trusts no header at all', () => {
    expect(
      clientIp(
        req({ 'cf-connecting-ip': '9.9.9.9', 'x-forwarded-for': '8.8.8.8' }),
        'none',
      ),
    ).toBe('direct');
  });
});

describe('ipBucket', () => {
  it('leaves an IPv4 address alone, IPv4-mapped included', () => {
    expect(ipBucket('203.0.113.9')).toBe('203.0.113.9');
    expect(ipBucket('::ffff:203.0.113.9')).toBe('203.0.113.9');
    expect(ipBucket('unknown')).toBe('unknown');
  });

  it('counts an IPv6 host by its /64, so a new address is not a new visitor', () => {
    // One machine has 2^64 addresses in its /64; each was a fresh limit
    // (2026-09-20).
    expect(ipBucket('2001:db8:1:2:aaaa:bbbb:cccc:dddd')).toBe(
      '2001:db8:1:2::/64',
    );
    expect(ipBucket('2001:db8:1:2:aaaa:bbbb:cccc:dddd')).toBe(
      ipBucket('2001:db8:1:2:1111:2222:3333:4444'),
    );
    expect(ipBucket('2001:db8:1:2::1')).toBe('2001:db8:1:2::/64');
    expect(ipBucket('2001:0db8:0001:0002::1')).toBe('2001:db8:1:2::/64');
    expect(ipBucket('2001:db8:1:3::1')).not.toBe(ipBucket('2001:db8:1:2::1'));
    expect(ipBucket('::1')).toBe('0:0:0:0::/64');
  });

  it('does not touch what clientIp returns', () => {
    // The real address still goes to reCAPTCHA and into the contact mail.
    const req = new Request('https://publicai.io/x', {
      headers: { 'cf-connecting-ip': '2001:db8:1:2::1' },
    });
    expect(clientIp(req, 'cloudflare')).toBe('2001:db8:1:2::1');
  });
});
