import { describe, expect, it } from 'vitest';

import { whatsNewInput } from './whats-new-input';

/**
 * The MCP tool took any string for `since` and compared it against the
 * snapshot dates as text: "last week" answered "no change", "01-09-2026"
 * answered with the whole history, and neither said anything was wrong
 * (2026-10-03).
 */
describe('whats_new input', () => {
  it('accepts a YYYY-MM-DD date', () => {
    expect(whatsNewInput.safeParse({ since: '2026-09-01' }).success).toBe(true);
    expect(
      whatsNewInput.safeParse({ since: '2026-09-01', minDelta: 5 }).success,
    ).toBe(true);
  });

  it.each(['last week', 'yesterday', '9/1/2026', '01-09-2026', '', '2026-9-1'])(
    'refuses %j rather than answering from a string comparison',
    (since) => {
      expect(whatsNewInput.safeParse({ since }).success).toBe(false);
    },
  );
});
