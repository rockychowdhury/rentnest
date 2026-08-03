"use server";

import { fetchApi } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function getLandlordReviews() {
  const headers = await getAuthHeaders();
  return await fetchApi("/reviews/landlord-reviews", {
    method: "GET",
    headers,
  });
}

export async function respondToReview(id: string, landlordResponse: string) {
  const headers = await getAuthHeaders();
  const result = await fetchApi(`/reviews/${id}/respond`, {
    method: "PATCH",
    headers,
    body: { landlordResponse },
  });
  
  if (result.success) {
    revalidatePath("/landlord-dashboard/reviews");
  }
  return result;
}
