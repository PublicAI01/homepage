import type { Metadata } from 'next';

import Button from '@/components/Button';
import {
  SUPPORT_EMAIL_ADDRESS,
  TRAJECTOR_DOCS_LINK,
  TRAJECTOR_LOGIN_LINK,
  TRAJECTOR_SIGNUP_LINK,
} from '@/constant';
import { cn } from '@/utils';

import { stepArt } from './components/illustrations';

export const metadata: Metadata = {
  title: 'Trajector — Get paid for the coding sessions you already run',
  description:
    'Trajector pays you for the AI coding trajectories you already produce — captured locally on your own machine, redacted by default, uploaded only with your consent.',
  keywords:
    'Trajector, coding agent, coding agent data, get paid for coding sessions, AI training data, trajectory data, PublicAI',
};

const PANEL =
  'rounded-xl border border-[#2C2C31] bg-white/[0.045] backdrop-blur-sm';

const SECTION = 'border-t border-white/8 py-16 lg:py-20';

const LABEL = 'text-micro tracking-[0.14em] text-[#78758A] uppercase';

/** Comfortable line length for running copy. */
const MEASURE = 'max-w-[68ch]';

const steps = [
  {
    title: 'Install the CLI',
    text: 'One binary. It sits between your coding agent and the model API, capturing the sessions you already run — locally, on your machine.',
  },
  {
    title: 'Review and upload',
    text: 'Secrets and personal data are redacted before anything leaves your laptop. Nothing is uploaded without your consent.',
  },
  {
    title: 'Get paid',
    text: 'Accepted sessions accrue a reward you can withdraw as a stablecoin once you pass the $10 minimum.',
  },
];

/** The guarantees are the product, so they are stated as flatly as the docs state them. */
const guarantees = [
  {
    title: 'Opt in per project',
    text: 'Nothing is captured until you enable a project. A project you have not enabled is not merely excluded by policy — the code path to record it does not exist.',
  },
  {
    title: 'Forwarding is sacred',
    text: 'A failure on the recording side — disk full, malformed stream, internal error — never interrupts your work. Streaming responses pass through unbuffered.',
  },
  {
    title: 'Credentials never touch disk',
    text: 'Authorization and x-api-key headers are not written to any file, in any state, at any point.',
  },
  {
    title: 'Revocable, immediately',
    text: 'disable, logout and uninstall each undo a different amount. Uninstalling with --delete-data also clears the local spool and anything still waiting on your machine.',
  },
];

const faq = [
  {
    q: 'What is Trajector?',
    a: (
      <>
        Trajector turns your real coding sessions into rewards. Install the CLI,
        enable it on the projects you choose, and keep working with your coding
        agent as usual — your session trajectories are collected, verified, and
        rewarded.
      </>
    ),
  },
  {
    q: 'What sessions are collected right now?',
    a: (
      <>
        During the beta, only{' '}
        <code className="text-code font-mono text-white">claude-fable-5</code>,{' '}
        <code className="text-code font-mono text-white">claude-fable-5-1</code>{' '}
        and{' '}
        <code className="text-code font-mono text-white">claude-opus-5</code>{' '}
        sessions are collected — point your agent at one of those models to be
        rewarded. Sessions from other models are rejected and earn nothing; they
        show up as rejected in your session list. How to switch, and the full
        beta rules (they may change), are in{' '}
        <a
          href={`${TRAJECTOR_DOCS_LINK}/rewards`}
          target="_blank"
          rel="external noreferrer"
          className="text-p1 underline underline-offset-2">
          the docs
        </a>
        .
      </>
    ),
  },
  {
    q: 'Is my code and data secure?',
    a: (
      <>
        Collection is opt-in per project — nothing is captured from projects you
        have not enabled. Secrets and keys are scrubbed locally before anything
        uploads, and captured data waiting on your machine stays under your
        control: uninstalling with{' '}
        <code className="text-code font-mono text-white">--delete-data</code>{' '}
        also deletes the local spool and any captured data still on your
        machine. To learn more, see{' '}
        <a
          href={`${TRAJECTOR_DOCS_LINK}/data-and-privacy`}
          target="_blank"
          rel="external noreferrer"
          className="text-p1 underline underline-offset-2">
          Data and privacy
        </a>
        .
      </>
    ),
  },
  {
    q: 'What do I earn and how do I claim?',
    a: (
      <>
        You earn per accepted session. Rewards vest, then are claimable on the{' '}
        <a
          href="https://trajector.publicai.io/claim?utm_source=homepage"
          target="_blank"
          rel="external noreferrer"
          className="text-p1 underline underline-offset-2">
          Trajector rewards page
        </a>{' '}
        — sign in, click claim, and connect any wallet at withdrawal. No wallet
        lock-in.
      </>
    ),
  },
  {
    q: 'What counts as an accepted session?',
    a: (
      <>
        Real work: sessions need substance (multiple messages and tool calls)
        and must pass duplicate, consistency, and secret-scrub checks. Trivial
        or synthetic sessions are not rewarded.
      </>
    ),
  },
  {
    q: 'Who can join?',
    a: (
      <>
        Any developer working with a supported coding agent, contributing
        sessions from code they own or that is open source. If you build, you
        can earn.
      </>
    ),
  },
];

export default function Trajector() {
  return (
    <div className="container mx-auto max-md:w-[calc(100vw-calc(var(--spacing-mobile-padding-x)*2))]">
      {/* ===================== HERO ===================== */}
      <header className="grid grid-cols-1 items-start gap-12 pt-10 pb-16 lg:grid-cols-[1.05fr_1fr] lg:pt-16 lg:pb-20">
        <div>
          <p className="mb-4 flex items-center gap-2">
            <span className="bg-primary/15 text-p1 text-micro rounded-full px-2.5 py-1 font-semibold tracking-[0.08em] uppercase">
              Now paying contributors
            </span>
          </p>
          <h1 className="text-display mb-5 font-bold text-white">
            Turn your coding sessions into rewards.
          </h1>
          <p className="text-lede mb-7 max-w-[48ch] text-[#D9D7E0]">
            Trajector pays you for the AI coding trajectories you already
            produce — captured locally, redacted by default, uploaded only with
            your consent.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              className="w-auto px-5 text-base"
              theme="primary"
              href={TRAJECTOR_SIGNUP_LINK}
              aria-label="sign up for Trajector">
              Sign up
            </Button>
            <Button
              className="w-auto px-5 text-base shadow-none"
              href={TRAJECTOR_LOGIN_LINK}
              aria-label="log in to Trajector">
              Log in
            </Button>
          </div>
          <p className="text-body-sm mt-7 text-[#78758A]">
            <b className="font-medium text-white">Coverage today:</b> one coding
            agent, with more as support lands. macOS and Linux; Windows in beta.
            Read the{' '}
            <a
              href={TRAJECTOR_DOCS_LINK}
              target="_blank"
              rel="external noreferrer"
              className="text-p1 underline underline-offset-2">
              documentation
            </a>
            .
          </p>
        </div>

        {/* The proxy is the whole architecture, so the page shows it rather
            than describing it. Same figure as the CLI docs. */}
        <div
          className={cn(
            'text-code overflow-x-auto rounded-2xl border border-[#2C2C31] bg-[#161618] p-5 font-mono shadow-[0_24px_60px_rgba(8,4,24,0.45)] lg:p-6',
          )}>
          <p className={cn(LABEL, 'mb-4')}>The shape of a session</p>
          <pre className="text-[#D9D7E0]">
            {`coding agent  ──►  127.0.0.1:41100  ──►  model API
                          │            (or your own relay)
                          │
                          └──►  spool  ──►  redact  ──►  upload`}
          </pre>
          <p className="text-micro mt-5 border-t border-white/8 pt-4 text-[#78758A]">
            The proxy forwards every request verbatim and records it on the
            side. Secrets are masked on your machine; only redacted batches are
            uploaded. It starts on demand, exits when idle, and is never a
            permanent daemon.
          </p>
        </div>
      </header>

      {/* ===================== HOW IT WORKS ===================== */}
      {/* A rail rather than three cards: the product is a pipe, and the page
          says so in the same shape as the diagram above it. */}
      <section className={SECTION}>
        <p className={cn(LABEL, 'mb-3')}>§ 1 · How it works</p>
        <h2 className="text-heading mb-12 font-bold text-white">
          Three steps, then it is out of your way.
        </h2>
        <ol className="relative grid grid-cols-1 gap-y-10 md:grid-cols-3 md:gap-x-8">
          <span
            className="via-primary/40 absolute top-4 left-4 hidden h-px w-[calc(100%-2rem)] bg-gradient-to-r from-[#2C2C31] to-[#2C2C31] md:block"
            aria-hidden
          />
          <span
            className="via-primary/40 absolute top-8 bottom-6 left-4 w-px bg-gradient-to-b from-[#2C2C31] to-[#2C2C31] md:hidden"
            aria-hidden
          />
          {steps.map((step, i) => {
            const Art = stepArt[i];
            return (
              <li key={step.title}>
                <div className="flex gap-4 md:block">
                  <span className="bg-b1 text-p1 text-body-sm border-primary/40 flex size-8 shrink-0 items-center justify-center rounded-full border font-mono font-semibold md:mb-6">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <Art className="mb-5 h-20 w-auto text-[#8A889A]" />
                    <b className="text-subheading mb-2 block font-semibold text-white">
                      {step.title}
                    </b>
                    <p className="text-body max-w-[38ch] text-[#B9B7C4]">
                      {step.text}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* ===================== GUARANTEES ===================== */}
      <section className={SECTION}>
        <p className={cn(LABEL, 'mb-3')}>§ 2 · What we guarantee</p>
        <h2 className="text-heading mb-3 font-bold text-white">
          Consent is structural, not a setting.
        </h2>
        <p className={cn('text-body mb-10 text-[#B9B7C4]', MEASURE)}>
          Trajector is open source, so none of this has to be taken on trust.
          Each of these is a property of how the tool is built, not a promise
          about how it is operated.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {guarantees.map(({ title, text }, i) => (
            <div key={title}>
              <div
                className={cn(
                  PANEL,
                  'hover:border-primary/40 h-full p-6 transition-colors duration-300',
                )}>
                <b className="text-subheading mb-2 flex items-center gap-2.5 font-semibold text-white">
                  <span
                    className="bg-primary size-1.5 shrink-0 rounded-full"
                    aria-hidden
                  />
                  {title}
                </b>
                <p className="text-body text-[#B9B7C4]">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== FAQ ===================== */}
      <section className={SECTION}>
        {/* Answers want a comfortable measure, which on a wide screen leaves
            half the row empty. The heading takes that half and stays put
            while the list is read. */}
        <div className="grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className={cn(LABEL, 'mb-3')}>§ 3 · FAQ</p>
            <h2 className="text-heading mb-3 font-bold text-white">
              Trajector FAQ
            </h2>
            <p className="text-body max-w-[38ch] text-[#B9B7C4]">
              What is collected, what is not, and what you are paid for.
            </p>
            <p className="text-body-sm mt-5 text-[#78758A]">
              Anything else:{' '}
              <a
                href={`mailto:${SUPPORT_EMAIL_ADDRESS}`}
                className="text-p1 underline underline-offset-2">
                {SUPPORT_EMAIL_ADDRESS}
              </a>
            </p>
          </div>

          <div className="flex min-w-0 flex-col">
            {faq.map(({ q, a }, i) => (
              <details
                key={q}
                open={i === 0}
                className="group border-t border-white/8 last:border-b">
                <summary className="text-body flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-semibold text-white marker:content-none [&::-webkit-details-marker]:hidden">
                  {q}
                  <span
                    className="text-p1 shrink-0 text-xl leading-none transition-transform duration-200 group-open:rotate-45"
                    aria-hidden>
                    +
                  </span>
                </summary>
                <p className="text-body pb-5 text-[#B9B7C4]">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CLOSING ===================== */}
      <section className={cn(SECTION, 'border-b-0')}>
        <div
          className={cn(
            PANEL,
            'relative overflow-hidden px-6 py-14 text-center lg:px-10 lg:py-20',
          )}>
          {/* A single wash of brand colour, behind the last thing on the
                page, so the call to action is the one warm spot on it. */}
          <span
            className="from-primary/25 pointer-events-none absolute -top-32 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-radial to-transparent blur-3xl"
            aria-hidden
          />
          <div className="relative">
            <h2 className="text-heading mb-4 font-bold text-white">
              If you build, you can earn.
            </h2>
            <p className="text-body mx-auto mb-8 max-w-[52ch] text-[#B9B7C4]">
              Keep using your coding agent exactly as you do now. Enable the
              projects you are happy to contribute, and leave the rest
              untouched.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                className="w-auto px-5 text-base"
                theme="primary"
                href={TRAJECTOR_SIGNUP_LINK}
                aria-label="sign up for Trajector">
                Sign up
              </Button>
              <Button
                className="w-auto px-5 text-base shadow-none"
                href={TRAJECTOR_DOCS_LINK}
                aria-label="read the Trajector documentation">
                Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
