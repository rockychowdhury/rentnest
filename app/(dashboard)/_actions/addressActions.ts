"use server";

import { fetchApi } from "@/lib/api";
import { cookies } from "next/headers";
import { Division, District, Upazila } from "@/types";

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Assuming the update property endpoint handles address updates directly via an `address` object
// If there's a specific address endpoint in the future, we can add it here.

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

export async function getUpazilas(districtId: string) {
  try {
    const res = await fetchApi<{ data: Upazila[] }>(`/districts/${districtId}/upazilas`, { next: { revalidate: 600 } });
    return { success: true, data: res.data || [] };
  } catch (error: any) {
    return { success: false, data: [], error: error.message };
  }
}
