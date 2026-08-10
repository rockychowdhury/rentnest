"use server";

import { fetchApi } from "@/lib/api";
import { cookies } from "next/headers";
import { revalidatePath, updateTag } from "next/cache";
import { CACHE_TAG_PROPERTIES } from "@/service/cache-tags";

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function getTenantReviews() {
  try {
    const headers = await getAuthHeaders();
    const reviewsData = await fetchApi<any>("/reviews/my-reviews", { headers }).catch(() => ({ data: [] }));
    const leasesData = await fetchApi<any>("/leases/my-leases", { headers }).catch(() => ({ data: [] }));
    
    const completedLeases = (leasesData.data || []).filter((l: any) => ["COMPLETED", "TERMINATED"].includes(l.status));
    const writtenReviews = reviewsData.data || [];
    const reviewedLeaseIds = writtenReviews.map((r: any) => r.leaseId).filter(Boolean);
    
    const eligibleLeases = completedLeases
      .filter((l: any) => !reviewedLeaseIds.includes(l.id))
      .map((l: any) => ({
        ...l,
        property: l.propertyUnit?.property || l.property,
      }));

    return { 
      success: true, 
      data: {
        written: writtenReviews,
        eligible: eligibleLeases
      } 
    };
  } catch (error: any) {
    return { success: false, data: { written: [], eligible: [] }, error: error.message };
  }
}

export async function createReview(data: { propertyId: string; leaseId?: string; rating: number; comment?: string }) {
  try {
    const headers = await getAuthHeaders();
    const result = await fetchApi<any>("/reviews", {
      method: "POST",
      headers,
      body: data,
    });
    revalidatePath("/tenant-dashboard/reviews");
    updateTag(CACHE_TAG_PROPERTIES);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateReview(reviewId: string, data: { rating?: number; comment?: string }) {
  try {
    const headers = await getAuthHeaders();
    const result = await fetchApi<any>(`/reviews/${reviewId}`, {
      method: "PATCH",
      headers,
      body: data,
    });
    revalidatePath("/tenant-dashboard/reviews");
    updateTag(CACHE_TAG_PROPERTIES);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteReview(reviewId: string) {
  try {
    const headers = await getAuthHeaders();
    const result = await fetchApi<any>(`/reviews/${reviewId}`, {
      method: "DELETE",
      headers,
    });
    revalidatePath("/tenant-dashboard/reviews");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
