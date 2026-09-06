import type { Access } from '../data/types';

/**
 * Which channel to recommend for calling a model, and why. One rule, stated
 * on the page and returned to agents, so the recommendation can be argued
 * with rather than guessed at.
 *
 * OpenRouter first: one OpenAI-compatible endpoint and one key reach every
 * listed model, ids are stable across vendors, and a swap is a string change.
 * The vendor's own API is the alternative when a first-party feature is
 * needed (caching tiers, batch, native tools). Open weights are for
 * self-hosting.
 */
export const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
export const OPENROUTER_DOCS = 'https://openrouter.ai/docs';

export const ACCESS_RULE =
  'Recommended channel: the OpenRouter id through its OpenAI-compatible endpoint — one key, every listed model, ids stable across vendors. Use the vendor’s own API for first-party features, and the weights for self-hosting.';

export interface Channel {
  kind: 'openrouter' | 'vendor' | 'weights';
  name: string;
  url: string;
  /** What to put in the `model` field, where the channel has one. */
  model?: string;
  baseUrl?: string;
  note: string;
}

export interface Recommendation {
  recommended: Channel | null;
  alternatives: Channel[];
  rule: string;
}

export function channelsOf(access: Access | undefined): Channel[] {
  if (!access) return [];
  const out: Channel[] = [];
  if (access.openrouter) {
    out.push({
      kind: 'openrouter',
      name: 'OpenRouter',
      url: access.openrouter.url,
      model: access.openrouter.id,
      baseUrl: OPENROUTER_BASE_URL,
      note: 'OpenAI-compatible chat completions; one key for every listed model.',
    });
  }
  if (access.official) {
    out.push({
      kind: 'vendor',
      name: access.official.name,
      url: access.official.url,
      note: 'The vendor’s own developer site; first-party features and pricing.',
    });
  }
  if (access.weights) {
    out.push({
      kind: 'weights',
      name: 'Hugging Face',
      url: access.weights.url,
      model: access.weights.huggingFaceId,
      note: 'Open weights; run with vLLM, SGLang or similar.',
    });
  }
  return out;
}

export function recommend(access: Access | undefined): Recommendation {
  const channels = channelsOf(access);
  const [recommended = null, ...alternatives] = channels;
  return { recommended, alternatives, rule: ACCESS_RULE };
}

/** "1,000,000" → "1M", "131,072" → "128K"; what a reader expects to see. */
export function contextLabel(n: number | undefined): string | null {
  if (!n) return null;
  if (n >= 1_000_000) return `${+(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1024) return `${Math.round(n / 1024)}K`;
  return String(n);
}

export function priceLabel(
  inputPerM: number | undefined,
  outputPerM: number | undefined,
): string | null {
  if (inputPerM === undefined && outputPerM === undefined) return null;
  const f = (n: number | undefined) =>
    n === undefined ? '—' : n === 0 ? 'free' : `$${+n.toFixed(2)}`;
  return `${f(inputPerM)} in · ${f(outputPerM)} out / 1M tokens`;
}
