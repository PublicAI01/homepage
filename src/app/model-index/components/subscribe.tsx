'use client';

import Script from 'next/script';
import { useState } from 'react';

import {
  RECAPTCHA_SCRIPT_SRC,
  requestRecaptchaToken,
} from '@/client/recaptcha';
import { RECAPTCHA_SUBSCRIBE_ACTION } from '@/constant/contact';
import { cn } from '@/utils';

/**
 * The Index Weekly sign-up: one field, one button, the truth about what
 * happened. Posts to /model-index/api/subscribe, which forwards to the
 * mailing list and says 503 when that is not configured.
 */
export default function Subscribe({
  className,
  onSubscribed,
}: {
  className?: string;
  /** Called once the address is on the list, so a host can close itself. */
  onSubscribed?: () => void;
}) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>(
    'idle',
  );
  const [message, setMessage] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('busy');
    try {
      // A human at a keyboard, not a script signing up strangers: the
      // route writes the address into the mailing list (2026-09-20).
      const recaptchaToken = await requestRecaptchaToken(
        RECAPTCHA_SUBSCRIBE_ACTION,
      );
      const res = await fetch('/model-index/api/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, recaptchaToken }),
      });
      const body = (await res.json()) as { ok: boolean; error?: string };
      if (body.ok) {
        setState('done');
        setMessage('You are on the list. First issue next Monday.');
        onSubscribed?.();
      } else {
        setState('error');
        setMessage(body.error ?? 'Something went wrong.');
      }
    } catch {
      setState('error');
      setMessage('Could not reach the server.');
    }
  };

  return (
    <form
      onSubmit={submit}
      className={cn('flex flex-col gap-2', className)}>
      {RECAPTCHA_SCRIPT_SRC ? (
        <Script
          src={RECAPTCHA_SCRIPT_SRC}
          strategy="lazyOnload"
        />
      ) : null}
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          aria-label="Email address"
          disabled={state === 'busy' || state === 'done'}
          className="text-caption focus:border-primary h-8 min-w-0 flex-1 rounded-md border border-white/12 bg-transparent px-2.5 text-white outline-none placeholder:text-[#78758A] disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={state === 'busy' || state === 'done'}
          className="text-caption border-primary/60 bg-primary/15 hover:bg-primary/25 h-8 shrink-0 rounded-md border px-3 font-medium text-white transition-colors disabled:opacity-60">
          {state === 'busy'
            ? '…'
            : state === 'done'
              ? 'Subscribed'
              : 'Subscribe'}
        </button>
      </div>
      {message ? (
        <p
          role="status"
          className={cn(
            'text-micro',
            state === 'error' ? 'text-[#F5C86B]' : 'text-[#9C9AA8]',
          )}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
