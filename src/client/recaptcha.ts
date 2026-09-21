'use client';

/**
 * A reCAPTCHA Enterprise token for one action, or null when the script has
 * not loaded (or no site key is configured, as in local development).
 * Tokens are single-use with a short TTL, so request one per attempt.
 * Shared by the contact form and the Index Weekly sign-up (2026-09-20):
 * both write a third party's address somewhere, and both were once
 * limited only by IP.
 */
export const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export const RECAPTCHA_SCRIPT_SRC = RECAPTCHA_SITE_KEY
  ? `https://www.recaptcha.net/recaptcha/enterprise.js?render=${RECAPTCHA_SITE_KEY}`
  : null;

export async function requestRecaptchaToken(
  action: string,
): Promise<string | null> {
  if (!RECAPTCHA_SITE_KEY || typeof window.grecaptcha === 'undefined')
    return null;
  const enterprise = window.grecaptcha.enterprise;
  try {
    await new Promise<void>((resolve) => enterprise.ready(resolve));
    return await enterprise.execute(RECAPTCHA_SITE_KEY, { action });
  } catch (error) {
    console.error(error);
    return null;
  }
}
