export interface RateLimitRule {
  limit: number;
  windowMs: number;
}

export type RateLimitResult =
  { allowed: true } | { allowed: false; retryAfterSeconds: number };

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

/** One address per sign-up; a burst from one IP is a script, not a reader. */
export const subscribeRateLimiter = createRateLimiter([
  { limit: 3, windowMs: MINUTE_MS },
  { limit: 10, windowMs: DAY_MS },
]);

export const verifyRateLimiter = createRateLimiter([
  { limit: 10, windowMs: MINUTE_MS },
  { limit: 100, windowMs: DAY_MS },
]);

/**
 * Which proxy's word to take for the visitor's address. A client can put
 * any value in cf-connecting-ip or x-forwarded-for; only a header a trusted
 * proxy overwrites on every request can bucket a rate limit, or the limit
 * is one header away from not existing (a fresh fake address per request,
 * an unbounded stream of sign-ups into the Resend audience).
 *
 *   cloudflare — publicai.io's shape: Cloudflare sets cf-connecting-ip and
 *                strips the client's own copy. The origin must not be
 *                reachable except through Cloudflare, or this is moot.
 *   nginx      — a reverse proxy that sets x-forwarded-for; the last entry
 *                is the one it appended, everything before it is hearsay.
 *   none       — nothing in front (local dev): every request shares one
 *                bucket rather than trusting a header.
 */
export type TrustedProxy = 'cloudflare' | 'nginx' | 'none';

export function trustedProxy(): TrustedProxy {
  const v = process.env.TRUSTED_PROXY?.trim().toLowerCase();
  if (v === 'cloudflare' || v === 'nginx' || v === 'none') return v;
  return process.env.NODE_ENV === 'production' ? 'cloudflare' : 'none';
}

/**
 * The address a rate limit counts against. An IPv4 address is itself; an
 * IPv6 host has a whole /64 to itself, so counting each address separately
 * gave one machine 2^64 fresh identities and no limit at all (2026-09-20).
 * Only the limiter key uses this — the real address still goes to
 * reCAPTCHA and into the contact notification, which want an address, not
 * a bucket.
 */
export function ipBucket(ip: string): string {
  // "::ffff:203.0.113.9" is an IPv4 address in IPv6 clothing.
  const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/i.exec(ip);
  if (mapped) return mapped[1];
  if (!ip.includes(':')) return ip;
  // Expand "::" so the first four hextets can be read off.
  const [head, tail = ''] = ip.split('::');
  const left = head ? head.split(':') : [];
  const right = tail ? tail.split(':') : [];
  const missing = Math.max(0, 8 - left.length - right.length);
  const hextets = [...left, ...Array(missing).fill('0'), ...right];
  if (hextets.length !== 8) return ip;
  return `${hextets
    .slice(0, 4)
    .map((h) => h.toLowerCase().replace(/^0+(?=.)/, ''))
    .join(':')}::/64`;
}

/** The limiter key for a request: the visitor's bucket plus the route. */
export function rateLimitKey(request: Request, route: string): string {
  return `${ipBucket(clientIp(request))}:${route}`;
}

export function clientIp(
  request: Request,
  proxy: TrustedProxy = trustedProxy(),
): string {
  if (proxy === 'cloudflare') {
    const cfIp = request.headers.get('cf-connecting-ip')?.trim();
    return cfIp || 'unknown';
  }
  if (proxy === 'nginx') {
    const forwarded = request.headers.get('x-forwarded-for');
    const last = forwarded?.split(',').at(-1)?.trim();
    return last || 'unknown';
  }
  return 'direct';
}
