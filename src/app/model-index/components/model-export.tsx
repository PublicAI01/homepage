'use client';

import { useState } from 'react';

import { type CardSpec, downloadCard } from '../lib/export-card';

/**
 * The model's card as a PNG, one click. It sits on the model's own page:
 * whoever is posting about a launch wants this model's numbers, not the
 * table's, and the page already has them to hand.
 */
export default function ModelExport({
  spec,
  filename,
}: {
  spec: CardSpec;
  filename: string;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      onClick={() => {
        setBusy(true);
        downloadCard(spec, filename).finally(() => setBusy(false));
      }}
      className="text-caption inline-flex h-7 items-center gap-1.5 rounded-md border border-white/12 px-2.5 text-[#D9D7E0] transition-colors hover:border-white/30 hover:text-white disabled:opacity-40"
      title="Download this model's card as a PNG — score, rank and its best domains, ready to post">
      <span aria-hidden>↓</span> {busy ? 'Drawing…' : 'Export card'}
    </button>
  );
}
