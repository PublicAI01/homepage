import { describe, expect, it } from 'vitest';

import { createRateLimiter } from '@/server/rate-limit';

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
