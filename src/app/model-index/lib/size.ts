import type { Size } from '../data/types';

/**
 * Three size classes for open-weight models, by total parameters, plus
 * "undisclosed" for everything whose maker has not said. The boundaries
 * follow where the open-weight field actually clusters today: models under
 * 15B run on one consumer GPU, 15–100B on one server, above that on many.
 * Undisclosed is not "small": a closed model is simply not classed.
 */
export type SizeTier = 'small' | 'medium' | 'large' | 'undisclosed';

export const SIZE_TIERS: {
  id: SizeTier;
  label: string;
  hint: string;
}[] = [
  { id: 'small', label: 'Small · ≤ 15B', hint: 'Runs on one consumer GPU' },
  { id: 'medium', label: 'Medium · 15–100B', hint: 'Runs on one server' },
  { id: 'large', label: 'Large · > 100B', hint: 'Many accelerators' },
  { id: 'undisclosed', label: 'Undisclosed', hint: 'Maker has not said' },
];

export function tierOf(size: Size | undefined): SizeTier {
  if (!size) return 'undisclosed';
  if (size.paramsB <= 15) return 'small';
  if (size.paramsB <= 100) return 'medium';
  return 'large';
}

export const tierLabel = (t: SizeTier) =>
  SIZE_TIERS.find((x) => x.id === t)?.label ?? t;

/** "375B · A23B", "2.7T", "7B". */
export function sizeLabel(size: Size | undefined): string | null {
  if (!size) return null;
  const b = (n: number) =>
    n >= 1000 ? `${+(n / 1000).toFixed(1)}T` : `${+n.toFixed(n < 10 ? 1 : 0)}B`;
  return size.activeB
    ? `${b(size.paramsB)} · A${b(size.activeB)}`
    : b(size.paramsB);
}
