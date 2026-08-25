import { getServerConfig } from '@/server/config';
import {
  guardContentHeaders,
  invalidRequest,
  jsonResponse,
  rateLimited,
  readJsonBody,
} from '@/server/http';
import { isOfficialAccount, type Platform } from '@/server/official-accounts';
import { clientIp, verifyRateLimiter } from '@/server/rate-limit';
import { isRecord } from '@/server/validation';

const TYPE_TO_PLATFORM: Record<number, Platform> = {
  0: 'email',
  1: 'x',
  2: 'telegram',
};

const MAX_QUERY_LENGTH = 300;

export async function POST(request: Request) {
  const headerError = guardContentHeaders(request);
  if (headerError) return headerError;

  const limit = verifyRateLimiter.check(`${clientIp(request)}:/api/verify`);
  if (!limit.allowed) return rateLimited(limit);

  const read = await readJsonBody(request);
  if (!read.ok) return read.response;
  if (!isRecord(read.body)) return invalidRequest();

  const { type, name } = read.body;
  const platform =
    typeof type === 'number' ? TYPE_TO_PLATFORM[type] : undefined;
  if (!platform) return invalidRequest();
  if (
    typeof name !== 'string' ||
    name.length < 1 ||
    name.length > MAX_QUERY_LENGTH
  ) {
    return invalidRequest();
  }

  const { officialAccounts } = getServerConfig();
  return jsonResponse(200, {
    result: isOfficialAccount(officialAccounts, platform, name),
  });
}
