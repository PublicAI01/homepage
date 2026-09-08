'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/utils';

import Subscribe from './subscribe';

/**
 * The Index Weekly prompt, offered once a reader has actually stayed and
 * read. It is a corner card, never a full-screen interruption: the page is
 * a reference, and blocking the data to ask for an address would cost more
 * trust than the address is worth.
 *
 * Three conditions, all of them:
 *   - 25 seconds of *foreground* time, so a tab left open in the background
 *     never counts;
 *   - the reader scrolled past the fold, so a bounce never counts;
 *   - it has not been dismissed or completed before.
 *
 * Dismissing or subscribing is remembered forever. Asking twice is how a
 * prompt becomes a nuisance.
 */
const SEEN = 'publicai-index-weekly-prompt';
const FOREGROUND_MS = 25_000;
const SCROLLED_PX = 600;

/** localStorage throws in some embedded and privacy contexts; never let it break the page. */
function remembered() {
  try {
    return localStorage.getItem(SEEN) !== null;
  } catch {
    return true; // Cannot remember a dismissal, so never start asking.
  }
}
/** ?weekly=preview — show the card now, and never record a dismissal for it. */
function preview() {
  try {
    return (
      new URLSearchParams(window.location.search).get('weekly') === 'preview'
    );
  } catch {
    return false;
  }
}
function remember() {
  try {
    localStorage.setItem(SEEN, String(Date.now()));
  } catch {
    /* Nothing to do: the prompt simply reappears on the next visit. */
  }
}

export default function SubscribePrompt() {
  const [open, setOpen] = useState(false);
  // Mounted hidden, then flipped on the next frame so the card slides in
  // rather than appearing; this project carries no animation plugin.
  const [shown, setShown] = useState(false);

  // Mount, then flip on a later task so the transition has a frame to run
  // from. Not requestAnimationFrame: it never fires in a hidden tab, and
  // the card must be waiting when the reader comes back to it.
  const open_ = () => {
    setOpen(true);
    window.setTimeout(() => setShown(true), 30);
  };

  useEffect(() => {
    // ?weekly=preview shows the card at once, so its wording and placement
    // can be checked without sitting through the wait. It never records a
    // dismissal, so it can be opened again.
    if (preview()) {
      const id = window.setTimeout(open_, 0);
      return () => window.clearTimeout(id);
    }
    if (remembered()) return;

    let foreground = 0;
    let since = document.visibilityState === 'visible' ? Date.now() : 0;
    let scrolled = window.scrollY > SCROLLED_PX;

    const onScroll = () => {
      if (window.scrollY > SCROLLED_PX) {
        scrolled = true;
        window.removeEventListener('scroll', onScroll);
      }
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') since = Date.now();
      else if (since) {
        foreground += Date.now() - since;
        since = 0;
      }
    };
    const tick = () => {
      const total = foreground + (since ? Date.now() - since : 0);
      if (total >= FOREGROUND_MS && scrolled) {
        open_();
        stop();
      }
    };
    const timer = window.setInterval(tick, 1000);
    const stop = () => {
      window.clearInterval(timer);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    return stop;
  }, []);

  const close = () => {
    if (!preview()) remember();
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // A completed sign-up closes itself, so the confirmation is readable first.
  const onSubscribed = () => {
    remember();
    window.setTimeout(() => setOpen(false), 3000);
  };

  if (!open) return null;

  return (
    <div
      id="weekly-prompt"
      role="dialog"
      aria-label="Subscribe to Index Weekly"
      className={cn(
        'fixed inset-x-3 bottom-3 z-40 rounded-xl border border-[#2C2C31] bg-[#111015]/95 p-4 shadow-2xl backdrop-blur-sm transition-all duration-300 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-80',
        shown ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
      )}>
      <button
        type="button"
        onClick={close}
        aria-label="Dismiss"
        className="text-body-sm absolute top-2.5 right-3 leading-none text-[#78758A] transition-colors hover:text-white">
        ×
      </button>
      <p className="text-body-sm mb-1 pr-5 font-semibold text-white">
        Index Weekly
      </p>
      <p className="text-caption mb-2.5 text-[#9C9AA8]">
        Mondays: the week’s biggest moves across every board. No other mail.
      </p>
      <Subscribe onSubscribed={onSubscribed} />
    </div>
  );
}
