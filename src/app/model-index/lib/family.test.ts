import { describe, expect, it } from 'vitest';

import { familyOf } from './family';

describe('familyOf', () => {
  it('reads the model line off the name', () => {
    const cases: [string, string][] = [
      ['Claude Fable 5.1', 'Claude'],
      ['Opus 4.5', 'Claude'],
      ['GPT-5.5', 'GPT'],
      ['GPT OSS 120B', 'GPT'],
      ['Qwen3.8 27B', 'Qwen'],
      ['GLM-5.3 Flash', 'GLM'],
      ['K2 Horizon 375B A23B', 'K2'],
      ['Kimi K3', 'Kimi'],
      ['DeepSeek V4 Pro 0813', 'DeepSeek'],
      ['Gemini 3.5 Flash', 'Gemini'],
      ['O3 Mini', 'O3'],
      ['Hy3', 'Hy3'],
      ['Muse Spark 1.3', 'Muse'],
    ];
    for (const [name, family] of cases)
      expect(familyOf(name), name).toBe(family);
  });
});
