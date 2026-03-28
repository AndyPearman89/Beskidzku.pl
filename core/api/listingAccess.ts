import { timingSafeEqual } from "crypto";

/** Minimum acceptable byte length for the admin key. */
const MIN_KEY_LENGTH = 32;

/**
 * Returns true if the request carries a valid LISTINGS_ADMIN_KEY header.
 * Uses timing-safe comparison to prevent timing-based secret enumeration.
 */
export function hasListingsAdminAccess(request: Request): boolean {
  const provided =
    request.headers.get("x-listings-admin-key") ||
    request.headers.get("x-admin-key");

  const expected = process.env.LISTINGS_ADMIN_KEY;

  if (!provided || !expected) return false;
  if (expected.length < MIN_KEY_LENGTH) return false;
  if (provided.length !== expected.length) return false;

  try {
    return timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
  } catch {
    return false;
  }
}

/**
 * Returns true if the request can manage (edit/delete) a specific listing.
 * For now: admin key required.
 */
export function canManageListing(request: Request, _listingId: string): boolean {
  return hasListingsAdminAccess(request);
}
