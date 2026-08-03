"use server";

import { fetchApi } from "@/lib/api";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function getTenantApplications() {
  try {
    const headers = await getAuthHeaders();
    const data = await fetchApi<any>("/rental-requests/my-requests", { headers });
    return { success: true, data: data.data || [] }; // Assuming data is wrapped in a data field based on typical APIs or just return data directly
  } catch (error: any) {
    return { success: false, data: [], error: error.message };
  }
}

export async function cancelRentalRequest(requestId: string) {
  try {
    const headers = await getAuthHeaders();
    const result = await fetchApi<any>(`/rental-requests/${requestId}/cancel`, {
      method: "PATCH",
      headers,
    });
    revalidatePath("/tenant-dashboard/applications");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getRentalRequestDetails(requestId: string) {
  try {
    const headers = await getAuthHeaders();
    const data = await fetchApi<any>(`/rental-requests/${requestId}`, {
      headers,
    });
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
