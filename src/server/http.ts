import type { RateLimitResult } from '@/server/rate-limit';

const MAX_BODY_BYTES = 10 * 1024;

export function jsonResponse(
  status: number,
  body: unknown,
  headers?: HeadersInit,
): Response {
  return Response.json(body, { status, headers });
}

export function invalidRequest(): Response {
  return jsonResponse(400, { error: 'invalid_request' });
}

export function rateLimited(
  result: Extract<RateLimitResult, { allowed: false }>,
): Response {
  return jsonResponse(
    429,
    { error: 'rate_limited' },
    { 'Retry-After': String(result.retryAfterSeconds) },
  );
}

/**
 * Header-level guards that run before the body is touched:
 * JSON content type only, declared length within the body cap.
 */
export function guardContentHeaders(request: Request): Response | null {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().startsWith('application/json')) {
    return jsonResponse(415, { error: 'invalid_request' });
  }
  const declaredLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return invalidRequest();
  }
  return null;
}

/** Reads and parses the JSON body, enforcing the byte cap on the stream. */
export async function readJsonBody(
  request: Request,
): Promise<{ ok: true; body: unknown } | { ok: false; response: Response }> {
  const reader = request.body?.getReader();
  if (!reader) return { ok: false, response: invalidRequest() };

  const chunks: Uint8Array[] = [];
  let received = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value.byteLength;
      if (received > MAX_BODY_BYTES) {
        await reader.cancel();
        return { ok: false, response: invalidRequest() };
      }
      chunks.push(value);
    }
  } catch {
    return { ok: false, response: invalidRequest() };
  }

  try {
    const text = new TextDecoder().decode(
      chunks.length === 1 ? chunks[0] : concat(chunks, received),
    );
    return { ok: true, body: JSON.parse(text) };
  } catch {
    return { ok: false, response: invalidRequest() };
  }
}

function concat(chunks: Uint8Array[], totalLength: number): Uint8Array {
  const merged = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return merged;
}
