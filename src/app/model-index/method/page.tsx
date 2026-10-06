import type { Metadata } from 'next';
import Link from 'next/link';

import { cardUrl } from '@/app/og/title';
import { cn } from '@/utils';

import {
  MAX_Z,
  MIN_MODELS_TO_STANDARDIZE,
  MIN_OVERALL_WEIGHT,
  T_SCORE_MEAN,
  T_SCORE_SD,
} from '../lib/aggregate';
import { describeIndex } from '../lib/query';
import {
  BOARD_MEASURE_WEIGHT,
  INDEPENDENT_REPORT_WEIGHT,
  MIN_SOURCES,
  PRIOR_FRACTION,
  VENDOR_REPORT_WEIGHT,
} from '../lib/weights';

/**
 * How the index is built, on a page instead of in a code comment.
 *
 * Everything here was already true and already written down: in
 * `describeIndex().method` for agents, in the hover text on the weighting
 * table, in comments next to the constants. A reader who asked "why should
 * I trust this number" had no single place to be sent (2026-09-28).
 *
 * The figures come from the same constants the aggregation uses, so the
 * page cannot drift from the code. Change a weight and this page changes.
 */
export const metadata: Metadata = {
  title: 'Method — PublicAI Index',
  description:
    'How the PublicAI Index merges public leaderboards: identity resolution, per-measure standardization, a published weighting, shrinkage toward the mean, and the bars a model clears before it is ranked. Including where the method is weak.',
  keywords:
    'LLM benchmark aggregation method, leaderboard normalization, z-score standardization, model index methodology, PublicAI Index',
  openGraph: {
    title: 'How the PublicAI Index is built',
    description:
      'Identity resolution, per-measure standardization, a published weighting, shrinkage, and the bars a model clears before it is ranked.',
    url: 'https://publicai.io/model-index/method',
    images: [
      {
        url: cardUrl('How the PublicAI Index is built'),
        width: 1200,
        height: 630,
        alt: 'How the PublicAI Index is built',
      },
    ],
  },
};

const PANEL = 'rounded-xl border border-[#2C2C31] bg-white/[0.045]';
const MEASURE = 'max-w-[68ch]';
const LABEL = 'text-micro tracking-[0.14em] text-[#78758A] uppercase';
const pct = (x: number) => `${Math.round(x * 100)}%`;

function Section({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-white/8 pt-8">
      <p className={LABEL}>{n}</p>
      <h2 className="mt-2 text-xl font-semibold text-white">{title}</h2>
      <div
        className={cn(
          MEASURE,
          'text-body mt-3 flex flex-col gap-3 text-[#B9B7C4]',
        )}>
        {children}
      </div>
    </section>
  );
}

export default function Page() {
  const index = describeIndex();
  const { counts, overallWeighting } = index;

  return (
    // Same ground as the index itself: a solid sheet over the site's
    // animated grid, so a page made of arguments reads like a paper.
    <div className="relative isolate before:absolute before:inset-y-0 before:left-1/2 before:-z-10 before:w-screen before:-translate-x-1/2 before:bg-[#08080A]">
      <div className="container mx-auto flex flex-col gap-8 py-12 max-md:w-[calc(100vw-calc(var(--spacing-mobile-padding-x)*2))] md:py-16">
        <header className="flex flex-col gap-4">
          <p className={LABEL}>PublicAI Index</p>
          <h1 className="text-3xl font-semibold text-white md:text-4xl">
            How the index is built
          </h1>
          <p className={cn(MEASURE, 'text-body text-[#B9B7C4]')}>
            Two halves. First, deciding which rows across {counts.boards}{' '}
            leaderboards are the same model. Then, putting their numbers on one
            scale. The first is an engineering problem and the second a
            statistical one, and getting the first wrong voids the second.
          </p>
          <p className={cn(MEASURE, 'text-caption text-[#78758A]')}>
            Every figure below is read from the constants the aggregation itself
            uses, so this page cannot drift from the code. Today:{' '}
            {counts.models} models, {counts.ranked} ranked, {counts.boards}{' '}
            boards and {counts.reports} reports ✱ across {counts.measures}{' '}
            measures.
          </p>
        </header>

        <Section
          n="01"
          title="Identity: which rows are one model">
          <p>
            Boards spell things differently. One model arrives as{' '}
            <code className="text-[#D9D7E0]">claude-opus-5-max</code>, as{' '}
            <code className="text-[#D9D7E0]">Claude Opus 5 (High)</code>, as{' '}
            <code className="text-[#D9D7E0]">anthropic/claude-opus-5</code>.
            Snapshot dates, hosting platforms and run settings are stripped;
            reasoning effort, thinking and preview labels fold into one model
            with the highest tier kept.
          </p>
          <p>
            The exceptions are vendors who really did ship two sets of weights,
            such as Qwen3 2507 Instruct and Thinking, or Kimi K2 and K2
            Thinking. Each needs evidence on the record before it is split.
            Merging two different models, or attributing one model’s score to
            another, is the worst thing this index can do, and it is treated
            that way.
          </p>
        </Section>

        <Section
          n="02"
          title="Standardize each measure against its own population">
          <p>
            An Elo of 1501 and a 57.9% pass rate cannot be averaged. Every
            measure is z-scored across the models its own source lists, then
            mapped to {T_SCORE_MEAN} ± {T_SCORE_SD} per standard deviation.{' '}
            <strong className="text-white">
              {T_SCORE_MEAN} is that measure’s average, not a grade.
            </strong>{' '}
            Fewer than {MIN_MODELS_TO_STANDARDIZE} models on a measure and it is
            not standardized at all, because there is no population to stand
            against. A figure a publisher prints as a risk or an error rate has
            its sign flipped; the raw stays exactly as printed.
          </p>
          <p>
            Standardized distance is capped at ±{MAX_Z} standard deviations.
            Past that a board has stopped discriminating and started
            extrapolating, and one such figure could outweigh four boards. The
            cap changes no board’s own order.
          </p>
        </Section>

        <Section
          n="03"
          title="Discount by the publisher’s own error bar">
          <p>
            Where a source publishes uncertainty, the figure counts for less,
            scaled by how wide the bar is relative to that board’s spread: ±3.8
            is tight on a board spanning 40 points and useless on one spanning
            4.
          </p>
          <p>
            A figure with no published error bar counts in full. Absence of an
            error bar is not evidence of a wide one, and guessing would invent
            information.
          </p>
        </Section>

        <Section
          n="04"
          title="One publication, one voice">
          <p>
            A board earns per-measure weight by running a fixed set on everyone.
            A report ✱ does not: how many rows a launch post prints is a choice,
            not evidence. The measures one publication contributes to one scope
            are averaged and enter once.
          </p>
          <p>
            An independent write-up carries {INDEPENDENT_REPORT_WEIGHT} against
            a board measure’s {BOARD_MEASURE_WEIGHT}; a figure the model’s own
            publisher printed carries {VENDOR_REPORT_WEIGHT}. Reports never
            enter the Overall index, and in a category they decide nothing a
            board already measured.
          </p>
        </Section>

        <Section
          n="05"
          title="Weight by a published scheme">
          <p>
            Fixed, printed, and not adjustable by the reader. A reader cannot be
            expected to know what share a leaderboard deserves; that is an
            editorial call, and the only honest way to make one is to state it
            with the reason attached.
          </p>
          <div className={cn(PANEL, 'mt-2 overflow-hidden')}>
            <table className="text-body-sm w-full border-collapse text-left">
              <thead>
                <tr className="text-micro bg-white/4 tracking-[0.1em] text-[#78758A] uppercase">
                  <th className="px-3 py-2.5 font-medium">Source</th>
                  <th className="px-3 py-2.5 text-right font-medium">Share</th>
                  <th className="px-3 py-2.5 font-medium">Why that share</th>
                </tr>
              </thead>
              <tbody>
                {[...overallWeighting]
                  .sort((a, b) => b.weight - a.weight)
                  .map((w) => (
                    <tr
                      key={w.source}
                      className="border-t border-white/8 align-top">
                      <td className="px-3 py-2.5 font-medium whitespace-nowrap text-white">
                        <a
                          href={w.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline-offset-2 hover:underline">
                          {w.source}
                        </a>
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono text-white">
                        {w.weight}%
                      </td>
                      <td className="px-3 py-2.5 text-[#B9B7C4]">
                        {w.rationale}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <p className="text-caption text-[#78758A]">
            A board’s category figures shape their own columns at the same
            share, and never the Overall index, which would count that board
            twice.
          </p>
        </Section>

        <Section
          n="06"
          title="Shrink, never impute">
          <p>
            A missing figure stays missing. Thin evidence is pulled toward{' '}
            {T_SCORE_MEAN} by a prior worth {pct(PRIOR_FRACTION)} of the weight
            available in that scope. With full coverage the pull is mild; with
            one small board it dominates, which is the intended answer to a
            model that topped a single leaderboard.
          </p>
        </Section>

        <Section
          n="07"
          title="Two bars before a model is ranked">
          <p>
            Boards from {MIN_SOURCES} independent publishers must have scored
            it, and{' '}
            <strong className="text-white">
              {pct(MIN_OVERALL_WEIGHT)} of the Overall weighting must actually
              have been measured.
            </strong>
          </p>
          <p>
            The five boards reach very different distances, so most models are
            measured on part of the scheme and the prior fills the rest. Below
            half, the prior is deciding the placing, and a placing decided by
            the prior is an artefact of thin coverage rather than a finding
            about the model. The cost is visible on the page: {counts.ranked}{' '}
            ranked out of {counts.models}.
          </p>
        </Section>

        <Section
          n="08"
          title="Estimates interpolate, and never rank">
          <p>
            A model with no Overall index is placed among models that have one,
            on a measure they share, and their index is read at that position.
            Outside the anchors’ range the nearest anchor is a bound, a ceiling
            or a floor, not a point. Safety and Decisions figures never anchor
            an estimate: a low risk rate is not evidence of capability, and
            hallucination rate and the Overall index correlate at −0.23.
          </p>
        </Section>

        <Section
          n="09"
          title="What we deliberately do not do">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-white">Run our own evaluations.</strong>{' '}
              There is nothing here to tune and no conflict of interest.
            </li>
            <li>
              <strong className="text-white">Impute missing values.</strong>
            </li>
            <li>
              <strong className="text-white">Let readers reweight.</strong>{' '}
              Adjustable weights mean everyone can produce the conclusion they
              came for.
            </li>
            <li>
              <strong className="text-white">Use second-hand numbers.</strong>{' '}
              Every figure is read from the publisher’s own page and links back
              to it.
            </li>
          </ul>
        </Section>

        <Section
          n="10"
          title="Where the method is weak">
          <p>
            Stated here because a method page that only argues for itself is an
            advertisement.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-white">
                Standardizing assumes each board’s population is comparable.
              </strong>{' '}
              “Average” on a board of twenty frontier models is not “average” on
              a board of three hundred. Shrinkage softens this; it does not
              solve it.
            </li>
            <li>
              <strong className="text-white">
                The weights are an editorial judgment.
              </strong>{' '}
              The shares above have no objective derivation. All we can do is
              print them with reasons and invite disagreement.
            </li>
            <li>
              <strong className="text-white">The boards correlate.</strong>{' '}
              Artificial Analysis is itself a composite that overlaps others
              here, so there is partial double counting. The rationale says so;
              the arithmetic does not correct for it.
            </li>
            <li>
              <strong className="text-white">
                Contamination is not something we can see.
              </strong>{' '}
              A board that publishes a sealed control set can show how much of a
              score survives unseen questions. Most do not, and we inherit
              whatever the published figure already includes.
            </li>
          </ul>
        </Section>

        <footer className="border-t border-white/8 pt-8">
          <p className={cn(MEASURE, 'text-body text-[#B9B7C4]')}>
            The same description is served to agents as{' '}
            <a
              href={`${index.api}?limit=1`}
              className="text-p1 underline-offset-2 hover:underline">
              JSON
            </a>{' '}
            and over{' '}
            <a
              href="https://docs.publicai.io/publicai-documentation/publicai-index/mcp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-p1 underline-offset-2 hover:underline">
              MCP
            </a>
            . The weighting is stated so it can be disagreed with. Tell us where
            we are wrong.
          </p>
          <p className="mt-4">
            <Link
              href="/model-index"
              className="text-p1 underline-offset-2 hover:underline">
              ← Back to the Index
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
