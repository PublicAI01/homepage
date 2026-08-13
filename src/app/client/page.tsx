import type { Metadata } from 'next';

import { BUSINESS_LINK } from '@/constant';
import { cn } from '@/utils';

export const metadata: Metadata = {
  title: 'PublicAI Trajector — Real Coding-Agent Trajectories',
  description:
    'Trajector licenses complete, consented Claude Code sessions from real development work — prompts, tool calls, diffs, failures, fixes, and commits — collected from open-source developers who get paid for it.',
  keywords:
    'agent trajectory data, coding agents, AI training data, Claude Code sessions, trajectory dataset, model training, model evaluation, PublicAI, Trajector',
};

const PILL =
  'inline-block rounded-full bg-[#8B7CF6] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90';
const PANEL = 'rounded-xl border border-[#2C2C31] bg-white/[0.045] backdrop-blur-sm';

const specimen = [
  { t: '00:00', k: 'user', body: <>fix the flaky retry logic in the sync worker</> },
  { t: '00:04', k: 'tool_use', body: <>read src/sync/worker.ts</> },
  {
    t: '00:19',
    k: 'tool_use',
    body: (
      <>
        edit worker.ts <span className="text-[#F5C86B]">+14 −6</span>
      </>
    ),
  },
  { t: '00:31', k: 'tool_use', body: <>bash npm test</> },
  {
    t: '00:47',
    k: 'tool_result',
    body: (
      <>
        <span className="text-[#F08A8A]">2 failed</span> — backoff never resets
      </>
    ),
  },
  {
    t: '01:02',
    k: 'tool_use',
    body: (
      <>
        edit worker.ts <span className="text-[#F5C86B]">+3 −1</span>
      </>
    ),
  },
  { t: '01:15', k: 'tool_use', body: <>bash npm test</> },
  {
    t: '01:28',
    k: 'tool_result',
    body: <span className="text-[#6EE7A0]">all 41 passed</span>,
  },
  {
    t: '01:44',
    k: 'commit',
    body: (
      <>
        <span className="text-[#6EE7A0]">a41f2c9</span> fix: reset backoff on
        successful sync
      </>
    ),
  },
];

const inside = [
  {
    tag: 'user / prompts',
    text: 'The developer’s actual intent, in their own words, at every turn.',
  },
  {
    tag: 'tool_use / tool_result',
    text: 'File reads, edits, and shell commands with their real outputs — including failures.',
  },
  {
    tag: 'diffs & tests',
    text: 'Every change and the test results that accepted or rejected it.',
  },
  {
    tag: 'commits & outcomes',
    text: 'Sessions linked to their commits, so trajectories carry ground-truth resolution.',
  },
];

const them = [
  'Tasks designed by the vendor, not the real world',
  'Performed for the payout, under observation',
  'Clean, linear solutions — few genuine dead ends',
  'Distribution limited by task authors’ imagination',
];

const us = [
  'Real problems from live codebases',
  'Natural behavior — the incentive follows the work',
  'Authentic failure, retry, and correction patterns',
  'Distribution as wide as open source itself',
];

const pipeline = [
  {
    tag: 'CAPTURE',
    title: 'Device-bound',
    text: 'Uploads signed with per-device keys from attested, reproducible CLI builds.',
  },
  {
    tag: 'SCRUB',
    title: 'Secrets removed locally',
    text: 'Keys, tokens, and env vars stripped on the contributor’s machine, verified server-side.',
  },
  {
    tag: 'VALIDATE',
    title: 'Structure & timing',
    text: 'Schema, event ordering, and temporal consistency checks against real API latency.',
  },
  {
    tag: 'DEDUPE',
    title: 'Unique sessions only',
    text: 'Exact and near-duplicate detection across the full corpus.',
  },
  {
    tag: 'REVIEW',
    title: 'Coherence-scored',
    text: 'Sampled sessions judged for genuine task resolution before corpus inclusion.',
  },
];

const rights = [
  {
    title: 'Explicit contributor consent',
    text: 'Collection is opt-in per project. Nothing is captured from projects a contributor hasn’t enabled.',
  },
  {
    title: 'Rights attestation',
    text: 'Contributors attest that shared sessions cover code they own or that is open source, recorded at onboarding.',
  },
  {
    title: 'Commercial training license',
    text: 'Datasets are delivered with clear usage authorization for model training and evaluation.',
  },
  {
    title: 'Deletion honored end-to-end',
    text: 'Contributors can pause, exclude repos, or delete local captured data at any time.',
  },
];

export default function Client() {
  return (
    <div className="mx-auto w-full max-w-[1120px] px-6">
      <style>{`
        @keyframes trajEvIn{to{opacity:1;transform:none}}
        .traj-ev{opacity:0;transform:translateY(4px);animation:trajEvIn .5s forwards}
        .traj-ev:nth-child(1){animation-delay:.2s}
        .traj-ev:nth-child(2){animation-delay:.7s}
        .traj-ev:nth-child(3){animation-delay:1.2s}
        .traj-ev:nth-child(4){animation-delay:1.7s}
        .traj-ev:nth-child(5){animation-delay:2.2s}
        .traj-ev:nth-child(6){animation-delay:2.7s}
        .traj-ev:nth-child(7){animation-delay:3.2s}
        .traj-ev:nth-child(8){animation-delay:3.7s}
        .traj-ev:nth-child(9){animation-delay:4.2s}
        @media (prefers-reduced-motion:reduce){.traj-ev{animation:none;opacity:1;transform:none}}
      `}</style>

      {/* ===================== HERO ===================== */}
      <header className="grid grid-cols-1 items-center gap-12 pt-10 pb-16 lg:grid-cols-[1.05fr_0.95fr] lg:pt-16 lg:pb-20">
        <div>
          <p className="text-p1 mb-4 font-mono text-xs tracking-[0.14em] uppercase">
            Agent trajectory data · for AI labs
          </p>
          <h1 className="mb-5 text-4xl leading-[1.06] font-bold tracking-tight text-white md:text-5xl lg:text-[52px]">
            Real coding trajectories.
            <br />
            <span className="text-[#A78BFA]">Not staged tasks.</span>
          </h1>
          <p className="mb-7 max-w-[44ch] text-base text-[#D9D7E0] md:text-[17px]">
            Trajector licenses complete, consented Claude Code sessions from
            real development work — prompts, tool calls, diffs, failures, fixes,
            and commits — collected from open-source developers who get paid for
            it.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              className={PILL}
              href={BUSINESS_LINK}
              target="_blank"
              rel="external noreferrer">
              Book a pilot
            </a>
          </div>
        </div>

        <div
          className="overflow-hidden rounded-2xl border border-[#2C2C31] bg-[#161618] shadow-[0_24px_60px_rgba(8,4,20,0.5)]"
          aria-label="Example trajectory event stream">
          <div className="flex items-center gap-2 bg-[#1E1E22] px-4 py-2.5 font-mono text-[11px] text-[#78758A]">
            <span className="size-2.5 rounded-full bg-[#E5695E]" />
            <span className="size-2.5 rounded-full bg-[#F5C86B]" />
            <span className="size-2.5 rounded-full bg-[#6EE7A0]" />
            <span className="ml-2">session_7f3a.jsonl · claude-sonnet-4-6</span>
          </div>
          <div className="min-h-[300px] p-[18px] font-mono text-[12.5px] leading-[1.9]">
            {specimen.map((ev, i) => (
              <div
                key={i}
                className="traj-ev">
                <span className="text-[#78758A]">{ev.t}</span>{' '}
                <span className="text-[#A78BFA]">{ev.k}</span> {ev.body}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ===================== INSIDE ===================== */}
      <section className="pb-20 lg:pb-24">
        <h2 className="mb-2.5 text-3xl font-bold tracking-tight text-white">
          What’s inside every trajectory
        </h2>
        <p className="mb-8 max-w-[60ch] text-[#9A97A8]">
          Not snippets. The complete record of how a real problem got solved, as
          structured JSONL with full event ordering and model metadata.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {inside.map(({ tag, text }) => (
            <div
              key={tag}
              className={cn(PANEL, 'p-4')}>
              <span className="mb-2 block font-mono text-[11px] text-[#A78BFA]">
                {tag}
              </span>
              <p className="text-[13px] text-[#D9D7E0]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== WHY NATURAL ===================== */}
      <section className="pb-20 lg:pb-24">
        <h2 className="mb-2.5 text-3xl font-bold tracking-tight text-white">
          Why natural beats manufactured
        </h2>
        <p className="mb-8 max-w-[60ch] text-[#9A97A8]">
          Most coding data on the market is produced for the transaction: preset
          tasks, performed for bounties, in artificial environments. Trajector
          captures work that would have happened anyway.
        </p>
        <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#2C2C31] bg-white/[0.03] p-6">
            <h3 className="mb-4 font-mono text-[15px] font-medium tracking-[0.06em] text-[#9A97A8] uppercase">
              Staged task data
            </h3>
            <ul className="list-none">
              {them.map((li) => (
                <li
                  key={li}
                  className="border-t border-white/[0.06] py-[7px] text-sm text-[#9A97A8]">
                  {li}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-[#8B7CF6] bg-[#8B7CF6]/10 p-6">
            <h3 className="mb-4 font-mono text-[15px] font-medium tracking-[0.06em] text-[#A78BFA] uppercase">
              Trajector trajectories
            </h3>
            <ul className="list-none">
              {us.map((li) => (
                <li
                  key={li}
                  className="border-t border-white/[0.06] py-[7px] text-sm text-[#D9D7E0] before:mr-1 before:text-[#A78BFA] before:content-['→']">
                  {li}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ===================== VERIFICATION ===================== */}
      <section className="pb-20 lg:pb-24">
        <h2 className="mb-2.5 text-3xl font-bold tracking-tight text-white">
          Verified before it ever reaches you
        </h2>
        <p className="mb-8 max-w-[60ch] text-[#9A97A8]">
          Every session passes a multi-stage acceptance pipeline. What fails,
          you never see — and never pay for.
        </p>
        <div className="flex items-stretch overflow-x-auto">
          {pipeline.map(({ tag, title, text }) => (
            <div
              key={tag}
              className={cn(
                PANEL,
                'relative mr-7 min-w-[150px] flex-1 p-4 last:mr-0',
                "after:absolute after:top-1/2 after:right-[-22px] after:-translate-y-1/2 after:text-xl after:text-[#78758A] after:content-['›'] last:after:content-none",
              )}>
              <span className="mb-1.5 block font-mono text-[10.5px] tracking-[0.08em] text-[#78758A]">
                {tag}
              </span>
              <b className="mb-1 block text-[13.5px] font-medium text-white">
                {title}
              </b>
              <p className="text-xs text-[#9A97A8]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== RIGHTS ===================== */}
      <section className="pb-20 lg:pb-24">
        <h2 className="mb-2.5 text-3xl font-bold tracking-tight text-white">
          Rights you can build on
        </h2>
        <p className="mb-8 max-w-[60ch] text-[#9A97A8]">
          Trajectory data is only as usable as its provenance. Every session
          arrives with the consent chain intact.
        </p>
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
          {rights.map(({ title, text }) => (
            <div
              key={title}
              className={cn(PANEL, 'flex items-start gap-3.5 p-5')}>
              <span className="text-lg leading-tight text-[#6EE7A0]">✓</span>
              <div>
                <b className="mb-1 block text-[14.5px] font-semibold text-white">
                  {title}
                </b>
                <p className="text-[13px] text-[#9A97A8]">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <div className="mb-20 rounded-[20px] border border-[#8B7CF6] bg-linear-135 from-[#8B7CF6]/20 to-[#8B7CF6]/[0.06] p-11 text-center">
        <h2 className="mb-2 text-3xl font-bold tracking-tight text-white">
          Power your models with real trajectories
        </h2>
        <p className="mb-6 text-[#D9D7E0]">Start with a scoped pilot batch.</p>
        <a
          className={PILL}
          href={BUSINESS_LINK}
          target="_blank"
          rel="external noreferrer">
          Book a pilot
        </a>
      </div>
    </div>
  );
}
