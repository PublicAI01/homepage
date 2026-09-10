import { NextResponse } from 'next/server';

import { guardContentHeaders, readJsonBody } from '@/server/http';
import { clientIp, subscribeRateLimiter } from '@/server/rate-limit';
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
  // (2026-09-10). No captcha yet; the limiter is the floor, not the ceiling.
  const headerError = guardContentHeaders(request);
  if (headerError) return headerError;
  const limit = subscribeRateLimiter.check(
    `${clientIp(request)}:/model-index/api/subscribe`,
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
  const res = await fetch(
    `https://api.resend.com/audiences/${audience}/contacts`,
    {
      method: 'POST',
      headers: {
        authorization: `Bearer ${key}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ email, unsubscribed: false }),
    },
  );
  if (!res.ok && res.status !== 409) {
    return NextResponse.json(
      { ok: false, error: 'Could not sign you up right now. Try again later.' },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}
