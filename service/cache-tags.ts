/**
 * Central registry of cache tags used across the app.
 *
 * Tag cached data reads with these in `service/*` and expire them after a
 * mutation (create/update/delete) in `app/(dashboard)/_actions/*` using
 * `revalidateTag` / `updateTag` from "next/cache".
 */

/** Public property listings (search results, discovery rails, featured rails). */
export const CACHE_TAG_PROPERTIES = "properties";

/** Individual property detail page. Tagged per-id as `${CACHE_TAG_PROPERTY_DETAIL}:${propertyId}`. */
export const CACHE_TAG_PROPERTY_DETAIL = "property-detail";

/** Public categories (filters, bento, forms). */
export const CACHE_TAG_CATEGORIES = "categories";

/** Public amenities (filters, forms). */
export const CACHE_TAG_AMENITIES = "amenities";

/** Helper: per-property detail tag. */
export const propertyDetailTag = (propertyId: string) =>
  `${CACHE_TAG_PROPERTY_DETAIL}:${propertyId}`;
