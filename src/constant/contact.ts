/** reCAPTCHA action bound to the business contact form. */
export const RECAPTCHA_CONTACT_ACTION = 'contact_submit';

export const COMPANY_TYPES = [
  'AI lab / model developer',
  'Enterprise',
  'Startup',
  'Research institution',
  'Other',
] as const;

export type CompanyType = (typeof COMPANY_TYPES)[number];
