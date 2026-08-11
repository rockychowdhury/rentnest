import { API_BASE_URL } from "@/lib/api";
import { PropertyItem, mapBackendPropertyToPropertyItem } from "./getProperties";
import { CACHE_TAG_PROPERTIES } from "./cache-tags";

export async function getFeaturedProperties(): Promise<PropertyItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/properties/featured`, {
      next: { revalidate: 86400, tags: [CACHE_TAG_PROPERTIES, "featured"] },
    });
    if (!res.ok) return [];
    
    const responseData = await res.json();
    if (!responseData.success) return [];
    
    const backendProperties = responseData.data || [];
    return backendProperties.map(mapBackendPropertyToPropertyItem);
  } catch (error) {
    console.error("Failed to fetch featured properties:", error);
    return [];
  }
}
