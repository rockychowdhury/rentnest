"use server";

import { fetchApi } from "@/lib/api";
import { cookies } from "next/headers";

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function getTenantLeases() {
  try {
    const headers = await getAuthHeaders();
    const data = await fetchApi<any>("/leases/my-leases", { headers });
    return { success: true, data: data.data || [] };
  } catch (error: any) {
    return { success: false, data: [], error: error.message };
  }
}
