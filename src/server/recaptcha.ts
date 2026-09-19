const RECAPTCHA_PROJECT_ID = 'publicai-homepage';
const ASSESSMENT_URL = `https://recaptchaenterprise.googleapis.com/v1/projects/${RECAPTCHA_PROJECT_ID}/assessments`;
const ASSESSMENT_TIMEOUT_MS = 10_000;
const MIN_SCORE = 0.5;
/**
 * Every hostname the site is served from. https://www.publicai.io answers
 * the same pages with no redirect to the apex, and a token minted on a www
 * page carries `www.publicai.io` as its hostname — so with the apex alone
 * on this list every contact submission from www failed with
 * captcha_failed and nobody was told (2026-09-19). The reCAPTCHA site key's
 * own domain list in the Google console must allow the same hosts.
 */
const SITE_HOSTNAMES = ['publicai.io', 'www.publicai.io'];

interface AssessmentResponse {
  tokenProperties?: {
    valid?: boolean;
    action?: string;
    hostname?: string;
  };
  riskAnalysis?: {
    score?: number;
  };
}

export interface VerifyTokenParams {
  apiKey: string;
  siteKey: string;
  token: string;
  expectedAction: string;
  remoteIp?: string;
}

/**
 * Creates a reCAPTCHA Enterprise assessment:
 * POST {ASSESSMENT_URL}?key={apiKey} with body
 * `{ "event": { "token", "siteKey", "expectedAction", "userIpAddress"? } }`.
 */
export async function verifyRecaptchaToken(
  params: VerifyTokenParams,
): Promise<boolean> {
  const event: Record<string, string> = {
    token: params.token,
    siteKey: params.siteKey,
    expectedAction: params.expectedAction,
  };
  if (params.remoteIp) event.userIpAddress = params.remoteIp;

  let data: AssessmentResponse;
  try {
    const response = await fetch(
      `${ASSESSMENT_URL}?key=${encodeURIComponent(params.apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event }),
        signal: AbortSignal.timeout(ASSESSMENT_TIMEOUT_MS),
      },
    );
    if (!response.ok) return false;
    data = (await response.json()) as AssessmentResponse;
  } catch {
    return false;
  }

  const allowedHostnames =
    process.env.NODE_ENV === 'production'
      ? SITE_HOSTNAMES
      : [...SITE_HOSTNAMES, 'localhost', '127.0.0.1'];

  const tokenProperties = data.tokenProperties;
  return (
    tokenProperties?.valid === true &&
    tokenProperties.action === params.expectedAction &&
    (data.riskAnalysis?.score ?? 0) >= MIN_SCORE &&
    allowedHostnames.includes(tokenProperties.hostname ?? '')
  );
}
