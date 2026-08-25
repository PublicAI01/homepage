import {
  normalizeAccount,
  type OfficialAccounts,
  type Platform,
  PLATFORMS,
} from '@/server/official-accounts';
import { isEmailAddress, isRecord } from '@/server/validation';

export interface ServerConfig {
  awsRegion: string;
  recaptchaSecretKey: string;
  contactEmailTo: readonly string[];
  officialAccounts: OfficialAccounts;
}

const REQUIRED_VARS = [
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_REGION',
  'RECAPTCHA_SECRET_KEY',
] as const;

function parseRecipients(raw: string | undefined): string[] | null {
  const recipients = (raw ?? '')
    .split(',')
    .map((address) => address.trim())
    .filter(Boolean);
  if (recipients.length === 0) return null;
  if (recipients.some((address) => !isEmailAddress(address))) return null;
  return recipients;
}

function parseOfficialAccounts(raw: string | undefined): OfficialAccounts {
  const parsed: unknown = JSON.parse(raw ?? '');
  if (!isRecord(parsed)) throw new Error('not an object');
  const platformKeys = new Set<string>(PLATFORMS);
  if (Object.keys(parsed).some((key) => !platformKeys.has(key))) {
    throw new Error('unknown key');
  }
  const accounts = {} as Record<Platform, string[]>;
  for (const platform of PLATFORMS) {
    const entries = parsed[platform] ?? [];
    if (
      !Array.isArray(entries) ||
      entries.some((entry) => typeof entry !== 'string')
    ) {
      throw new Error('entries must be string arrays');
    }
    const normalized = (entries as string[]).map(normalizeAccount);
    if (normalized.some((entry) => entry.length === 0)) {
      throw new Error('empty entry');
    }
    accounts[platform] = normalized;
  }
  return accounts;
}

/**
 * Reads and validates every server env var. Throws listing only the
 * offending variable names — values must never reach logs or errors.
 */
export function loadServerConfig(
  env: Record<string, string | undefined> = process.env,
): ServerConfig {
  const invalid: string[] = [];

  for (const name of REQUIRED_VARS) {
    if (!env[name]?.trim()) invalid.push(name);
  }

  const contactEmailTo = parseRecipients(env.CONTACT_EMAIL_TO);
  if (contactEmailTo === null) invalid.push('CONTACT_EMAIL_TO');

  let officialAccounts: OfficialAccounts | null = null;
  try {
    officialAccounts = parseOfficialAccounts(env.OFFICIAL_ACCOUNTS_JSON);
  } catch {
    invalid.push('OFFICIAL_ACCOUNTS_JSON');
  }

  if (invalid.length > 0 || contactEmailTo === null || !officialAccounts) {
    throw new Error(
      `Invalid or missing environment variables: ${invalid.join(', ')}`,
    );
  }

  return {
    awsRegion: env.AWS_REGION!.trim(),
    recaptchaSecretKey: env.RECAPTCHA_SECRET_KEY!.trim(),
    contactEmailTo,
    officialAccounts,
  };
}

let cached: ServerConfig | undefined;

export function getServerConfig(): ServerConfig {
  cached ??= loadServerConfig();
  return cached;
}
