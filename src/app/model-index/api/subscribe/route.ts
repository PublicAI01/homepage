import { NextResponse } from 'next/server';

import { RECAPTCHA_SUBSCRIBE_ACTION } from '@/constant/contact';
import { guardContentHeaders, readJsonBody } from '@/server/http';
import {
  clientIp,
  rateLimitKey,
  subscribeRateLimiter,
} from '@/server/rate-limit';
import { verifyRecaptchaToken } from '@/server/recaptcha';
import { isRecord } from '@/server/validation';

/**
 * Sign up for Index Weekly. The list lives in Resend (an Audience), so the
 * site stores nothing; this route only forwards the address. Without the
 * two environment variables it answers 503 and the form says so — signing
 * up must never look like it worked when it did not.
 *
 *   RESEND_API_KEY      — from resend.com, sending domain publicai.io verified
 *   RESEND_AUDIENCE_ID  — the Audience that receives the weekly broadcast
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_TOKEN_LENGTH = 5000;

export async function POST(request: Request) {
  const key = process.env.RESEND_API_KEY;
  const audience = process.env.RESEND_AUDIENCE_ID;
  if (!key || !audience) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Subscriptions are not configured on this server yet.',
      },
      { status: 503 },
    );
  }
  // The same guards as the contact form: this route writes a third party's
  // address into the audience, so an unmetered caller could sign up anyone
  // (2026-09-10). The limiter is the floor; the captcha below is the
  // ceiling (2026-09-20) — a script with many machines could still have
  // signed strangers up one by one, and each unsubscribe complaint lands
  // on the sending domain.
  const headerError = guardContentHeaders(request);
  if (headerError) return headerError;
  const limit = subscribeRateLimiter.check(
    rateLimitKey(request, '/model-index/api/subscribe'),
  );
  if (!limit.allowed)
    return NextResponse.json(
      { ok: false, error: 'Too many sign-ups from here. Try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(limit.retryAfterSeconds) },
      },
    );
  const read = await readJsonBody(request);
  const body = read.ok && isRecord(read.body) ? read.body : {};
  const email =
    typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!EMAIL.test(email) || email.length > 254) {
    return NextResponse.json(
      { ok: false, error: 'That does not look like an email address.' },
      { status: 400 },
    );
  }
  const captcha = await checkCaptcha(request, body.recaptchaToken);
  if (captcha) return captcha;
  let res: Response;
  try {
    res = await fetch(`https://api.resend.com/audiences/${audience}/contacts`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${key}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ email, unsubscribed: false }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    // The status, never the body or the address: a rotated key (401), a
    // wrong audience (404) and a quota (429) all read as the same 502 to
    // the visitor, and nothing said so in the logs (2026-09-20).
    console.error(
      `subscribe: resend unreachable (${error instanceof Error ? error.name : 'error'})`,
    );
    return NextResponse.json(
      { ok: false, error: 'Could not sign you up right now. Try again later.' },
      { status: 502 },
    );
  }
  if (!res.ok && res.status !== 409) {
    console.error(`subscribe: resend answered ${res.status}`);
    return NextResponse.json(
      { ok: false, error: 'Could not sign you up right now. Try again later.' },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}

/**
 * The same reCAPTCHA Enterprise check the contact form makes. Where the
 * keys are not configured (local development, a preview build) there is
 * nothing to check against and the form still works; in production the
 * keys are set and a missing or bad token is refused. Never an exception:
 * a captcha outage must read as "try again", not as a crashed route.
 */
async function checkCaptcha(
  request: Request,
  token: unknown,
): Promise<NextResponse | null> {
  const apiKey = process.env.RECAPTCHA_SECRET_KEY;
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!apiKey || !siteKey) {
    if (process.env.NODE_ENV === 'production')
      return NextResponse.json(
        {
          ok: false,
          error: 'Subscriptions are not configured on this server yet.',
        },
        { status: 503 },
      );
    return null;
  }
  const failed = NextResponse.json(
    {
      ok: false,
      error:
        'Could not confirm you are a person. Reload the page and try again.',
    },
    { status: 400 },
  );
  if (
    typeof token !== 'string' ||
    token.length < 1 ||
    token.length > MAX_TOKEN_LENGTH
  )
    return failed;
  const ip = clientIp(request);
  const accepted = await verifyRecaptchaToken({
    apiKey,
    siteKey,
    token,
    expectedAction: RECAPTCHA_SUBSCRIBE_ACTION,
    remoteIp: ip === 'unknown' || ip === 'direct' ? undefined : ip,
  });
  return accepted ? null : failed;
}
