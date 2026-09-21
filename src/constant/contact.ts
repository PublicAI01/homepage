/** reCAPTCHA action bound to the business contact form. */
export const RECAPTCHA_CONTACT_ACTION = 'contact_submit';
/** reCAPTCHA action bound to the Index Weekly sign-up. */
export const RECAPTCHA_SUBSCRIBE_ACTION = 'subscribe';

export const COMPANY_TYPES = [
  'AI lab / model developer',
  'Enterprise',
  'Startup',
  'Research institution',
  'Other',
] as const;

export type CompanyType = (typeof COMPANY_TYPES)[number];
