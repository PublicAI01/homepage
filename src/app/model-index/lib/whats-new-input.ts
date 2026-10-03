import { z } from 'zod';

import { SNAPSHOT_DATE } from './diff';

/**
 * What the MCP tool `whats_new` accepts. Here and not in the route, which
 * may export only its handlers, so a test can hold the contract: a `since`
 * that is not a date is refused, never answered (see SNAPSHOT_DATE).
 */
export const whatsNewInput = z.object({
  since: z
    .string()
    .regex(SNAPSHOT_DATE, 'since must be a date, YYYY-MM-DD')
    .describe(
      'ISO date, YYYY-MM-DD, e.g. "2026-09-01". The last snapshot on or before it is the baseline.',
    ),
  minDelta: z
    .number()
    .int()
    .min(1)
    .max(50)
    .optional()
    .describe('Minimum rank move to report. Default 3.'),
});
