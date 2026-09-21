import { describe, expect, it } from 'vitest';

import {
  isOfficialAccount,
  normalizeAccount,
  type OfficialAccounts,
} from '@/server/official-accounts';

describe('normalizeAccount', () => {
  it('trims and lowercases', () => {
    expect(normalizeAccount('  Support@PublicAI.io ')).toBe(
      'support@publicai.io',
    );
  });

  it('strips a leading @', () => {
    expect(normalizeAccount('@Handle')).toBe('handle');
  });

  it('unwraps profile URLs with a scheme', () => {
    expect(normalizeAccount('https://x.com/Handle')).toBe('handle');
    expect(normalizeAccount('https://twitter.com/Handle')).toBe('handle');
    expect(normalizeAccount('https://t.me/Handle')).toBe('handle');
  });

  it('unwraps profile URLs without a scheme', () => {
    expect(normalizeAccount('t.me/Handle')).toBe('handle');
    expect(normalizeAccount('x.com/Handle')).toBe('handle');
  });

  it('takes the one path segment, trailing slash and query aside', () => {
    expect(normalizeAccount('t.me/handle/')).toBe('handle');
    expect(normalizeAccount('https://x.com/Handle?x=1')).toBe('handle');
  });

  it('treats a deeper path on a profile host as no handle at all', () => {
    // "t.me/scam/public_ai01" verified as public_ai01 (2026-09-20).
    expect(normalizeAccount('https://x.com/a/Handle')).toBe('');
    expect(normalizeAccount('t.me/scam/public_ai01')).toBe('');
  });

  it("does not verify a scammer's URL that ends in the official handle", () => {
    const accounts = { email: [], x: [], telegram: ['public_ai01'] } as const;
    expect(isOfficialAccount(accounts, 'telegram', 't.me/public_ai01')).toBe(
      true,
    );
    expect(
      isOfficialAccount(accounts, 'telegram', 't.me/scam/public_ai01'),
    ).toBe(false);
  });

  it('leaves non-profile hosts as-is', () => {
    expect(normalizeAccount('example.com/handle')).toBe('example.com/handle');
  });

  it('reads a bare host URL as no handle', () => {
    // It used to pass through as "https://t.me/", which matched nothing
    // either; an empty handle says so plainly.
    expect(normalizeAccount('https://t.me/')).toBe('');
  });
});

describe('isOfficialAccount', () => {
  const accounts: OfficialAccounts = {
    email: ['support@publicai.io'],
    x: ['publicai_'],
    telegram: ['public_ai01'],
  };

  it('matches after normalization', () => {
    expect(isOfficialAccount(accounts, 'x', '@PublicAI_')).toBe(true);
    expect(isOfficialAccount(accounts, 'telegram', 't.me/Public_AI01/')).toBe(
      true,
    );
    expect(isOfficialAccount(accounts, 'email', ' Support@PublicAI.io ')).toBe(
      true,
    );
  });

  it('rejects near-misses without similarity scoring', () => {
    // Cyrillic а in place of Latin a.
    expect(isOfficialAccount(accounts, 'x', 'publicаi_')).toBe(false);
    expect(isOfficialAccount(accounts, 'x', 'publicai')).toBe(false);
  });

  it('scopes matching to the queried platform', () => {
    expect(isOfficialAccount(accounts, 'telegram', 'publicai_')).toBe(false);
  });

  it('rejects input that normalizes to the empty string', () => {
    expect(isOfficialAccount(accounts, 'x', '  @ '.trim())).toBe(false);
    expect(isOfficialAccount(accounts, 'x', '@')).toBe(false);
  });
});
