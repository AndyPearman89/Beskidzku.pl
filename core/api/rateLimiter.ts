/**
 * Simple in-memory rate limiter.
 * Not suitable for multi-process/multi-instance deployments — swap for
 * a Redis-backed implementation when scaling horizontally.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

/**
 * Returns true when the request is within the allowed quota.
 *
 * @param key       Unique key, e.g. "ip:1.2.3.4" or "admin:write"
 * @param limit     Maximum number of requests allowed within the window
 * @param windowMs  Rolling window length in milliseconds (default: 60 000)
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs = 60_000
): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;

  entry.count += 1;
  return true;
}

/**
 * Returns the IP address string from common proxy / direct-connection headers.
 * Falls back to "unknown".
 *
 * NOTE: x-forwarded-for can be spoofed when the app is not behind a trusted
 * reverse proxy.  In production, ensure only your proxy can set this header,
 * or replace this function with platform-specific IP extraction.
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}
