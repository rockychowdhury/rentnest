"use server";

import { fetchApi } from "@/lib/api";
import { cookies } from "next/headers";
import { updateTag } from "next/cache";
import { Pricing } from "@/types";
import { CACHE_TAG_PROPERTIES } from "@/service/cache-tags";

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const invalidatePropertyListCaches = () => {
  updateTag(CACHE_TAG_PROPERTIES);
};

export async function createPricing(propertyUnitId: string, data: Partial<Pricing>) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetchApi<{ data: Pricing }>(`/pricing/unit/${propertyUnitId}`, {
      method: "POST",
      headers,
      body: data,
    });
    invalidatePropertyListCaches();
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updatePricing(pricingId: string, data: Partial<Pricing>) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetchApi<{ data: Pricing }>(`/pricing/${pricingId}`, {
      method: "PATCH",
      headers,
      body: data,
    });
    invalidatePropertyListCaches();
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deletePricing(pricingId: string) {
  try {
    const headers = await getAuthHeaders();
    await fetchApi(`/pricing/${pricingId}`, {
      method: "DELETE",
      headers,
    });
    invalidatePropertyListCaches();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getPricingsByUnit(propertyUnitId: string) {
  try {
    const res = await fetchApi<{ data: Pricing[] }>(`/pricing/unit/${propertyUnitId}`, {
      method: "GET",
    });
    return { success: true, data: res.data || [] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
