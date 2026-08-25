import { SendEmailCommand, SESv2Client } from '@aws-sdk/client-sesv2';

import { RECAPTCHA_CONTACT_ACTION } from '@/constant/contact';
import { getServerConfig } from '@/server/config';
import {
  buildContactEmail,
  CONTACT_FROM_ADDRESS,
  parseContactSubmission,
} from '@/server/contact';
import {
  guardContentHeaders,
  invalidRequest,
  jsonResponse,
  rateLimited,
  readJsonBody,
} from '@/server/http';
import { clientIp, contactRateLimiter } from '@/server/rate-limit';
import { verifyRecaptchaToken } from '@/server/recaptcha';
import { isRecord } from '@/server/validation';

const MAX_TOKEN_LENGTH = 5000;
const SEND_RETRY_AFTER_SECONDS = 60;
// Statically inlined at build time; identifies the site to the
// assessment API alongside the token.
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '';

let sesClient: SESv2Client | undefined;

function getSesClient(region: string): SESv2Client {
  sesClient ??= new SESv2Client({ region });
  return sesClient;
}

function isThrottlingError(error: unknown): boolean {
  if (!isRecord(error)) return false;
  if (isRecord(error.$retryable) && error.$retryable.throttling === true) {
    return true;
  }
  return (
    error.name === 'TooManyRequestsException' ||
    error.name === 'SendingPausedException'
  );
}

export async function POST(request: Request) {
  const headerError = guardContentHeaders(request);
  if (headerError) return headerError;

  const ip = clientIp(request);
  const limit = contactRateLimiter.check(`${ip}:/api/contact`);
  if (!limit.allowed) return rateLimited(limit);

  const read = await readJsonBody(request);
  if (!read.ok) return read.response;
  if (!isRecord(read.body)) return invalidRequest();
  const body = read.body;

  if (body.website !== undefined && body.website !== '') {
    console.warn(`contact: discarded submission from ${ip}`);
    return jsonResponse(200, { ok: true });
  }

  const submission = parseContactSubmission(body);
  if (!submission) return invalidRequest();

  const token = body.recaptchaToken;
  if (
    typeof token !== 'string' ||
    token.length < 1 ||
    token.length > MAX_TOKEN_LENGTH
  ) {
    return invalidRequest();
  }

  const config = getServerConfig();
  const tokenAccepted = await verifyRecaptchaToken({
    apiKey: config.recaptchaSecretKey,
    siteKey: RECAPTCHA_SITE_KEY,
    token,
    expectedAction: RECAPTCHA_CONTACT_ACTION,
    remoteIp: ip === 'unknown' ? undefined : ip,
  });
  if (!tokenAccepted) return jsonResponse(400, { error: 'captcha_failed' });

  const email = buildContactEmail(submission, {
    submittedAt: new Date().toISOString(),
    ip,
  });

  try {
    const sent = await getSesClient(config.awsRegion).send(
      new SendEmailCommand({
        FromEmailAddress: CONTACT_FROM_ADDRESS,
        Destination: { ToAddresses: [...config.contactEmailTo] },
        ReplyToAddresses: [submission.email],
        Content: {
          Simple: {
            Subject: { Data: email.subject, Charset: 'UTF-8' },
            Body: { Text: { Data: email.body, Charset: 'UTF-8' } },
          },
        },
      }),
    );
    // The id SES assigns on acceptance; the only handle for tracing a
    // message that was accepted but never delivered.
    console.log(`contact: email accepted, message id ${sent.MessageId}`);
  } catch (error) {
    if (isThrottlingError(error)) {
      return jsonResponse(
        503,
        { error: 'send_failed' },
        { 'Retry-After': String(SEND_RETRY_AFTER_SECONDS) },
      );
    }
    console.error('contact: email send failed', error);
    return jsonResponse(500, { error: 'send_failed' });
  }

  return jsonResponse(200, { ok: true });
}
