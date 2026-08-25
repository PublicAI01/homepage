'use client';

import { sendGAEvent } from '@next/third-parties/google';
import Link from 'next/link';
import Script from 'next/script';
import { useState } from 'react';

import Select from '@/app/business/select';
import { OFFICE_EMAIL_ADDRESS } from '@/constant';
import { COMPANY_TYPES, RECAPTCHA_CONTACT_ACTION } from '@/constant/contact';
import { COUNTRIES } from '@/constant/countries';
import { cn } from '@/utils';

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

// Tokens are single-use with a short TTL, so request one per attempt.
// The lazily loaded script may not be present yet, hence the typeof guard.
async function requestRecaptchaToken(): Promise<string | null> {
  if (!SITE_KEY || typeof window.grecaptcha === 'undefined') return null;
  const enterprise = window.grecaptcha.enterprise;
  try {
    await new Promise<void>((resolve) => enterprise.ready(resolve));
    return await enterprise.execute(SITE_KEY, {
      action: RECAPTCHA_CONTACT_ACTION,
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}

type SubmitError = 'rate_limited' | 'failed';

const fieldClassName = cn(
  'rounded-10 w-full border border-[#2C2C31] bg-white/3 px-3.5 py-3 text-sm text-white transition',
  'placeholder:text-[#6F6F78] focus:border-[#5A2FE0] focus:bg-[rgba(72,8,254,0.06)] focus:shadow-[0_0_0_3px_rgba(64,0,200,0.28)] focus:outline-none',
);

interface FieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}

const Field = ({ label, htmlFor, required, children }: FieldProps) => (
  <div className="flex flex-col gap-1.5">
    <label
      className="text-g3 text-xs font-medium"
      htmlFor={htmlFor}>
      {label}
      {required ? <span className="text-p1 ml-0.5">*</span> : null}
    </label>
    {children}
  </div>
);

const ErrorBanner = ({ error }: { error: SubmitError }) => (
  <div
    className="rounded-10 mb-4 border border-red-500/40 bg-red-500/10 px-3.5 py-3 text-sm text-red-200"
    role="alert">
    {error === 'rate_limited' ? (
      'Too many attempts — please try again later.'
    ) : (
      <>
        Something went wrong and your request was not sent. Please try again, or
        email{' '}
        <a
          className="text-p1 underline"
          href={`mailto:${OFFICE_EMAIL_ADDRESS}`}>
          {OFFICE_EMAIL_ADDRESS}
        </a>
        .
      </>
    )}
  </div>
);

const SuccessNotice = () => (
  <div className="flex flex-col items-center gap-3 py-2">
    <p className="text-p1 text-[11px] font-semibold tracking-[0.16em] uppercase">
      PublicAI · for institutions
    </p>
    <h1 className="text-base font-semibold text-white md:text-lg lg:text-xl xl:text-2xl">
      Thanks — we&apos;ll be in touch.
    </h1>
    <p className="text-g2 text-sm">Your request has been sent to our team.</p>
    <Link
      className="app-shadow mt-3 rounded-lg bg-[#4808FE] px-5 py-2.5 text-sm font-semibold text-white shadow-white transition-colors hover:bg-[#3700F0]"
      href="/">
      Back to home
    </Link>
  </div>
);

const Spinner = () => (
  <svg
    className="size-5 animate-spin text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const ContactForm = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>(
    'idle',
  );
  const [error, setError] = useState<SubmitError | null>(null);
  const [companyType, setCompanyType] = useState('');
  const [country, setCountry] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'submitting') return;
    const data = new FormData(event.currentTarget);
    setStatus('submitting');
    setError(null);

    const recaptchaToken = await requestRecaptchaToken();
    if (!recaptchaToken) {
      setStatus('idle');
      setError('failed');
      return;
    }

    const payload = {
      firstName: String(data.get('firstName') ?? ''),
      lastName: String(data.get('lastName') ?? ''),
      email: String(data.get('email') ?? ''),
      company: String(data.get('company') ?? ''),
      companyType,
      country,
      comments: String(data.get('comments') ?? ''),
      website: String(data.get('website') ?? ''),
      recaptchaToken,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setStatus('success');
        sendGAEvent('event', 'buttonClicked', {
          button_name: 'business_form_submitted',
          screen_name: 'business',
        });
        return;
      }
      setStatus('idle');
      setError(response.status === 429 ? 'rate_limited' : 'failed');
    } catch {
      setStatus('idle');
      setError('failed');
    }
  };

  if (status === 'success') return <SuccessNotice />;

  return (
    <>
      {SITE_KEY ? (
        <Script
          src={`https://www.recaptcha.net/recaptcha/enterprise.js?render=${SITE_KEY}`}
          strategy="lazyOnload"
        />
      ) : null}
      <p className="text-p1 mb-3 text-[11px] font-semibold tracking-[0.16em] uppercase">
        PublicAI · for institutions
      </p>
      <h1 className="mb-2 text-xl font-semibold text-white sm:text-2xl md:text-[27px]">
        Connect with our team
      </h1>
      <p className="text-g2 mb-5 text-sm sm:mb-6">
        Reach out to our expert team to learn more about Institutional
        Solutions.
      </p>
      {error ? <ErrorBanner error={error} /> : null}
      <form
        className="relative flex flex-col gap-3.5 sm:gap-4"
        onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <Field
            label="First name"
            htmlFor="firstName"
            required>
            <input
              className={fieldClassName}
              id="firstName"
              name="firstName"
              placeholder="Jane"
              autoComplete="given-name"
              maxLength={100}
              required
            />
          </Field>
          <Field
            label="Last name"
            htmlFor="lastName"
            required>
            <input
              className={fieldClassName}
              id="lastName"
              name="lastName"
              placeholder="Doe"
              autoComplete="family-name"
              maxLength={100}
              required
            />
          </Field>
        </div>
        <Field
          label="Business email"
          htmlFor="email"
          required>
          <input
            className={fieldClassName}
            id="email"
            name="email"
            type="email"
            placeholder="jane@company.com"
            autoComplete="email"
            maxLength={254}
            required
          />
        </Field>
        <Field
          label="Company name"
          htmlFor="company"
          required>
          <input
            className={fieldClassName}
            id="company"
            name="company"
            placeholder="Company, Inc."
            autoComplete="organization"
            maxLength={200}
            required
          />
        </Field>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <Field
            label="Company type"
            htmlFor="companyType">
            <Select
              id="companyType"
              className={fieldClassName}
              value={companyType}
              onChange={setCompanyType}
              options={COMPANY_TYPES}
            />
          </Field>
          <Field
            label="Country"
            htmlFor="country">
            <Select
              id="country"
              className={fieldClassName}
              value={country}
              onChange={setCountry}
              options={COUNTRIES}
              searchable
              placeholder="Search or select"
            />
          </Field>
        </div>
        <Field
          label="Comments"
          htmlFor="comments">
          <textarea
            className={cn(fieldClassName, 'min-h-23 resize-y leading-normal')}
            id="comments"
            name="comments"
            placeholder="Tell us about your team and what you're looking for."
            maxLength={5000}
          />
        </Field>
        <div
          className="sr-only"
          aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>
        <button
          className={cn(
            'app-shadow mt-1 rounded-lg bg-[#4808FE] py-2.5 text-sm font-semibold text-white shadow-white transition-colors hover:bg-[#3700F0] sm:py-3 sm:text-base',
            status === 'submitting' ? 'opacity-75' : 'cursor-pointer',
          )}
          type="submit"
          aria-label="Submit business request"
          disabled={status === 'submitting'}>
          {status === 'submitting' ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner />
              Loading
            </span>
          ) : (
            'Submit'
          )}
        </button>
        <p className="text-g2 text-center text-xs">
          By submitting, you agree to our{' '}
          <Link
            className="text-p1"
            href="/privacy">
            Privacy Policy
          </Link>
          . This site is protected by reCAPTCHA and the Google{' '}
          <a
            className="text-p1"
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noreferrer">
            Privacy Policy
          </a>{' '}
          and{' '}
          <a
            className="text-p1"
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noreferrer">
            Terms of Service
          </a>{' '}
          apply.
        </p>
      </form>
    </>
  );
};

export default ContactForm;
