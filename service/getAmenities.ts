import { API_BASE_URL } from "@/lib/api";
import { CACHE_TAG_AMENITIES } from "./cache-tags";

export interface AmenityItem {
  id: string;
  name: string;
  icon?: string;
}

export async function getPublicAmenities(): Promise<AmenityItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/amenities`, {
      next: { revalidate: 60, tags: [CACHE_TAG_AMENITIES] },
    });

    if (!res.ok) return [];
    const json = await res.json();
    return json.data || json || [];
  } catch (error) {
    console.error("Failed to fetch public amenities:", error);
    return [];
  }
}
