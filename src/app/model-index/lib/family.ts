/**
 * The model line a name belongs to — "Claude", "GPT", "Qwen", "K2" — for
 * the filter. An organisation is the wrong grain for a reader ("Alibaba"
 * for Qwen, "IFM (MBZUAI)" for K2); the line is how people think of them.
 * Read from the first word of the name, version stripped.
 */
const CLAUDE = /^(opus|sonnet|haiku|fable)$/i;

export function familyOf(name: string): string {
  const first = name.trim().split(/\s+/)[0] ?? name;
  if (CLAUDE.test(first)) return 'Claude';
  // "GPT-5.5" → "GPT", "Qwen3.8" → "Qwen", "GLM-5.3" → "GLM"; a one- or
  // two-letter stem ("K2", "O3", "Hy3") is the whole token.
  const m = /^([A-Za-z]+)(?=[-\d.]|$)/.exec(first);
  const stem = m ? m[1] : first;
  return stem.length <= 2 ? first.replace(/[-.]+$/, '') : stem;
}
