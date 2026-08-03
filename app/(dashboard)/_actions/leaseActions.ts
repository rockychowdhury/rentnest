"use server";

import { fetchApi } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function getLandlordLeases() {
  const headers = await getAuthHeaders();
  return await fetchApi("/leases/landlord-leases", {
    method: "GET",
    headers,
  });
}

export async function updateLeaseStatus(id: string, status: string) {
  const headers = await getAuthHeaders();
  const result = await fetchApi(`/leases/${id}/status`, {
    method: "PATCH",
    headers,
    body: { status },
  });
  
  if (result.success) {
    revalidatePath("/landlord-dashboard/leases");
  }
  return result;
}
