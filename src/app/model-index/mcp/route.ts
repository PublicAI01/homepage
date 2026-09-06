import { createMcpHandler } from 'mcp-handler';
import { z } from 'zod';

import { describeIndex, getModel, rankModels } from '../lib/query';

/**
 * The index as an MCP server, so an agent can ask "which model, and how do I
 * call it?" and get the same answer a person reads on the page — scores with
 * their sources, and the access channel with the rule behind it. Stateless
 * Streamable HTTP, no auth: the data is public and the snapshot is static.
 */
const json = (v: unknown) => ({
  content: [{ type: 'text' as const, text: JSON.stringify(v, null, 2) }],
});

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      'rank_models',
      {
        title: 'Rank models',
        description:
          'Rank models on the PublicAI Index — Overall, or within a category (Agents, Coding, Reasoning, Knowledge, General, Human preference) or a domain (e.g. "Agentic coding", "Mathematics", "Instruction following"). Each row carries its Overall index, coverage across recognised boards, and the recommended access channel (OpenRouter id, vendor site, open weights). Scores are 0–100 standardized; 50 is average, not a grade.',
        inputSchema: z.object({
          scope: z
            .string()
            .optional()
            .describe(
              '"overall" (default), a category, or a domain. Call describe_index for the list.',
            ),
          org: z
            .string()
            .optional()
            .describe('Restrict to one organisation, e.g. "Anthropic".'),
          minBoards: z
            .number()
            .int()
            .min(0)
            .max(10)
            .optional()
            .describe(
              'Minimum recognised boards a model must be scored by. Default 2 (ranked models only); 0 includes report-only models.',
            ),
          limit: z
            .number()
            .int()
            .min(1)
            .max(100)
            .optional()
            .describe('Rows to return, default 20.'),
          openWeights: z
            .boolean()
            .optional()
            .describe('Only models with open weights.'),
          callable: z
            .boolean()
            .optional()
            .describe('Only models with a callable id in a catalog.'),
          reports: z
            .boolean()
            .optional()
            .describe(
              'Include report ✱ figures (launch posts, blogs, write-ups). Default true; false drops them from every score and hides models nothing else measured.',
            ),
          size: z
            .enum(['small', 'medium', 'large', 'xlarge', 'undisclosed'])
            .optional()
            .describe(
              'Size class by total parameters: small ≤ 15B, medium 15–100B, large 100B–1T, xlarge > 1T (counted from the weights for open models, read from the name otherwise); undisclosed for closed models. Positions are then within that class.',
            ),
        }),
      },
      async (args) => json(rankModels(args)),
    );

    server.registerTool(
      'get_model',
      {
        title: 'Get a model',
        description:
          'Everything the index holds on one model: rank and Overall index, scores by category and domain, every source figure with the exact label the source printed and a link to it, catalog facts (context window, price per 1M tokens, open weights), and the recommended way to call it with alternatives.',
        inputSchema: z.object({
          model: z
            .string()
            .describe(
              'Model id (e.g. "claude-fable-5-1") or name (e.g. "Claude Fable 5.1").',
            ),
        }),
      },
      async ({ model }) => json(getModel(model)),
    );

    server.registerTool(
      'describe_index',
      {
        title: 'Describe the index',
        description:
          'How the index is built: the method, the fixed weighting of the Overall index with its rationale, every source with its measures and caveats, the category → domain taxonomy usable as scopes, the access-channel rule, and the stated limits. Call this first when unsure which scope to ask for.',
        inputSchema: z.object({}),
      },
      async () => json(describeIndex()),
    );
  },
  {
    serverInfo: { name: 'publicai-index', version: '1.0.0' },
  },
);

export { handler as DELETE, handler as GET, handler as POST };
