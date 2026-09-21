export const PLATFORMS = ['email', 'x', 'telegram'] as const;

export type Platform = (typeof PLATFORMS)[number];

export type OfficialAccounts = Record<Platform, readonly string[]>;

const HANDLE_URL_HOSTS = new Set([
  't.me',
  'x.com',
  'twitter.com',
  'www.t.me',
  'www.x.com',
  'www.twitter.com',
]);

function parseHandleUrl(value: string): URL | null {
  const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(value)
    ? value
    : `https://${value}`;
  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return null;
  }
  if (!HANDLE_URL_HOSTS.has(url.hostname.toLowerCase())) return null;
  return url;
}

/**
 * Canonical form shared by queries and list entries:
 * trim, strip a leading `@`, unwrap a known profile URL to its one path
 * segment, lowercase.
 *
 * A profile URL has exactly one segment. Taking the last of several let
 * "t.me/scam/public_ai01" verify as the official handle (2026-09-20); a
 * deeper path is no handle at all, and an empty handle never matches.
 */
export function normalizeAccount(value: string): string {
  let handle = value.trim();
  if (handle.startsWith('@')) handle = handle.slice(1);
  const url = parseHandleUrl(handle);
  if (url) {
    const segments = url.pathname.split('/').filter(Boolean);
    handle = segments.length === 1 ? segments[0] : '';
  }
  return handle.toLowerCase();
}

/** Exact match after normalization, scoped to one platform. */
export function isOfficialAccount(
  accounts: OfficialAccounts,
  platform: Platform,
  query: string,
): boolean {
  const normalized = normalizeAccount(query);
  if (!normalized) return false;
  return accounts[platform].includes(normalized);
}
