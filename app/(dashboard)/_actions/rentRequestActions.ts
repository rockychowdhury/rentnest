"use server";

import { fetchApi } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function getIncomingRentalRequests() {
  const headers = await getAuthHeaders();
  return await fetchApi("/rental-requests/incoming-requests", {
    method: "GET",
    headers,
  });
}

export async function respondToRentalRequest(id: string, status: string, landlordResponse: string) {
  const headers = await getAuthHeaders();
  const result = await fetchApi(`/rental-requests/${id}/respond`, {
    method: "PATCH",
    headers,
    body: { status, landlordResponse },
  });
  
  if (result.success) {
    revalidatePath("/landlord-dashboard/requests");
  }
  return result;
}

export async function createRentalRequest(data: {
  propertyUnitId: string;
  pricingId: string;
  moveInDate: string;
  duration: number;
  message?: string;
}) {
  try {
    const headers = await getAuthHeaders();
    const result = await fetchApi("/rental-requests", {
      method: "POST",
      headers,
      body: data,
    });
    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
