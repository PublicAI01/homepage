/**
 * Validates server configuration when the server boots so a
 * misconfigured deployment fails its health check instead of failing
 * lazily on the first request.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  if (process.env.NEXT_PHASE === 'phase-production-build') return;
  const { getServerConfig } = await import('@/server/config');
  getServerConfig();
}
