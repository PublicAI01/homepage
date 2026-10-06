import { describe, expect, it } from 'vitest';

import { GET } from './route';

const get = async (query: string) => {
  const res = GET(new Request(`https://publicai.io/model-index/api?${query}`));
  return {
    status: res.status,
    body: (await res.json()) as Record<string, unknown>,
  };
};

describe('switches on the JSON API', () => {
  it('reads 0 and false as off, 1 and true as on', async () => {
    // Anything but the literal `false` was on, so `reports=0` counted
    // report ✱ figures for a caller asking to leave them out (2026-10-06).
    for (const off of ['0', 'false'])
      expect((await get(`scope=coding&reports=${off}`)).body.reports).toBe(
        false,
      );
    for (const on of ['1', 'true'])
      expect((await get(`scope=coding&reports=${on}`)).body.reports).toBe(true);
  });

  it('does not filter to open weights when told not to', async () => {
    const all = await get('scope=overall&minBoards=0');
    const off = await get('scope=overall&minBoards=0&openWeights=0');
    const on = await get('scope=overall&minBoards=0&openWeights=1');
    expect(off.body.total).toBe(all.body.total);
    expect(on.body.total).toBeLessThan(all.body.total as number);
  });

  it('refuses a switch it cannot read rather than turning it on', async () => {
    for (const q of [
      'reports=no',
      'reports=',
      'openWeights=off',
      'callable=2',
    ]) {
      const r = await get(`scope=coding&${q}`);
      expect(r.status, q).toBe(400);
      expect(r.body.error, q).toMatch(/must be true or false/);
    }
  });
});
