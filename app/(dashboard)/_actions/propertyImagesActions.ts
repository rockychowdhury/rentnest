"use server";

import { fetchApi } from "@/lib/api";
import { cookies } from "next/headers";
import { updateTag } from "next/cache";
import { PropertyImage } from "@/types";
import { CACHE_TAG_PROPERTIES, propertyDetailTag } from "@/service/cache-tags";

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const invalidatePropertyCaches = (propertyId?: string) => {
  updateTag(CACHE_TAG_PROPERTIES);
  if (propertyId) updateTag(propertyDetailTag(propertyId));
};

export async function getPropertyImages(propertyId: string) {
  try {
    const res = await fetchApi<{ data: PropertyImage[] }>(`/property-images/property/${propertyId}`);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function uploadPropertyImage(propertyId: string, url: string, deleteUrl: string, isCover: boolean = false, caption?: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetchApi<{ data: PropertyImage }>(`/property-images/property/${propertyId}`, {
      method: "POST",
      headers,
      body: { url, deleteUrl, isCover, caption },
    });
    invalidatePropertyCaches(propertyId);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getImgbbApiKey() {
  return process.env.IMGBB_API_KEY || null;
}

export async function updatePropertyImage(imageId: string, data: Partial<PropertyImage>) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetchApi<{ data: PropertyImage }>(`/property-images/${imageId}`, {
      method: "PATCH",
      headers,
      body: data,
    });
    invalidatePropertyCaches();
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deletePropertyImage(imageId: string) {
  try {
    const headers = await getAuthHeaders();
    await fetchApi(`/property-images/${imageId}`, {
      method: "DELETE",
      headers,
    });
    invalidatePropertyCaches();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
