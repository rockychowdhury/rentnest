"use server";

import { fetchApi } from "@/lib/api";
import { cookies } from "next/headers";
import { PropertyItem } from "@/service/getProperties";

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function getTenantFavorites(): Promise<{ success: boolean; data: PropertyItem[] }> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetchApi<any>("/favorites/my-favorites", { headers });
    const favorites = Array.isArray(res.data) ? res.data : [];
    return {
      success: true,
      data: favorites,
    };
  } catch {
    return {
      success: true,
      data: [],
    };
  }
}
