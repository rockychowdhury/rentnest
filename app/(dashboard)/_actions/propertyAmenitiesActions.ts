"use server";

import { fetchApi } from "@/lib/api";
import { cookies } from "next/headers";
import { Property } from "@/types";

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function getAllAmenities(searchTerm?: string, limit: number = 10) {
  try {
    let query = `/amenities?limit=${limit}`;
    if (searchTerm) {
      query += `&searchTerm=${encodeURIComponent(searchTerm)}`;
    }
    const res = await fetchApi<{ data: any[] }>(query, { next: { revalidate: 600 } });
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
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
