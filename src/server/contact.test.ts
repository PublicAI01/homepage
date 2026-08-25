import { describe, expect, it } from 'vitest';

import { buildContactEmail, parseContactSubmission } from '@/server/contact';

const VALID_BODY = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@company.com',
  company: 'Company, Inc.',
  companyType: 'Startup',
  country: 'Singapore',
  comments: 'Hello',
};

describe('parseContactSubmission', () => {
  it('accepts a fully populated body', () => {
    expect(parseContactSubmission(VALID_BODY)).toEqual(VALID_BODY);
  });

  it('accepts absent or empty optional fields', () => {
    const { firstName, lastName, email, company } = VALID_BODY;
    expect(
      parseContactSubmission({
        firstName,
        lastName,
        email,
        company,
        companyType: '',
        country: '',
        comments: '',
      }),
    ).toEqual({ firstName, lastName, email, company });
  });

  it('trims whitespace on required fields', () => {
    const parsed = parseContactSubmission({
      ...VALID_BODY,
      firstName: '  Jane ',
      email: ' jane@company.com ',
    });
    expect(parsed?.firstName).toBe('Jane');
    expect(parsed?.email).toBe('jane@company.com');
  });

  it('accepts multi-line comments', () => {
    const parsed = parseContactSubmission({
      ...VALID_BODY,
      comments: 'line one\nline two',
    });
    expect(parsed?.comments).toBe('line one\nline two');
  });

  it.each([
    ['firstName missing', { ...VALID_BODY, firstName: undefined }],
    ['firstName blank', { ...VALID_BODY, firstName: '   ' }],
    ['firstName too long', { ...VALID_BODY, firstName: 'a'.repeat(101) }],
    ['firstName with newline', { ...VALID_BODY, firstName: 'a\nb' }],
    ['lastName not a string', { ...VALID_BODY, lastName: 42 }],
    ['email invalid', { ...VALID_BODY, email: 'not-an-email' }],
    ['email too long', { ...VALID_BODY, email: `${'a'.repeat(250)}@b.io` }],
    ['company too long', { ...VALID_BODY, company: 'a'.repeat(201) }],
    ['companyType unknown', { ...VALID_BODY, companyType: 'Cartel' }],
    ['country unknown', { ...VALID_BODY, country: 'Atlantis' }],
    ['comments too long', { ...VALID_BODY, comments: 'a'.repeat(5001) }],
    ['comments with NUL', { ...VALID_BODY, comments: 'a\0b' }],
    ['comments not a string', { ...VALID_BODY, comments: ['a'] }],
  ])('rejects %s', (_label, body) => {
    expect(parseContactSubmission(body as Record<string, unknown>)).toBeNull();
  });
});

describe('buildContactEmail', () => {
  const meta = { submittedAt: '2026-08-24T00:00:00.000Z', ip: '203.0.113.9' };

  it('renders every field', () => {
    const email = buildContactEmail(VALID_BODY, meta);
    expect(email.subject).toBe('Business request — Jane Doe, Company, Inc.');
    expect(email.body).toBe(
      [
        'New business request from publicai.io/business',
        '',
        'Name:          Jane Doe',
        'Business email: jane@company.com',
        'Company:       Company, Inc.',
        'Company type:  Startup',
        'Country:       Singapore',
        '',
        'Comments:',
        'Hello',
        '',
        'Submitted: 2026-08-24T00:00:00.000Z · IP: 203.0.113.9',
      ].join('\n'),
    );
  });

  it('renders "-" for absent optional fields', () => {
    const { firstName, lastName, email, company } = VALID_BODY;
    const built = buildContactEmail(
      { firstName, lastName, email, company },
      meta,
    );
    expect(built.body).toContain('Company type:  -');
    expect(built.body).toContain('Country:       -');
    expect(built.body).toContain('Comments:\n-');
  });
});
