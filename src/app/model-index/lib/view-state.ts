import type { SizeTier } from './size';

/**
 * Everything that shapes what the table shows, as a URL. A shared link, the
 * social-card image and the exported chart all read the same state, so what
 * a reader shares is what they filtered — never the unfiltered page.
 *
 *   ?rank=domain:Tool use&family=K2&size=large&min=0&reports=0&q=k2
 *
 * `model` is the row left open. It is in the URL for the same reason the
 * filters are: a link to "how this model scores" should land on the answer,
 * not on a table the reader still has to search.
 */
export interface ViewState {
  rank:
    | { level: 'overall' }
    | { level: 'category'; category: string }
    | { level: 'domain'; category?: string; domain: string };
  q: string;
  family: string;
  size: SizeTier | 'all';
  minBoards: number;
  reports: boolean;
  /** Model id whose detail card is open, '' for none. */
  model: string;
}

export const DEFAULT_VIEW: ViewState = {
  rank: { level: 'overall' },
  q: '',
  family: 'all',
  size: 'all',
  minBoards: 1,
  reports: true,
  model: '',
};

export function encodeView(v: ViewState): URLSearchParams {
  const p = new URLSearchParams();
  if (v.rank.level === 'category') p.set('rank', `category:${v.rank.category}`);
  if (v.rank.level === 'domain') p.set('rank', `domain:${v.rank.domain}`);
  if (v.q) p.set('q', v.q);
  if (v.family !== 'all') p.set('family', v.family);
  if (v.size !== 'all') p.set('size', v.size);
  if (v.minBoards !== DEFAULT_VIEW.minBoards) p.set('min', String(v.minBoards));
  if (!v.reports) p.set('reports', '0');
  if (v.model) p.set('model', v.model);
  return p;
}

const SIZES = new Set(['small', 'medium', 'large', 'xlarge', 'undisclosed']);

export function decodeView(p: URLSearchParams): ViewState {
  const v: ViewState = { ...DEFAULT_VIEW };
  const rank = p.get('rank');
  if (rank?.startsWith('category:'))
    v.rank = { level: 'category', category: rank.slice(9) };
  else if (rank?.startsWith('domain:'))
    v.rank = { level: 'domain', domain: rank.slice(7) };
  v.q = p.get('q') ?? '';
  v.family = p.get('family') || 'all';
  const size = p.get('size');
  v.size = size && SIZES.has(size) ? (size as SizeTier) : 'all';
  const min = Number(p.get('min'));
  v.minBoards = p.has('min') && Number.isInteger(min) && min >= 0 ? min : 1;
  v.reports = p.get('reports') !== '0';
  v.model = p.get('model') ?? '';
  return v;
}

/** "Tool use" / "Coding" / "Overall" — the scope as a person would say it. */
export const rankName = (r: ViewState['rank']) =>
  r.level === 'overall'
    ? 'Overall'
    : r.level === 'category'
      ? r.category
      : r.domain;

/** The scope string the query module understands for this rank. */
export const rankScope = (r: ViewState['rank']) =>
  r.level === 'overall'
    ? 'overall'
    : r.level === 'category'
      ? `category:${r.category}`
      : `domain:${r.domain}`;
