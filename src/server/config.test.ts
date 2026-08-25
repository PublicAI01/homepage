import { describe, expect, it } from 'vitest';

import { loadServerConfig } from '@/server/config';

const VALID_ENV = {
  AWS_ACCESS_KEY_ID: 'AKIA_TEST',
  AWS_SECRET_ACCESS_KEY: 'secret',
  AWS_REGION: 'eu-central-1',
  RECAPTCHA_SECRET_KEY: 'recaptcha-secret',
  CONTACT_EMAIL_TO: 'support@publicai.io',
  OFFICIAL_ACCOUNTS_JSON: JSON.stringify({
    email: ['Support@PublicAI.io'],
    x: ['@PublicAI_'],
    telegram: ['https://t.me/Public_AI01'],
  }),
};

describe('loadServerConfig', () => {
  it('returns a parsed config for a valid environment', () => {
    const config = loadServerConfig(VALID_ENV);
    expect(config.awsRegion).toBe('eu-central-1');
    expect(config.contactEmailTo).toEqual(['support@publicai.io']);
  });

  it('normalizes official-account entries at load time', () => {
    const config = loadServerConfig(VALID_ENV);
    expect(config.officialAccounts).toEqual({
      email: ['support@publicai.io'],
      x: ['publicai_'],
      telegram: ['public_ai01'],
    });
  });

  it('splits comma-separated recipients', () => {
    const config = loadServerConfig({
      ...VALID_ENV,
      CONTACT_EMAIL_TO: 'a@publicai.io, b@publicai.io',
    });
    expect(config.contactEmailTo).toEqual(['a@publicai.io', 'b@publicai.io']);
  });

  it('lists every missing variable by name', () => {
    expect(() => loadServerConfig({})).toThrowError(
      /AWS_ACCESS_KEY_ID.*AWS_SECRET_ACCESS_KEY.*AWS_REGION.*RECAPTCHA_SECRET_KEY.*CONTACT_EMAIL_TO.*OFFICIAL_ACCOUNTS_JSON/,
    );
  });

  it('never includes variable values in the error', () => {
    const env = { ...VALID_ENV, AWS_REGION: '', CONTACT_EMAIL_TO: 'oops' };
    try {
      loadServerConfig(env);
      expect.unreachable();
    } catch (error) {
      expect((error as Error).message).not.toContain('oops');
      expect((error as Error).message).not.toContain('AKIA_TEST');
    }
  });

  it.each([
    ['', 'empty'],
    ['not-an-email', 'not an address'],
    ['a@publicai.io,,not-an-email', 'one bad address'],
  ])('rejects CONTACT_EMAIL_TO %j (%s)', (value) => {
    expect(() =>
      loadServerConfig({ ...VALID_ENV, CONTACT_EMAIL_TO: value }),
    ).toThrowError(/CONTACT_EMAIL_TO/);
  });

  it.each([
    ['not json'],
    ['[]'],
    ['{"email": "support@publicai.io"}'],
    ['{"email": [1]}'],
    ['{"twitter": ["a"]}'],
    ['{"x": ["  "]}'],
  ])('rejects OFFICIAL_ACCOUNTS_JSON %j', (value) => {
    expect(() =>
      loadServerConfig({ ...VALID_ENV, OFFICIAL_ACCOUNTS_JSON: value }),
    ).toThrowError(/OFFICIAL_ACCOUNTS_JSON/);
  });

  it('accepts a platform key being absent', () => {
    const config = loadServerConfig({
      ...VALID_ENV,
      OFFICIAL_ACCOUNTS_JSON: '{"email": ["support@publicai.io"]}',
    });
    expect(config.officialAccounts.x).toEqual([]);
    expect(config.officialAccounts.telegram).toEqual([]);
  });
});
