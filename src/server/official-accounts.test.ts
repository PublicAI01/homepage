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

  it('takes the last non-empty path segment', () => {
    expect(normalizeAccount('t.me/handle/')).toBe('handle');
    expect(normalizeAccount('https://x.com/a/Handle?x=1')).toBe('handle');
  });

  it('leaves non-profile hosts as-is', () => {
    expect(normalizeAccount('example.com/handle')).toBe('example.com/handle');
  });

  it('keeps a bare host URL unchanged', () => {
    expect(normalizeAccount('https://t.me/')).toBe('https://t.me/');
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
