"use server";

import { fetchApi } from "@/lib/api";
import { cookies } from "next/headers";
import { updateTag } from "next/cache";
import { Property } from "@/types";
import { CACHE_TAG_PROPERTIES, CACHE_TAG_AMENITIES, propertyDetailTag } from "@/service/cache-tags";

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function getAllAmenities(searchTerm?: string, limit: number = 10, type?: string) {
  try {
    let query = `/amenities?limit=${limit}`;
    if (searchTerm) {
      query += `&searchTerm=${encodeURIComponent(searchTerm)}`;
    }
    if (type) {
      query += `&type=${encodeURIComponent(type)}`;
    }
    const res = await fetchApi<{ data: any[] }>(query, { next: { revalidate: 600, tags: [CACHE_TAG_AMENITIES] } });
    return { success: true, data: res.data || [] };
  } catch (error: any) {
    return { success: false, data: [], error: error.message };
  }
}

export async function setPropertyAmenities(propertyId: string, amenityIds: string[]) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetchApi<{ data: Property }>(`/properties/${propertyId}/amenities`, {
      method: "PATCH",
      headers,
      body: { amenityIds }, // Assuming the backend expects this payload structure.
    });
    updateTag(CACHE_TAG_PROPERTIES);
    updateTag(propertyDetailTag(propertyId));
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
