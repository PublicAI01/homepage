import { describe, expect, it } from 'vitest';

import { generateMetadata } from './page';

const metadata = (query: string) =>
  generateMetadata({
    searchParams: Promise.resolve(
      Object.fromEntries(new URLSearchParams(query)),
    ),
  });

describe('model-index metadata', () => {
  it('never puts words the index does not know in the title or description', async () => {
    // `rank=domain:<anything>&family=<anything>` unfurled on X and Slack as
    // "<anything> · <anything> — PublicAI Index" under publicai.io's name;
    // the card image had been gated two days earlier, the title had not
    // (2026-09-22).
    const m = await metadata(
      'rank=domain:Claim%20your%20prize%20at%20evil.example&family=FREE%20MONEY',
    );
    const text = JSON.stringify(m);
    expect(text).not.toContain('Claim your prize');
    expect(text).not.toContain('FREE MONEY');
    expect(m.title).toBe('Overall — PublicAI Index');
  });

  it('still names a real scope, under its canonical spelling', async () => {
    const m = await metadata('rank=domain:agentic%20coding');
    expect(m.title).toBe('Agentic coding — PublicAI Index');
  });
});
