const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;

export function isEmailAddress(value: string): boolean {
  return value.length <= MAX_EMAIL_LENGTH && EMAIL_PATTERN.test(value);
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

const CONTROL_CHARS = /[\r\n\0]/;

/** Trimmed single-line string within [1, max] chars, or null if invalid. */
export function requiredString(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (trimmed.length < 1 || trimmed.length > max) return null;
  if (CONTROL_CHARS.test(trimmed)) return null;
  return trimmed;
}

/**
 * Like {@link requiredString}, but absent or empty input maps to undefined.
 * Returns null only for invalid input.
 */
export function optionalString(
  value: unknown,
  max: number,
): string | undefined | null {
  if (value === undefined || value === null || value === '') return undefined;
  return requiredString(value, max);
}

/** Like {@link optionalString}, but keeps newlines for multi-line text. */
export function optionalText(
  value: unknown,
  max: number,
): string | undefined | null {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (trimmed.length < 1 || trimmed.length > max) return null;
  if (trimmed.includes('\0')) return null;
  return trimmed;
}
