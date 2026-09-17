'use client';

import { useSearchParams } from 'next/navigation';
import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';

import { decodeView, type ViewState } from '../lib/view-state';

export type TrackId = ViewState['track'];

/**
 * Which population the page is showing — text, image or video.
 *
 * The table switches it, but the rail beside the table is server-rendered
 * and knew nothing of the switch: with Image selected it still showed
 * "Models 964 · Leaderboards 18" and the text boards' weighting, which are
 * the wrong numbers for the page the reader is looking at (2026-09-16).
 * The choice lives here so the table and the rail read the same one.
 */
const Ctx = createContext<{
  track: TrackId;
  setTrack: (t: TrackId) => void;
} | null>(null);

export function TrackProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const initial = useMemo(
    () => decodeView(new URLSearchParams(searchParams.toString())).track,
    [searchParams],
  );
  const [track, setTrack] = useState<TrackId>(initial);
  const value = useMemo(() => ({ track, setTrack }), [track]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTrack() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useTrack outside TrackProvider');
  return ctx;
}

/** The one of three server-rendered variants that matches the track. */
export function ByTrack(props: Record<TrackId, ReactNode>) {
  const { track } = useTrack();
  return <>{props[track]}</>;
}
