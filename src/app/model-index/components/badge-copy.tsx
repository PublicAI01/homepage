'use client';

import { useState } from 'react';

/**
 * The badge markdown, one click away instead of a code block nobody reads.
 * It lives on a model's own page, not on every leaderboard row: pasting a
 * badge is something a model's publisher does once, and charging every reader
 * of the table a line of chrome for it is the wrong trade.
 */
export default function BadgeCopy({ markdown }: { markdown: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() =>
        navigator.clipboard?.writeText(markdown).then(
          () => {
            setDone(true);
            setTimeout(() => setDone(false), 1600);
          },
          () => undefined,
        )
      }
      title="Markdown for a README or launch post — renders the live position"
      className="text-micro text-p1 hover:text-p1/80 shrink-0 underline underline-offset-2 transition-colors">
      {done ? 'Copied' : 'Copy markdown'}
    </button>
  );
}
