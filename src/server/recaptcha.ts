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
    invalidReason?: string;
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

/** Why an assessment was refused, in words safe to log: never the token or the key. */
export type Assessment = { ok: true } | { ok: false; reason: string };

/**
 * Creates a reCAPTCHA Enterprise assessment:
 * POST {ASSESSMENT_URL}?key={apiKey} with body
 * `{ "event": { "token", "siteKey", "expectedAction", "userIpAddress"? } }`.
 */
export async function assessRecaptcha(
  params: VerifyTokenParams,
): Promise<Assessment> {
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
    if (!response.ok)
      return {
        ok: false,
        reason: `assessment API answered ${response.status}`,
      };
    data = (await response.json()) as AssessmentResponse;
  } catch (error) {
    return {
      ok: false,
      reason: `assessment API unreachable (${error instanceof Error ? error.name : 'error'})`,
    };
  }

  const allowedHostnames =
    process.env.NODE_ENV === 'production'
      ? SITE_HOSTNAMES
      : [...SITE_HOSTNAMES, 'localhost', '127.0.0.1'];

  const t = data.tokenProperties;
  if (t?.valid !== true)
    return {
      ok: false,
      reason: `token invalid (${t?.invalidReason ?? 'no reason given'})`,
    };
  if (t.action !== params.expectedAction)
    return {
      ok: false,
      reason: `action "${t.action}" is not "${params.expectedAction}"`,
    };
  const score = data.riskAnalysis?.score ?? 0;
  if (score < MIN_SCORE)
    return { ok: false, reason: `score ${score} below ${MIN_SCORE}` };
  if (!allowedHostnames.includes(t.hostname ?? ''))
    return { ok: false, reason: `hostname "${t.hostname ?? ''}" not allowed` };
  return { ok: true };
}

/**
 * The assessment as a yes/no, with every no written to the log.
 *
 * A refusal used to be a bare `false`: the visitor saw "captcha failed",
 * the server recorded nothing, and when the apex-only hostname list turned
 * away every www visitor the contact form was dead for days with no line
 * anywhere to say so (2026-09-19). A rotated API key, an exhausted quota
 * or a changed site-key domain list fail the same silent way. The reason
 * is logged with the action, so the route it hit is on the line; the
 * token and the key never are.
 */
export async function verifyRecaptchaToken(
  params: VerifyTokenParams,
): Promise<boolean> {
  const result = await assessRecaptcha(params);
  if (!result.ok)
    console.error(
      `recaptcha: ${params.expectedAction} rejected — ${result.reason}`,
    );
  return result.ok;
}
