import { describe, expect, it } from 'vitest';

import { cn } from './index';

/**
 * Regression guard for the project's custom `--text-*` scale.
 *
 * tailwind-merge only recognizes Tailwind's own size scale. Left unconfigured,
 * it treats `text-body-sm` as a text-color and drops it when a real color sits
 * in the same string — so `cn('text-body-sm text-white')` silently rendered at
 * the default font size. These tests fail if that configuration is lost.
 */

const SIZES = [
  'text-display',
  'text-heading',
  'text-subheading',
  'text-lede',
  'text-body',
  'text-body-sm',
  'text-caption',
  'text-micro',
  'text-code',
];

describe('cn', () => {
  it.each(SIZES)('keeps %s when a color is in the same string', (size) => {
    expect(cn(`${size} text-white`).split(' ')).toContain(size);
  });

  it.each(SIZES)(
    'keeps %s when a color follows in a later argument',
    (size) => {
      expect(cn(size, 'text-g2', 'max-w-[68ch]').split(' ')).toContain(size);
    },
  );

  it('keeps the custom size and the color together', () => {
    const out = cn('text-g2 text-body-sm', 'max-w-[68ch]').split(' ');
    expect(out).toContain('text-body-sm');
    expect(out).toContain('text-g2');
    expect(out).toContain('max-w-[68ch]');
  });

  it('still lets a later custom size win over an earlier one', () => {
    const out = cn('text-body', 'text-caption').split(' ');
    expect(out).toContain('text-caption');
    expect(out).not.toContain('text-body');
  });

  it('still lets a later color win over an earlier one', () => {
    const out = cn('text-white', 'text-g2').split(' ');
    expect(out).toContain('text-g2');
    expect(out).not.toContain('text-white');
  });

  it('still merges ordinary Tailwind conflicts', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
    expect(cn('text-sm', 'text-lg')).toBe('text-lg');
  });

  it('lets a Tailwind size override a custom one and vice versa', () => {
    expect(cn('text-body', 'text-sm').split(' ')).not.toContain('text-body');
    expect(cn('text-sm', 'text-body').split(' ')).not.toContain('text-sm');
  });
});
