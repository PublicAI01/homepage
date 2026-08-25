import { COMPANY_TYPES } from '@/constant/contact';
import { COUNTRIES } from '@/constant/countries';
import {
  isEmailAddress,
  optionalString,
  optionalText,
  requiredString,
} from '@/server/validation';

export const CONTACT_FROM_ADDRESS = 'noreply@publicai.io';

const MAX_NAME_LENGTH = 100;
const MAX_COMPANY_LENGTH = 200;
const MAX_COMMENTS_LENGTH = 5000;

export interface ContactSubmission {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  companyType?: string;
  country?: string;
  comments?: string;
}

export function parseContactSubmission(
  body: Record<string, unknown>,
): ContactSubmission | null {
  const firstName = requiredString(body.firstName, MAX_NAME_LENGTH);
  const lastName = requiredString(body.lastName, MAX_NAME_LENGTH);
  const company = requiredString(body.company, MAX_COMPANY_LENGTH);
  if (!firstName || !lastName || !company) return null;

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  if (!isEmailAddress(email)) return null;

  const companyType = optionalString(body.companyType, MAX_COMPANY_LENGTH);
  if (companyType === null) return null;
  if (
    companyType !== undefined &&
    !(COMPANY_TYPES as readonly string[]).includes(companyType)
  ) {
    return null;
  }

  const country = optionalString(body.country, MAX_COMPANY_LENGTH);
  if (country === null) return null;
  if (
    country !== undefined &&
    !(COUNTRIES as readonly string[]).includes(country)
  ) {
    return null;
  }

  const comments = optionalText(body.comments, MAX_COMMENTS_LENGTH);
  if (comments === null) return null;

  return {
    firstName,
    lastName,
    email,
    company,
    companyType,
    country,
    comments,
  };
}

export interface ContactEmail {
  subject: string;
  body: string;
}

export function buildContactEmail(
  submission: ContactSubmission,
  meta: { submittedAt: string; ip: string },
): ContactEmail {
  const {
    firstName,
    lastName,
    email,
    company,
    companyType,
    country,
    comments,
  } = submission;
  return {
    subject: `Business request — ${firstName} ${lastName}, ${company}`,
    body: [
      'New business request from publicai.io/business',
      '',
      `Name:          ${firstName} ${lastName}`,
      `Business email: ${email}`,
      `Company:       ${company}`,
      `Company type:  ${companyType ?? '-'}`,
      `Country:       ${country ?? '-'}`,
      '',
      'Comments:',
      comments ?? '-',
      '',
      `Submitted: ${meta.submittedAt} · IP: ${meta.ip}`,
    ].join('\n'),
  };
}
