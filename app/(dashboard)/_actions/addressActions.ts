"use server";

import { fetchApi } from "@/lib/api";
import { cookies } from "next/headers";
import { Division, District, Area } from "@/types";

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function getDivisions() {
  try {
    const res = await fetchApi<{ data: Division[] }>("/divisions", { next: { revalidate: 600 } });
    return { success: true, data: res.data || [] };
  } catch (error: any) {
    return { success: false, data: [], error: error.message };
  }
}

export async function getDistricts(divisionId: string) {
  try {
    const res = await fetchApi<{ data: District[] }>(`/divisions/${divisionId}/districts`, { next: { revalidate: 600 } });
    return { success: true, data: res.data || [] };
  } catch (error: any) {
    return { success: false, data: [], error: error.message };
  }
}

export async function getAreas(districtId: string) {
  try {
    const res = await fetchApi<{ data: Area[] }>(`/districts/${districtId}/areas`, { next: { revalidate: 600 } });
    return { success: true, data: res.data || [] };
  } catch (error: any) {
    return { success: false, data: [], error: error.message };
  }
}

export async function searchAreasGlobally(query: string) {
  try {
    const res = await fetchApi<{ data: any[] }>(`/areas/search?q=${encodeURIComponent(query)}`);
    return { success: true, data: res.data || [] };
  } catch (error: any) {
    return { success: false, data: [], error: error.message };
  }
}
