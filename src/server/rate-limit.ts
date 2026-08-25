export interface RateLimitRule {
  limit: number;
  windowMs: number;
}

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number };

const SWEEP_INTERVAL_MS = 60_000;
const SWEEP_MIN_KEYS = 1024;

/**
 * Sliding-window limiter over an in-memory log of request timestamps.
 * State is per process and resets on restart. Boundary: replace with a
 * shared store (e.g. Redis) only if the app ever runs more than one
 * instance.
 */
export function createRateLimiter(rules: readonly RateLimitRule[]) {
  const maxWindowMs = Math.max(...rules.map((rule) => rule.windowMs));
  const hits = new Map<string, number[]>();
  let lastSweepAt = 0;

  function sweep(now: number) {
    for (const [key, timestamps] of hits) {
      if (timestamps[timestamps.length - 1] <= now - maxWindowMs) {
        hits.delete(key);
      }
    }
  }

  function check(key: string, now: number = Date.now()): RateLimitResult {
    const timestamps = (hits.get(key) ?? []).filter(
      (t) => t > now - maxWindowMs,
    );

    let blockedUntil = 0;
    for (const rule of rules) {
      const inWindow = timestamps.filter((t) => t > now - rule.windowMs);
      if (inWindow.length >= rule.limit) {
        // The request is admissible once enough of the oldest in-window
        // entries age out to leave room under the limit.
        blockedUntil = Math.max(
          blockedUntil,
          inWindow[inWindow.length - rule.limit] + rule.windowMs,
        );
      }
    }

    if (blockedUntil > now) {
      hits.set(key, timestamps);
      return {
        allowed: false,
        retryAfterSeconds: Math.ceil((blockedUntil - now) / 1000),
      };
    }

    timestamps.push(now);
    hits.set(key, timestamps);
    if (hits.size > SWEEP_MIN_KEYS && now - lastSweepAt > SWEEP_INTERVAL_MS) {
      lastSweepAt = now;
      sweep(now);
    }
    return { allowed: true };
  }

  return { check };
}

const MINUTE_MS = 60_000;
const DAY_MS = 86_400_000;

export const contactRateLimiter = createRateLimiter([
  { limit: 3, windowMs: MINUTE_MS },
  { limit: 10, windowMs: DAY_MS },
]);

export const verifyRateLimiter = createRateLimiter([
  { limit: 10, windowMs: MINUTE_MS },
  { limit: 100, windowMs: DAY_MS },
]);

export function clientIp(request: Request): string {
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return 'unknown';
}
