'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { cn } from '@/utils';

import type { Benchmark, Catalog, Model, Score } from '../data/types';
import {
  type Channel,
  channelsOf,
  contextLabel,
  priceLabel,
} from '../lib/access';
import {
  aggregate,
  type AggregateRow,
  compareScores,
  type NormalizedScore,
} from '../lib/aggregate';
import { type BoardView, groupBoards } from '../lib/boards';
import { downloadChart } from '../lib/export-chart';
import { familyOf } from '../lib/family';
import { SIZE_TIERS, sizeLabel, type SizeTier, tierOf } from '../lib/size';
import {
  decodeView,
  encodeView,
  rankName,
  type ViewState,
} from '../lib/view-state';
import {
  categoryRank,
  domainLabel,
  FALLBACK_BADGE,
  MIN_SOURCES,
  OVERALL,
  PRIOR_FRACTION,
  REPORT_BADGE,
  SOURCE_BADGE,
  SOURCE_LOGO,
  weightsFor,
} from '../lib/weights';
import { LinkedInMark, XMark } from './social-marks';

const PANEL = 'rounded-xl border border-[#2C2C31] bg-white/[0.045]';
const INDEX_TONE = 'text-white';
// `color-scheme: dark` is for the native popup. A <select>'s option list is
// drawn by the OS on Windows and Linux, not by the page, and it takes the
// system's light theme unless told otherwise — so `text-white` inherited by
// the options became white on white, and the list looked empty except for
// the highlighted row (reported from a colleague's machine; macOS paints its
// own popup and never showed it). The explicit option colours are for the
// browsers that draw the list themselves but ignore color-scheme.
const CONTROL =
  'text-caption h-8 rounded-md border border-white/12 bg-transparent px-2.5 text-white outline-none transition-colors hover:border-white/25 focus:border-primary [color-scheme:dark] [&>option]:bg-[#0B0B0D] [&>option]:text-white';
const CHIP =
  'text-caption rounded-md border px-2.5 py-1 font-medium transition-colors';
const CHIP_ON = 'border-white/40 bg-white/10 text-white';
const CHIP_OFF =
  'text-g2 border-transparent hover:border-white/15 hover:text-white';
const LABEL = 'text-micro tracking-[0.14em] text-[#78758A] uppercase';
const PAGE = 100;

interface Props {
  models: Model[];
  benchmarks: Benchmark[];
  scores: Score[];
  catalogs: Catalog[];
  generatedAt: string;
  /** Models that entered the index recently — computed on the server, because
      the history file is a quarter of a megabyte and this is a list of ids. */
  newcomers: { ids: string[]; from: string; until: string };
}

/* Twenty, not ten: the exported chart is portrait for phone timelines, and
   ten rows would leave half of it empty. */
const CHART_ROWS = 20;
const INDEX_ORIGIN = 'https://publicai.io/model-index';
const INDEX_URL = 'https://publicai.io/model-index';

/** What the table is ranked by: the overall index, a category, or a domain inside one. */
type RankKey =
  | { level: 'overall' }
  | { level: 'category'; category: string }
  | { level: 'domain'; category: string; domain: string };

const fmt = (n: number | null | undefined) =>
  n === null || n === undefined ? '—' : n.toFixed(1);

/** Raw scores print in their own units, so a reader can check them against the source. */
function rawLabel(metric: Benchmark['metric'], raw: number) {
  if (metric === 'elo') return String(Math.round(raw));
  if (metric === 'percent') return `${raw}%`;
  return String(raw);
}

/** "2026-09-08" → "8 Sep". */
const shortDay = (iso: string) =>
  iso
    ? new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        timeZone: 'UTC',
      })
    : '';

/** Wide disagreement between boards is a caveat on the aggregate, so it is shown. */
function agreement(d: number) {
  if (d >= 18) return { label: 'boards disagree', tone: 'text-[#F08A8A]' };
  if (d >= 9) return { label: 'mixed', tone: 'text-[#F5C86B]' };
  return { label: 'consistent', tone: 'text-[#9C9AA8]' };
}

const keyOf = (row: AggregateRow, k: RankKey): number | null => {
  if (k.level === 'overall') return row.score;
  if (k.level === 'category') return row.byCategory[k.category] ?? null;
  return row.byDomain[k.domain] ?? null;
};

/**
 * Overall ranks on independent publishers; a category or domain ranks any
 * model a recognised board has measured in that scope, on that measurement.
 * Reports alone never rank anywhere.
 */
const eligible = (row: AggregateRow, k: RankKey): boolean =>
  k.level === 'overall'
    ? row.ranked
    : k.level === 'category'
      ? (row.boardsByCategory[k.category] ?? 0) > 0
      : (row.boardsByDomain[k.domain] ?? 0) > 0;

const rankLabel = (k: RankKey) =>
  k.level === 'overall'
    ? 'Overall'
    : k.level === 'category'
      ? domainLabel(k.category)
      : domainLabel(k.domain);

/**
 * A source's mark: its own logo where the site holds one, its code badge
 * otherwise. Reports keep the shared ✱ in the table so the grade of
 * evidence reads at a glance; their logos appear where the report is
 * named. Absent = dimmed, so a row's row of marks reads like a checklist.
 */
export function SourceBadge({
  source,
  present,
  detail,
  label: given,
  logo = source.kind !== 'report',
}: {
  source: BoardView;
  present: boolean;
  detail?: string;
  /** Overrides the tooltip, for a badge standing in for several boards. */
  label?: string;
  /** Show the logo (default for boards) rather than the code badge. */
  logo?: boolean;
}) {
  const badge =
    source.kind === 'report'
      ? REPORT_BADGE
      : (SOURCE_BADGE[source.id] ?? FALLBACK_BADGE);
  const name = source.name;
  const label =
    given ??
    (present
      ? `${name}${detail ? ` — ${detail}` : ''}`
      : `${name} — not listed`);
  const src = logo ? SOURCE_LOGO[source.id] : undefined;
  if (src) {
    return (
      <span
        title={label}
        aria-label={label}
        className={cn(
          'inline-flex size-5 shrink-0 items-center justify-center rounded bg-white/[0.06]',
          present ? '' : 'opacity-25 grayscale',
        )}>
        {/* eslint-disable-next-line @next/next/no-img-element -- a 16px mark; next/image adds nothing here */}
        <img
          src={src}
          alt=""
          width={16}
          height={16}
          className="size-4 object-contain"
        />
      </span>
    );
  }
  return (
    <span
      title={label}
      aria-label={label}
      className={cn(
        'text-micro inline-flex h-5 min-w-6 items-center justify-center rounded border px-0.5 font-mono font-semibold tracking-wide',
        present
          ? badge.tone
          : 'border-dashed border-white/12 text-white/25 opacity-70',
      )}>
      {badge.code}
    </span>
  );
}

/**
 * One mark per publisher, not per board. Artificial Analysis runs three of
 * the fifteen, and three identical marks in a row read as a rendering fault;
 * the ranking rule already counts them as a single voice, so the strip says
 * the same thing. A publisher with more than one board carries the count of
 * those that scored the model, the way the reports chip already does.
 */
function PublisherBadge({
  group,
  scored,
}: {
  group: BoardView[];
  scored: Map<string, NormalizedScore>;
}) {
  const hits = group.filter((b) => scored.has(b.headline.id));
  const label = group
    .map((b) => {
      const s = scored.get(b.headline.id);
      return `${b.name} — ${s ? rawLabel(b.headline.metric, s.raw) : 'not listed'}`;
    })
    .join('\n');
  return (
    <span className="relative inline-flex shrink-0">
      <SourceBadge
        source={group[0]}
        present={hits.length > 0}
        detail={undefined}
        label={label}
      />
      {group.length > 1 ? (
        <span
          aria-hidden
          className={cn(
            'text-micro bg-b1 pointer-events-none absolute -right-1 -bottom-1 rounded-sm px-0.5 font-mono leading-none',
            hits.length > 0 ? 'text-p1' : 'text-white/25',
          )}>
          {hits.length}
        </span>
      ) : null}
    </span>
  );
}

export default function IndexTable({
  models,
  benchmarks,
  scores,
  catalogs,
  generatedAt,
  newcomers,
}: Props) {
  const searchParams = useSearchParams();
  // The URL sets the filters on first render — on the server and the client
  // alike, so a shared link opens on exactly the view that was shared.
  const initial = useMemo(
    () => decodeView(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );
  const [rankKey, setRankKey] = useState<RankKey>(() => {
    const r = initial.rank;
    if (r.level === 'category')
      return { level: 'category', category: r.category };
    if (r.level === 'domain') {
      const category = benchmarks.find((b) => b.domain === r.domain)?.category;
      if (category) return { level: 'domain', category, domain: r.domain };
    }
    return { level: 'overall' };
  });
  const [query, setQuery] = useState(initial.q);
  const [family, setFamily] = useState(initial.family);
  // Everything a recognised board has scored is listed; ranked rows come
  // first, provisional ones after, so a model on one board is visible
  // without being ranked on that one board's word.
  const [minBoards, setMinBoards] = useState(initial.minBoards);
  const [openModel, setOpenModel] = useState<string | null>(
    initial.model || null,
  );
  const [onlyNew, setOnlyNew] = useState(initial.onlyNew);
  // Reports ✱ — launch posts, blogs, write-ups — are in by default and can
  // be switched off, which drops their figures from every score and hides
  // models nothing else has measured.
  const [includeReports, setIncludeReports] = useState(initial.reports);
  const [sizeTier, setSizeTier] = useState<SizeTier | 'all'>(initial.size);

  const weights = useMemo(() => {
    const w = weightsFor(benchmarks);
    if (!includeReports)
      for (const b of benchmarks) if (b.kind === 'report') w[b.id] = 0;
    return w;
  }, [benchmarks, includeReports]);
  const sources = useMemo(() => groupBoards(benchmarks), [benchmarks]);
  const boards = useMemo(
    () => sources.filter((s) => s.kind !== 'report'),
    [sources],
  );
  // Grouped for the row strip: one mark per publisher, in registry order.
  const publishers = useMemo(() => {
    const byPublisher = new Map<string, BoardView[]>();
    for (const b of boards) {
      const key = b.headline.publisher;
      byPublisher.set(key, [...(byPublisher.get(key) ?? []), b]);
    }
    return [...byPublisher.values()];
  }, [boards]);
  const reports = useMemo(
    () => sources.filter((s) => s.kind === 'report'),
    [sources],
  );

  /** category → its domains, in first-seen order; categories in display order. */
  const taxonomy = useMemo(() => {
    const m = new Map<string, string[]>();
    for (const b of benchmarks) {
      const list = m.get(b.category) ?? [];
      if (!list.includes(b.domain)) list.push(b.domain);
      m.set(b.category, list);
    }
    return [...m.entries()].sort(
      (a, b) =>
        categoryRank(a[0]) - categoryRank(b[0]) || a[0].localeCompare(b[0]),
    );
  }, [benchmarks]);

  const families = useMemo(
    () =>
      [...new Set(models.map((m) => familyOf(m.name)))].sort((a, b) =>
        a.localeCompare(b, 'en', { sensitivity: 'base' }),
      ),
    [models],
  );

  const rows = useMemo(
    () =>
      aggregate({
        models,
        benchmarks,
        scores,
        weights,
        overall: OVERALL,
        priorFraction: PRIOR_FRACTION,
        minSources: MIN_SOURCES,
      }),
    [models, benchmarks, scores, weights],
  );

  const rankOf = useMemo(() => {
    const m = new Map<string, number>();
    let n = 0;
    for (const r of rows) if (r.ranked) m.set(r.model.id, ++n);
    return m;
  }, [rows]);

  const isNew = useMemo(() => new Set(newcomers.ids), [newcomers.ids]);
  const newNames = useMemo(
    () =>
      newcomers.ids
        .map((id) => models.find((m) => m.id === id)?.name)
        .filter((n): n is string => Boolean(n)),
    [newcomers.ids, models],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = rows.filter((r) => {
      if (onlyNew && !isNew.has(r.model.id)) return false;
      if (r.covered < minBoards) return false;
      if (!includeReports && r.covered === 0) return false;
      if (family !== 'all' && familyOf(r.model.name) !== family) return false;
      if (sizeTier !== 'all' && tierOf(r.model.size) !== sizeTier) return false;
      if (q && !`${r.model.name} ${r.model.org}`.toLowerCase().includes(q))
        return false;
      return true;
    });
    if (rankKey.level !== 'overall') {
      const by = compareScores<AggregateRow>((r) => keyOf(r, rankKey));
      out = [...out]
        // A model with no figure in this scope is not "last": it is absent.
        .filter((r) => keyOf(r, rankKey) !== null)
        // With reports in, a row sits where its figure puts it and carries
        // a ✱ instead of a number if no board measured it here. With
        // reports out, only board-measured rows remain in this scope.
        .filter((r) => includeReports || eligible(r, rankKey))
        .sort(by);
    }
    return out;
  }, [
    rows,
    query,
    family,
    minBoards,
    rankKey,
    includeReports,
    sizeTier,
    onlyNew,
    isNew,
  ]);

  const rankedCount = rows.filter((r) => r.ranked).length;
  const shown = filtered.slice(0, PAGE);
  // Position in the list on screen, for rows eligible in this scope. On
  // Overall that is the model's rank; in a scope it is its place there.
  const positionOf = useMemo(() => {
    const m = new Map<string, number>();
    if (rankKey.level === 'overall') return rankOf;
    // In a scope every listed row is numbered by where it sits; a row placed
    // by report figures alone carries a ✱ after its number, so the grade of
    // evidence shows without the place being taken away.
    let n = 0;
    for (const r of filtered) m.set(r.model.id, ++n);
    return m;
  }, [filtered, rankKey, rankOf]);
  const coverable = rows[0]?.coverable ?? boards.length;
  const catalogDate = catalogs[0]?.retrievedAt;

  /**
   * A scope no recognised board measures yet is ranked on report figures
   * alone — a comparison set the publisher chose, usually small and
   * missing the frontier. That is a different grade of ranking and the
   * table says so above the rows.
   */
  const scopeBoards = useMemo(() => {
    if (rankKey.level === 'overall') return null;
    const inScope = benchmarks.filter((b) =>
      rankKey.level === 'category'
        ? b.category === rankKey.category
        : b.domain === rankKey.domain,
    );
    return {
      boards: new Set(
        inScope.filter((b) => b.kind !== 'report').map((b) => b.group),
      ).size,
      reports: new Set(
        inScope.filter((b) => b.kind === 'report').map((b) => b.source),
      ),
    };
  }, [benchmarks, rankKey]);

  const activeCategory = rankKey.level === 'overall' ? null : rankKey.category;
  const activeDomains = activeCategory
    ? (taxonomy.find(([c]) => c === activeCategory)?.[1] ?? [])
    : [];

  // ---- the view as a URL ----------------------------------------------------
  // The filters keep the URL current, so the address bar is always a link
  // to exactly this view.
  const view: ViewState = useMemo(
    () => ({
      rank:
        rankKey.level === 'overall'
          ? { level: 'overall' }
          : rankKey.level === 'category'
            ? { level: 'category', category: rankKey.category }
            : {
                level: 'domain',
                category: rankKey.category,
                domain: rankKey.domain,
              },
      q: query.trim(),
      family,
      size: sizeTier,
      minBoards,
      reports: includeReports,
      model: openModel ?? '',
      onlyNew,
    }),
    [
      rankKey,
      query,
      family,
      sizeTier,
      minBoards,
      includeReports,
      openModel,
      onlyNew,
    ],
  );
  const viewQuery = useMemo(() => encodeView(view).toString(), [view]);
  useEffect(() => {
    const next = `${window.location.pathname}${viewQuery ? `?${viewQuery}` : ''}`;
    if (next !== `${window.location.pathname}${window.location.search}`)
      window.history.replaceState(null, '', next);
  }, [viewQuery]);

  // A link that opens a card should show it. Without this the page lands at
  // the top and the card sits somewhere below the fold, which reads as a
  // broken link rather than a deep one. Runs once, on the id the URL carried.
  useEffect(() => {
    if (!initial.model) return;
    // After paint, not during it: on mount the rows are in the DOM but the
    // router still restores scroll to the top afterwards, so scrolling here
    // synchronously is undone a frame later and the link looks broken.
    const t = setTimeout(() => {
      document
        .getElementById(`model-${initial.model}`)
        ?.scrollIntoView({ block: 'center' });
    }, 120);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shareUrl = `${INDEX_ORIGIN}${viewQuery ? `?${viewQuery}` : ''}`;
  const shareText = (() => {
    const tier = SIZE_TIERS.find((t) => t.id === sizeTier);
    const what = `${rankName(view.rank)}${tier ? ` · ${tier.label}` : ''}${family !== 'all' ? ` · ${family}` : ''}`;
    const top = filtered.slice(0, 3).map((r) => r.model.name);
    return `Top models by ${what} on the PublicAI Index${top.length ? `: ${top.join(', ')}…` : ''}`;
  })();
  const [copied, setCopied] = useState(false);
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt('Copy this link', shareUrl);
    }
  };

  // Overall lists rows with no figure to chart (no index, no estimate), so
  // "something on screen" is not "something to export".
  const exportable = useMemo(
    () => filtered.filter((r) => keyOf(r, rankKey) !== null),
    [filtered, rankKey],
  );
  const exportChart = () => {
    const top = exportable.slice(0, CHART_ROWS);
    if (top.length === 0) return;
    const scope = rankLabel(rankKey);
    const tier = SIZE_TIERS.find((t) => t.id === sizeTier);
    downloadChart(
      {
        title: `Top ${top.length} models — ${scope}${tier ? ` · ${tier.label}` : ''}`,
        scope,
        // Position within this scope, not the Overall rank: a chart titled
        // "Coding" numbered 1, 3, 4, 8 would read as an error.
        rows: top.map((r) => ({
          rank: positionOf.get(r.model.id) ?? null,
          inScope: rankKey.level === 'overall' || eligible(r, rankKey),
          name: r.model.name,
          org: r.model.org,
          score: keyOf(r, rankKey) ?? 0,
          covered: r.covered,
          coverable: r.coverable,
        })),
        generatedAt,
        url: INDEX_URL,
      },
      `publicai-index-${scope.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${generatedAt.slice(0, 10)}.png`,
    );
  };

  return (
    <div>
      {/* ---------------- rank by: category, then domain ---------------- */}
      <div
        role="tablist"
        aria-label="Rank by category"
        className="flex flex-wrap items-center gap-1">
        <span className={cn(LABEL, 'mr-2')}>Rank by</span>
        <button
          type="button"
          role="tab"
          aria-selected={rankKey.level === 'overall'}
          onClick={() => setRankKey({ level: 'overall' })}
          className={cn(
            CHIP,
            rankKey.level === 'overall' ? CHIP_ON : CHIP_OFF,
          )}>
          Overall
        </button>
        {taxonomy.map(([category, domains]) => {
          const on = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setRankKey({ level: 'category', category })}
              className={cn(CHIP, on ? CHIP_ON : CHIP_OFF)}>
              {domainLabel(category)}
              <span className="ml-1.5 font-mono text-[10px] opacity-50">
                {domains.length}
              </span>
            </button>
          );
        })}
      </div>

      {activeCategory ? (
        <div
          role="tablist"
          aria-label={`Rank by domain within ${activeCategory}`}
          className="border-primary/40 mt-1.5 flex flex-wrap items-center gap-1 border-l-2 pl-3">
          <button
            type="button"
            role="tab"
            aria-selected={rankKey.level === 'category'}
            onClick={() =>
              setRankKey({ level: 'category', category: activeCategory })
            }
            className={cn(
              CHIP,
              rankKey.level === 'category' ? CHIP_ON : CHIP_OFF,
            )}>
            All {domainLabel(activeCategory).toLowerCase()}
          </button>
          {activeDomains.map((domain) => {
            const on = rankKey.level === 'domain' && rankKey.domain === domain;
            return (
              <button
                key={domain}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() =>
                  setRankKey({
                    level: 'domain',
                    category: activeCategory,
                    domain,
                  })
                }
                className={cn(CHIP, on ? CHIP_ON : CHIP_OFF)}>
                {domainLabel(domain)}
              </button>
            );
          })}
        </div>
      ) : null}

      {/* ---------------- filters ---------------- */}
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/8 pt-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search model"
          aria-label="Search"
          className={cn(CONTROL, 'w-60 placeholder:text-[#78758A]')}
        />
        <select
          value={family}
          onChange={(e) => setFamily(e.target.value)}
          aria-label="Model line"
          className={CONTROL}>
          <option value="all">All models</option>
          {families.map((f) => (
            <option
              key={f}
              value={f}>
              {f}
            </option>
          ))}
        </select>
        <select
          value={sizeTier}
          onChange={(e) => setSizeTier(e.target.value as SizeTier | 'all')}
          aria-label="Model size"
          title="Total parameters. Counted from the weights for open models, read from the name otherwise; closed models are undisclosed, not estimated."
          className={CONTROL}>
          <option value="all">All sizes</option>
          {SIZE_TIERS.map((t) => (
            <option
              key={t.id}
              value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
        <select
          value={minBoards}
          onChange={(e) => setMinBoards(Number(e.target.value))}
          aria-label="Minimum recognised boards"
          className={CONTROL}>
          <option value={0}>Any coverage (incl. report-only)</option>
          {Array.from({ length: coverable }, (_, i) => i + 1).map((n) => (
            <option
              key={n}
              value={n}>
              {n === 1 ? 'At least 1 board' : `Scored by ${n}+ boards`}
            </option>
          ))}
        </select>
        <label
          className="text-caption flex cursor-pointer items-center gap-1.5 text-[#D9D7E0] select-none"
          title="Launch posts, blogs and write-ups. Off: their figures leave every score and models nothing else measured are hidden.">
          <input
            type="checkbox"
            checked={includeReports}
            onChange={(e) => setIncludeReports(e.target.checked)}
            className="accent-primary size-3.5"
          />
          Include reports{' '}
          <span className={cn('font-mono', REPORT_BADGE.tone.split(' ').pop())}>
            ✱
          </span>
        </label>
      </div>

      {/* Whole-column caveat, not a per-row one: when no board measures this
          scope, every figure in it is a publisher's chosen comparison set,
          and a reader scanning the order needs that in one line. The detail
          lives on the hover. */}
      {scopeBoards && scopeBoards.boards === 0 ? (
        <p
          role="note"
          title={`Every figure here is from ${[...scopeBoards.reports].join(' and ')} ✱ — a comparison set the publisher chose. Models the publisher left out are absent, not behind. Read the order as "within that set", not as the field.`}
          className="text-caption mt-3 flex items-baseline gap-2 text-[#C9A961]">
          <span aria-hidden>✱</span>
          <span>
            No board measures {rankLabel(rankKey)} yet — every figure below is
            from a report, ordered within the set its publisher chose.
          </span>
        </p>
      ) : null}
      {/* A new model arriving is otherwise silent: it lands wherever its score
          puts it, and unless you already knew its name you would never see it.
          Above the table, not behind a tab — a tab still asks you to go look. */}
      {newcomers.ids.length && !onlyNew ? (
        <div className="text-caption mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-[#7C5CFF]/30 bg-[#7C5CFF]/8 px-3 py-2">
          <span className="text-p1 font-semibold">
            {newcomers.ids.length} new
          </span>
          <span className="text-[#B9B7C4]">
            since {shortDay(newcomers.from)} · {newNames.slice(0, 3).join(', ')}
            {newNames.length > 3 ? ` and ${newNames.length - 3} more` : ''}
          </span>
          <button
            type="button"
            onClick={() => setOnlyNew(true)}
            className="text-p1 hover:text-p1/80 ml-auto shrink-0 underline underline-offset-2">
            Show them →
          </button>
        </div>
      ) : null}
      {onlyNew ? (
        <div className="text-caption mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-[#7C5CFF]/30 bg-[#7C5CFF]/8 px-3 py-2">
          <span className="text-p1 font-semibold">New models only</span>
          <span className="text-[#B9B7C4]">
            entered since {shortDay(newcomers.from)}
          </span>
          <button
            type="button"
            onClick={() => setOnlyNew(false)}
            className="text-p1 hover:text-p1/80 ml-auto shrink-0 underline underline-offset-2">
            Show everything
          </button>
        </div>
      ) : null}
      <div className="text-caption mt-3 mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[#78758A]">
        <p>
          <span className="text-[#D9D7E0]">{rankedCount}</span> ranked ·{' '}
          <span className="text-[#D9D7E0]">{rows.length - rankedCount}</span>{' '}
          provisional · showing{' '}
          <span className="text-[#D9D7E0]">
            {shown.length}
            {filtered.length > shown.length ? ` of ${filtered.length}` : ''}
          </span>
          {rankKey.level !== 'overall' ? (
            <>
              {' '}
              · ranked by{' '}
              <span className="text-[#D9D7E0]">{rankLabel(rankKey)}</span>
            </>
          ) : null}
        </p>
        <span className="ml-auto flex items-center gap-1.5">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-caption inline-flex h-7 items-center gap-1.5 rounded-md border border-white/12 px-2.5 text-[#D9D7E0] transition-colors hover:border-white/30 hover:text-white"
            title="Share this view on X — the card shows this view’s top ten">
            <XMark />
            Share
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-caption inline-flex h-7 items-center gap-1.5 rounded-md border border-white/12 px-2.5 text-[#D9D7E0] transition-colors hover:border-white/30 hover:text-white"
            title="Share this view on LinkedIn — the card shows this view’s top ten">
            <LinkedInMark />
            Share
          </a>
          <button
            type="button"
            onClick={copyLink}
            className="text-caption inline-flex h-7 items-center rounded-md border border-white/12 px-2.5 text-[#D9D7E0] transition-colors hover:border-white/30 hover:text-white"
            title="Copy a link to exactly this view">
            {copied ? 'Copied' : 'Copy link'}
          </button>
        </span>
        <button
          type="button"
          onClick={exportChart}
          disabled={exportable.length === 0}
          className="text-caption inline-flex h-7 items-center gap-1.5 rounded-md border border-white/12 px-2.5 text-[#D9D7E0] transition-colors hover:border-white/30 hover:text-white disabled:opacity-40"
          title={`Download a PNG bar chart of the top ${CHART_ROWS} rows as filtered and ranked here`}>
          <span aria-hidden>↓</span> Export chart
        </button>
      </div>

      {/* ---------------- table ---------------- */}
      <div className={cn(PANEL, 'overflow-x-auto')}>
        <table className="text-body-sm w-full border-collapse text-left whitespace-nowrap">
          <thead>
            <tr className="text-micro bg-white/4 tracking-[0.1em] text-[#78758A] uppercase">
              <th className="w-10 px-2.5 py-3 font-medium">#</th>
              <th className="px-2.5 py-3 font-medium">Model</th>
              <th
                className={cn(
                  'px-2.5 py-3 text-right font-medium',
                  rankKey.level === 'overall' && 'text-white',
                )}>
                Index
              </th>
              {rankKey.level !== 'overall' ? (
                <th className="max-w-28 px-2.5 py-3 text-right leading-tight font-medium whitespace-normal text-white">
                  {rankLabel(rankKey)}
                </th>
              ) : null}
              {/* On a phone the badges would force a sideways scroll; the card has them. */}
              <th className="hidden px-2.5 py-3 font-medium sm:table-cell">
                Sources
              </th>
              <th className="w-8 px-2.5 py-3" />
            </tr>
          </thead>
          <tbody>
            {shown.map((row) => (
              <Row
                key={row.model.id}
                row={row}
                rank={rankOf.get(row.model.id)}
                isNew={isNew.has(row.model.id)}
                position={positionOf.get(row.model.id)}
                inScope={eligible(row, rankKey)}
                rankKey={rankKey}
                taxonomy={taxonomy}
                boards={boards}
                publishers={publishers}
                reports={reports}
                catalogDate={catalogDate}
                open={openModel === row.model.id}
                onToggle={() =>
                  setOpenModel(openModel === row.model.id ? null : row.model.id)
                }
              />
            ))}
            {shown.length === 0 ? (
              <tr className="border-t border-white/8">
                <td
                  colSpan={6}
                  className="text-g2 px-3 py-6 text-center">
                  Nothing matches these filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <p className="text-caption text-g2 mt-3">
        0–100, standardized: 50 is the average of the models each source lists.
        Provisional = fewer than {MIN_SOURCES} independent publishers. ✱ = from
        reports. Open a row for the model card.
        {filtered.length > shown.length
          ? ` Showing the first ${PAGE} of ${filtered.length}.`
          : ''}
      </p>
    </div>
  );
}

function Row({
  row,
  rank,
  position,
  inScope,
  rankKey,
  taxonomy,
  boards,
  publishers,
  reports,
  catalogDate,
  open,
  onToggle,
  isNew,
}: {
  row: AggregateRow;
  rank: number | undefined;
  position: number | undefined;
  inScope: boolean;
  rankKey: RankKey;
  taxonomy: [string, string[]][];
  boards: BoardView[];
  /** Boards grouped by publisher, for the strip. */
  publishers: BoardView[][];
  reports: BoardView[];
  catalogDate: string | undefined;
  open: boolean;
  onToggle: () => void;
  isNew: boolean;
}) {
  const thin = row.ranked && row.covered < row.coverable;
  const scored = new Map(row.perBenchmark.map((s) => [s.benchmarkId, s]));
  const reportsScoring = reports.filter((r) =>
    r.measures.some((m) => scored.has(m.id)),
  );

  return (
    <>
      <tr
        id={`model-${row.model.id}`}
        className={cn(
          'cursor-pointer border-t border-white/8 align-middle transition-colors hover:bg-white/4',
          open && 'bg-white/[0.06]',
        )}
        onClick={onToggle}
        aria-expanded={open}>
        <td className="text-g2 px-2.5 py-2.5 font-mono">
          {position === undefined ? (
            <span
              title={`Provisional — fewer than ${MIN_SOURCES} independent publishers`}>
              —
            </span>
          ) : inScope || rankKey.level === 'overall' ? (
            position
          ) : (
            <span
              className="text-[#B9B7C4]"
              title="Placed by report ✱ figures only; no recognised board measures this model here">
              {position}
              <span className="text-[#E8A9F0]">✱</span>
            </span>
          )}
        </td>
        {/* Names wrap; the table never scrolls sideways because one label is long. */}
        <td className="min-w-52 px-2.5 py-2.5 whitespace-normal">
          {/* The name is the model's page. Clicking anywhere else on the row
              still opens the card — the summary and the full answer each get
              a target, and neither is hidden behind the other. */}
          <a
            href={`/model-index/m/${row.model.id}`}
            onClick={(e) => e.stopPropagation()}
            title={`${row.model.name} — every domain, every source`}
            className={cn(
              'font-semibold underline-offset-2 hover:underline',
              inScope ? 'text-white' : 'text-[#B9B7C4]',
            )}>
            {row.model.name}
          </a>
          <span className="text-g2 ml-2 text-xs">{row.model.org}</span>
          {sizeLabel(row.model.size) ? (
            <span
              className="text-micro ml-2 font-mono text-[#78758A]"
              title={
                row.model.size?.source === 'huggingface'
                  ? 'Total parameters, counted from the weights on Hugging Face'
                  : 'Total parameters, as the model’s own name states'
              }>
              {sizeLabel(row.model.size)}
            </span>
          ) : null}
          {isNew ? (
            <span
              className="text-micro text-p1 border-p1/40 bg-p1/10 ml-2 rounded border px-1 py-px"
              title="Entered the index in the last week">
              NEW
            </span>
          ) : null}
          {!inScope ? (
            <span className="text-micro ml-2 rounded border border-white/12 px-1 py-px text-[#78758A]">
              {rankKey.level === 'overall' ? 'provisional' : 'report only'}
            </span>
          ) : null}
        </td>
        <td
          className={cn(
            'px-2.5 py-2.5 text-right font-mono font-semibold',
            row.ranked ? INDEX_TONE : 'text-[#78758A]',
          )}>
          {row.score === null && row.estimate ? (
            <span
              className="text-[#B9B7C4]"
              title={`Estimate ✱ — no Overall score. Placed by its figures on ${row.estimate.measures} measure${row.estimate.measures > 1 ? 's' : ''} among ${row.estimate.anchors} models that have one, reading their Overall index at that position.${row.estimate.bound === 'below' ? ' It trailed every such model there, so this is a ceiling.' : row.estimate.bound === 'above' ? ' It led every such model there, so this is a floor.' : ''} Never ranked.`}>
              {row.estimate.bound === 'below'
                ? '≤'
                : row.estimate.bound === 'above'
                  ? '≥'
                  : '~'}
              {fmt(row.estimate.score)}
              <span className="ml-0.5 text-[#E8A9F0]">✱</span>
            </span>
          ) : (
            fmt(row.score)
          )}
        </td>
        {rankKey.level !== 'overall' ? (
          <td className="px-2.5 py-2.5 text-right font-mono text-white">
            {fmt(keyOf(row, rankKey))}
          </td>
        ) : null}
        <td className="hidden px-2.5 py-2.5 sm:table-cell">
          <span className="flex items-center gap-0.5">
            {publishers.map((group) => (
              <PublisherBadge
                key={group[0].id}
                group={group}
                scored={scored}
              />
            ))}
            {reportsScoring.length > 0 ? (
              <span
                title={reportsScoring.map((r) => r.name).join(' · ')}
                className={cn(
                  'text-micro inline-flex h-5 min-w-6 items-center justify-center rounded border px-0.5 font-mono font-semibold',
                  REPORT_BADGE.tone,
                )}>
                ✱{reportsScoring.length > 1 ? reportsScoring.length : ''}
              </span>
            ) : null}
            <span
              className={cn(
                'text-caption ml-1.5 font-mono',
                thin ? 'text-[#F5C86B]' : 'text-[#78758A]',
              )}>
              {row.covered}/{row.coverable}
            </span>
          </span>
        </td>
        <td className="text-g2 px-2.5 py-2.5">
          <span
            aria-hidden
            className="inline-block transition-transform duration-200"
            style={{ transform: open ? 'rotate(90deg)' : 'none' }}>
            ›
          </span>
          <span className="sr-only">
            {open ? 'Hide' : 'Show'} details for {row.model.name}
          </span>
        </td>
      </tr>

      {open ? (
        <tr className="border-t border-white/8 bg-[#141416]">
          <td
            colSpan={6}
            className="p-0 whitespace-normal">
            {/* The table scrolls sideways on small screens; the card must not.
                Sticky at the left edge and capped at the viewport, it stays
                readable while the rows behind it scroll. */}
            <div className="sticky left-0 max-md:w-[calc(100vw-calc(var(--spacing-mobile-padding-x)*2))]">
              <ModelCard
                row={row}
                rank={rank}
                taxonomy={taxonomy}
                boards={boards}
                reports={reports}
                catalogDate={catalogDate}
              />
            </div>
          </td>
        </tr>
      ) : null}
    </>
  );
}

/**
 * The card a row opens into. Three things a reader wants, in order: what
 * this model is and how it scores, how to call it, and where every figure
 * came from. Nothing here is prose about the model; every line is a fact the
 * index holds, and every number links back.
 */
function ModelCard({
  row,
  rank,
  taxonomy,
  boards,
  reports,
  catalogDate,
}: {
  row: AggregateRow;
  rank: number | undefined;
  taxonomy: [string, string[]][];
  boards: BoardView[];
  reports: BoardView[];
  catalogDate: string | undefined;
}) {
  const scored = new Map(row.perBenchmark.map((s) => [s.benchmarkId, s]));
  // Only when it is worth saying. "Consistent" is the quiet default and
  // spending a line on it is how a card fills up with nothing.
  const agree = row.covered > 1 ? agreement(row.dispersion) : null;
  const access = row.model.access;
  const or = access?.openrouter;
  const [recommended, ...alternatives] = channelsOf(access);

  // Four facts, not nine. Modalities and listing dates belong to the catalog,
  // not to the first thing a reader sees about a model.
  const facts = [
    row.model.org,
    sizeLabel(row.model.size) ?? 'size undisclosed',
    access?.weights ? 'open weights' : or ? 'closed weights' : '',
    contextLabel(or?.contextLength)
      ? `${contextLabel(or?.contextLength)} context`
      : '',
  ].filter(Boolean);

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      {/* ---- who it is, and how well covered ---- */}
      <div>
        <div className="mb-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <b className="text-body font-semibold text-white">{row.model.name}</b>
          <span className="text-caption text-[#9C9AA8]">
            {facts.join(' · ')}
          </span>
          {/* The card is the summary and the page is the answer, so the way
              through should look like something you press rather than a
              footnote in the corner. New tab: the reader opened this card, and
              navigating away closes it for them. */}
          <a
            href={`/model-index/m/${row.model.id}`}
            target="_blank"
            rel="noreferrer"
            className="text-caption text-p1 border-p1/40 bg-p1/10 hover:border-p1/70 hover:bg-p1/20 ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1 font-medium transition-colors"
            onClick={(e) => e.stopPropagation()}>
            See details ↗
          </a>
        </div>
        <p className="text-caption text-[#9C9AA8]">
          {rank ? (
            <>
              Ranked <b className="font-medium text-[#D9D7E0]">#{rank}</b>{' '}
              overall
            </>
          ) : (
            <span className="text-[#F5C86B]">
              Provisional — fewer than {MIN_SOURCES} independent publishers
              {row.score === null && row.estimate ? (
                <span className="text-[#9C9AA8]">
                  , estimated{' '}
                  <b className="font-medium text-[#D9D7E0]">
                    {row.estimate.bound === 'below'
                      ? '≤'
                      : row.estimate.bound === 'above'
                        ? '≥'
                        : '~'}
                    {fmt(row.estimate.score)}✱
                  </b>
                </span>
              ) : null}
            </span>
          )}
          {' · '}
          <b className="font-medium text-[#D9D7E0]">
            {row.covered} of {row.coverable}
          </b>{' '}
          boards
          {row.reports > 0 ? (
            <>
              {' '}
              and {row.reports} report{row.reports > 1 ? 's' : ''} ✱
            </>
          ) : null}
          {agree && agree.label !== 'consistent' ? (
            <>
              {' · '}
              <span className={agree.tone}>boards {agree.label}</span>
            </>
          ) : null}
        </p>
      </div>

      {/* Scores and sources share the left column. They used to be separate
          rows, so the taller "how to call it" stack stretched the scores row
          and left a hole under it exactly the height of the difference. */}
      <div className="grid grid-cols-1 items-start gap-x-8 gap-y-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,19rem)]">
        <div className="flex min-w-0 flex-col gap-5">
          {/* ---- scores ---- */}
          <div className="min-w-0">
            <h4 className={cn(LABEL, 'mb-2.5')}>Scores by domain</h4>
            <div className="flex flex-col gap-2">
              {taxonomy.map(([category, domains]) => {
                const c = row.byCategory[category] ?? null;
                // Strongest two, then a count. The question a card answers is
                // "good at what", not "here is the taxonomy" — that is what the
                // table's own Rank by is for.
                const present = domains
                  .filter((d) => (row.byDomain[d] ?? null) !== null)
                  .sort(
                    (a, b) => (row.byDomain[b] ?? 0) - (row.byDomain[a] ?? 0),
                  );
                if (c === null && present.length === 0) return null;
                const chips =
                  present.length === 1 &&
                  domainLabel(present[0]) === domainLabel(category)
                    ? []
                    : present.slice(0, 2);
                const rest = present.length - chips.length;
                return (
                  <div
                    key={category}
                    className="text-caption flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="w-28 shrink-0 text-white">
                      {domainLabel(category)}
                      <span className="text-p1 ml-1.5 font-mono">{fmt(c)}</span>
                    </span>
                    {chips.map((d) => (
                      <span
                        key={d}
                        className="text-g2">
                        {domainLabel(d)}{' '}
                        <span className="font-mono text-[#D9D7E0]">
                          {fmt(row.byDomain[d])}
                        </span>
                      </span>
                    ))}
                    {rest > 0 ? (
                      <span className="text-[#78758A]">+{rest}</span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ---- sources ---- */}
          <div className="min-w-0">
            <div className="mb-2.5 flex items-baseline justify-between gap-4">
              <h4 className={LABEL}>Sources</h4>
            </div>
            <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
              {[...boards, ...reports].map((src) => {
                const present = src.measures.filter((m) => scored.has(m.id));
                if (present.length === 0) return null;
                const shown = present.slice(0, 2);
                const rest = present.length - shown.length;
                return (
                  <a
                    key={src.id}
                    href={src.headline.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    title={`${src.name} — open the source`}
                    className="group text-caption -mx-2 flex items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors hover:bg-white/[0.05]">
                    <SourceBadge
                      source={src}
                      present
                    />
                    <span className="min-w-0 truncate font-medium text-white">
                      {src.name}
                    </span>
                    {src.kind === 'report' ? (
                      <span className="text-[#E8A9F0]">✱</span>
                    ) : null}
                    <span className="ml-auto flex shrink-0 items-baseline gap-2 font-mono text-[#D9D7E0]">
                      {shown.map((m) => (
                        <span key={m.id}>
                          {rawLabel(m.metric, scored.get(m.id)!.raw)}
                        </span>
                      ))}
                      {rest > 0 ? (
                        <span className="text-[#78758A]">+{rest}</span>
                      ) : null}
                    </span>
                    <span
                      className="text-p1 shrink-0 opacity-40 transition-opacity group-hover:opacity-100"
                      aria-hidden>
                      ↗
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* ---- access ---- */}
        <div className="min-w-0">
          <h4 className={cn(LABEL, 'mb-2.5')}>How to call it</h4>
          {recommended ? (
            <div className="flex flex-col gap-2">
              <ChannelCard
                channel={recommended}
                recommended
                price={priceLabel(or?.inputPerM, or?.outputPerM)}
              />
              {/* The alternatives sit side by side. Stacked, three cards ran
                  taller than the scores and sources beside them and put the
                  hole back where it had just been closed. */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {alternatives.map((ch) => (
                  <ChannelCard
                    key={ch.kind}
                    channel={ch}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-caption text-[#9C9AA8]">
              No access channel on file
              {catalogDate ? ` as of ${catalogDate}` : ''}.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ChannelCard({
  channel,
  recommended = false,
  price,
}: {
  channel: Channel;
  recommended?: boolean;
  price?: string | null;
}) {
  return (
    <div
      className={cn(
        'rounded-lg border px-2.5 py-2.5',
        recommended
          ? 'border-primary/50 bg-primary/[0.08]'
          : 'border-white/10 bg-white/[0.03]',
      )}>
      <div className="text-caption flex flex-wrap items-center gap-x-2 gap-y-0.5">
        {recommended ? (
          <span className="text-micro border-primary/60 rounded border px-1 py-px font-semibold tracking-wide text-white uppercase">
            Recommended
          </span>
        ) : null}
        <a
          href={channel.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="font-medium text-white underline underline-offset-2">
          {channel.name}
        </a>
        <span className="text-[#9C9AA8]">{channel.note}</span>
      </div>
      {channel.model ? (
        <div className="text-caption mt-1.5 flex flex-wrap items-baseline gap-x-4 gap-y-0.5">
          <span>
            <span className="text-[#78758A]">model </span>
            <code
              className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-[#D9D7E0] select-all"
              onClick={(e) => e.stopPropagation()}>
              {channel.model}
            </code>
          </span>
          {channel.baseUrl ? (
            <span>
              <span className="text-[#78758A]">base </span>
              <code
                className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-[#D9D7E0] select-all"
                onClick={(e) => e.stopPropagation()}>
                {channel.baseUrl}
              </code>
            </span>
          ) : null}
          {price ? <span className="text-[#9C9AA8]">{price}</span> : null}
        </div>
      ) : null}
    </div>
  );
}
