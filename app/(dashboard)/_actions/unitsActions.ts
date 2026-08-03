"use server";

import { fetchApi } from "@/lib/api";
import { cookies } from "next/headers";
import { PropertyUnit, UnitStatus } from "@/types";

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
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
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
// Note: Restore unit endpoint wasn't in the explicit list, might need to patch or specific endpoint, assuming generic patch for now if not available, but sticking to known endpoints. If backend adds restore, update here.
