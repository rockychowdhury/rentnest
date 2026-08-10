"use server";

import { fetchApi } from "@/lib/api";
import { cookies } from "next/headers";
import { updateTag } from "next/cache";
import { Property, PropertyStatus, Category, ApiResponse } from "@/types";
import { CACHE_TAG_PROPERTIES, CACHE_TAG_CATEGORIES, propertyDetailTag } from "@/service/cache-tags";

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const invalidatePropertyCaches = (propertyId?: string) => {
  updateTag(CACHE_TAG_PROPERTIES);
  if (propertyId) updateTag(propertyDetailTag(propertyId));
};

export async function getMyProperties() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetchApi<{ data: Property[] }>("/properties/my-properties", { headers });
    return { success: true, data: res.data || [] };
  } catch (error: any) {
    return { success: false, data: [], error: error.message };
  }
}

export async function getPropertyById(propertyId: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetchApi<{ data: Property }>(`/properties/${propertyId}`, { headers });
    return { success: true, data: res.data };
  } catch (error: any) {
    console.error(`getPropertyById failed for ${propertyId}:`, error);
    return { success: false, error: error.message };
  }
}

export async function createProperty(data: Partial<Property>) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetchApi<{ data: Property }>("/properties", {
      method: "POST",
      headers,
      body: data,
    });
    invalidatePropertyCaches();
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateProperty(propertyId: string, data: Partial<Property>) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetchApi<{ data: Property }>(`/properties/${propertyId}`, {
      method: "PATCH",
      headers,
      body: data,
    });
    invalidatePropertyCaches(propertyId);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updatePropertyStatus(propertyId: string, status: PropertyStatus) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetchApi<ApiResponse<Property>>(`/properties/${propertyId}/status`, {
      method: "PATCH",
      headers,
      body: { status },
    });
    invalidatePropertyCaches(propertyId);
    return { success: true, data: res.data, message: res.message };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function archiveProperty(propertyId: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetchApi(`/properties/${propertyId}`, {
      method: "DELETE",
      headers,
    });
    invalidatePropertyCaches(propertyId);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function restoreProperty(propertyId: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetchApi<ApiResponse>(`/properties/${propertyId}/restore`, {
      method: "POST",
      headers,
    });
    invalidatePropertyCaches(propertyId);
    return { success: true, message: res.message };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function requestPropertyVerification(propertyId: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetchApi<ApiResponse>(`/properties/${propertyId}/request-verification`, {
      method: "POST",
      headers,
    });
    invalidatePropertyCaches(propertyId);
    return { success: true, message: res.message };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deactivateProperty(propertyId: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetchApi<ApiResponse>(`/properties/${propertyId}/inactive`, {
      method: "PATCH",
      headers,
    });
    invalidatePropertyCaches(propertyId);
    return { success: true, message: res.message };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getCategories() {
  try {
    const res = await fetchApi<{ data: Category[] }>("/categories", {
      next: { revalidate: 600, tags: [CACHE_TAG_CATEGORIES] },
    });
    return { success: true, data: res.data || [] };
  } catch (error: any) {
    return { success: false, data: [], error: error.message };
  }
}

