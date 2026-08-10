"use server";

import { fetchApi } from "@/lib/api";
import { cookies } from "next/headers";
import { updateTag } from "next/cache";
import { PropertyUnit, UnitStatus } from "@/types";
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

export async function getPropertyUnits(propertyId: string) {
  try {
    const res = await fetchApi<{ data: PropertyUnit[] }>(`/property-units/property/${propertyId}`);
    return { success: true, data: res.data || [] };
  } catch (error: any) {
    return { success: false, data: [], error: error.message };
  }
}

export async function createPropertyUnit(propertyId: string, data: Partial<PropertyUnit>) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetchApi<{ data: PropertyUnit }>(`/property-units/property/${propertyId}`, {
      method: "POST",
      headers,
      body: data,
    });
    invalidatePropertyCaches(propertyId);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updatePropertyUnit(unitId: string, data: Partial<PropertyUnit>) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetchApi<{ data: PropertyUnit }>(`/property-units/${unitId}`, {
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

export async function updateUnitStatus(unitId: string, status: UnitStatus) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetchApi<{ data: PropertyUnit }>(`/property-units/${unitId}/status`, {
      method: "PATCH",
      headers,
      body: { status },
    });
    invalidatePropertyCaches();
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function softDeleteUnit(unitId: string) {
  try {
    const headers = await getAuthHeaders();
    await fetchApi(`/property-units/${unitId}`, {
      method: "DELETE",
      headers,
    });
    invalidatePropertyCaches();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function setUnitAmenities(unitId: string, amenityIds: string[]) {
  try {
    const headers = await getAuthHeaders();
    await fetchApi(`/property-units/${unitId}/amenities`, {
      method: "PATCH",
      headers,
      body: { amenityIds },
    });
    invalidatePropertyCaches();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
