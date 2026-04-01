/**
 * Canonical URL generation utilities
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://beskidzku.pl";

/**
 * Generate canonical URL for a given path
 */
export function generateCanonicalUrl(path: string, params?: Record<string, string | number>): string {
  // Normalize path - remove leading/trailing slashes, then add leading slash
  const normalizedPath = `/${path.replace(/^\/+|\/+$/g, "")}`;

  // Build URL
  const url = new URL(normalizedPath, BASE_URL);

  // Add query parameters if provided
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
  }

  return url.toString();
}

/**
 * Generate canonical URL for peak pages
 */
export function getPeakCanonicalUrl(slug: string): string {
  return generateCanonicalUrl(`/szczyt/${slug}`);
}

/**
 * Generate canonical URL for town/region pages
 */
export function getTownCanonicalUrl(slug: string): string {
  return generateCanonicalUrl(`/region/${slug}`);
}

/**
 * Generate canonical URL for attraction pages
 */
export function getAttractionCanonicalUrl(slug: string): string {
  return generateCanonicalUrl(`/atrakcja/${slug}`);
}

/**
 * Generate canonical URL for route pages
 */
export function getRouteCanonicalUrl(slug: string): string {
  return generateCanonicalUrl(`/trasy/${slug}`);
}

/**
 * Generate canonical URL for planner pages
 */
export function getPlannerCanonicalUrl(slug?: string): string {
  if (slug) {
    return generateCanonicalUrl(`/planer/${slug}`);
  }
  return generateCanonicalUrl("/planner");
}

/**
 * Generate canonical URL for listing pages
 */
export function getListingCanonicalUrl(id: string): string {
  return generateCanonicalUrl(`/listings/${id}`);
}

/**
 * Generate canonical URL for catalog pages with filters
 * Normalizes query parameters to ensure consistent canonicals
 */
export function getCatalogCanonicalUrl(params?: {
  type?: string;
  town?: string;
  q?: string;
  page?: number;
}): string {
  const cleanParams: Record<string, string | number> = {};

  if (params?.type) cleanParams.type = params.type;
  if (params?.town) cleanParams.town = params.town;
  if (params?.q) cleanParams.q = params.q;
  if (params?.page && params.page > 1) cleanParams.page = params.page;

  return generateCanonicalUrl("/listings", Object.keys(cleanParams).length > 0 ? cleanParams : undefined);
}

/**
 * Generate canonical URL for peaks catalog with filters
 */
export function getPeaksCatalogCanonicalUrl(params?: {
  range?: string;
  difficulty?: string;
  page?: number;
}): string {
  const cleanParams: Record<string, string | number> = {};

  if (params?.range) cleanParams.range = params.range;
  if (params?.difficulty) cleanParams.difficulty = params.difficulty;
  if (params?.page && params.page > 1) cleanParams.page = params.page;

  return generateCanonicalUrl("/szczyty", Object.keys(cleanParams).length > 0 ? cleanParams : undefined);
}
