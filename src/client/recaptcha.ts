'use client';

/**
 * A reCAPTCHA Enterprise token for one action, or null when there is no
 * site key (local development) or the script cannot be had. Tokens are
 * single-use with a short TTL, so request one per attempt. Shared by the
 * contact form and the Index Weekly sign-up (2026-09-20): both write a
 * third party's address somewhere, and both were once limited only by IP.
 *
 * The script is loaded on first use, not on page load: the sign-up sits
 * in the rail of every index page, and a lazily scheduled tag never fired
 * in a background tab, so the first submission had no token (2026-09-20).
 * Loading it when the visitor actually submits costs the reader nothing
 * and the subscriber one round trip.
 */
export const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export const RECAPTCHA_SCRIPT_SRC = RECAPTCHA_SITE_KEY
  ? `https://www.recaptcha.net/recaptcha/enterprise.js?render=${RECAPTCHA_SITE_KEY}`
  : null;

const LOAD_TIMEOUT_MS = 10_000;

let loading: Promise<void> | null = null;

/** Resolves once `window.grecaptcha.enterprise` is usable; rejects on timeout. */
export function ensureRecaptcha(): Promise<void> {
  if (!RECAPTCHA_SCRIPT_SRC) return Promise.reject(new Error('no site key'));
  if (typeof window.grecaptcha !== 'undefined') return Promise.resolve();
  loading ??= new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${RECAPTCHA_SCRIPT_SRC}"]`,
    );
    const script = existing ?? document.createElement('script');
    const timer = setTimeout(() => {
      loading = null;
      reject(new Error('recaptcha script timed out'));
    }, LOAD_TIMEOUT_MS);
    const done = () => {
      clearTimeout(timer);
      resolve();
    };
    script.addEventListener('load', done, { once: true });
    script.addEventListener(
      'error',
      () => {
        clearTimeout(timer);
        loading = null;
        reject(new Error('recaptcha script failed to load'));
      },
      { once: true },
    );
    if (!existing) {
      script.src = RECAPTCHA_SCRIPT_SRC;
      script.async = true;
      document.head.appendChild(script);
    } else if (typeof window.grecaptcha !== 'undefined') {
      done();
    }
  });
  return loading;
}

export async function requestRecaptchaToken(
  action: string,
): Promise<string | null> {
  if (!RECAPTCHA_SITE_KEY) return null;
  try {
    await ensureRecaptcha();
    const enterprise = window.grecaptcha.enterprise;
    await new Promise<void>((resolve) => enterprise.ready(resolve));
    return await enterprise.execute(RECAPTCHA_SITE_KEY, { action });
  } catch (error) {
    console.error(error);
    return null;
  }
}
