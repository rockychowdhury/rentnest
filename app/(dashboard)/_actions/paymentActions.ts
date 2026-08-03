"use server";

import { fetchApi } from "@/lib/api";
import { cookies } from "next/headers";

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function getLandlordPayments(status?: string) {
  const headers = await getAuthHeaders();
  const query = status ? `?status=${status}` : "";
  return await fetchApi(`/payments/landlord-payments${query}`, {
    method: "GET",
    headers,
  });
}
