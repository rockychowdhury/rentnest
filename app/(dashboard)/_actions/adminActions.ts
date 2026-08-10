"use server";

import { fetchApi } from "@/lib/api";
import { cookies } from "next/headers";
import { revalidatePath, updateTag } from "next/cache";
import {
  CACHE_TAG_PROPERTIES,
  CACHE_TAG_CATEGORIES,
  CACHE_TAG_AMENITIES,
  propertyDetailTag,
} from "@/service/cache-tags";

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  return token ? { 
    Authorization: `Bearer ${token}`,
    Cookie: `accessToken=${token}`
  } : {};
};

export async function getAllUsers() {
  const headers = await getAuthHeaders();
  const result = await fetchApi("/users?limit=1000", {
    method: "GET",
    headers,
  });
  return result;
}

export async function updateUserStatus(userId: string, status: string) {
  try {
    const headers = await getAuthHeaders();
    const result = await fetchApi(`/users/${userId}/status`, {
      method: "PATCH",
      headers,
      body: { status },
    });
    if (result.success) {
      revalidatePath("/admin-dashboard/users");
    }
    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAmenities() {
  return await fetchApi("/amenities?limit=1000", {
    method: "GET",
  });
}

export async function createAmenity(name: string) {
  try {
    const headers = await getAuthHeaders();
    const result = await fetchApi("/amenities", {
      method: "POST",
      headers,
      body: { name },
    });
    if (result.success) {
      revalidatePath("/admin-dashboard/amenities");
      updateTag(CACHE_TAG_AMENITIES);
    }
    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateAmenity(id: string, name: string) {
  try {
    const headers = await getAuthHeaders();
    const result = await fetchApi(`/amenities/${id}`, {
      method: "PATCH",
      headers,
      body: { name },
    });
    if (result.success) {
      revalidatePath("/admin-dashboard/amenities");
      updateTag(CACHE_TAG_AMENITIES);
    }
    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteAmenity(id: string, name: string) {
  try {
    const headers = await getAuthHeaders();
    const result = await fetchApi(`/amenities/${id}`, {
      method: "DELETE",
      headers,
      body: { name },
    });
    if (result.success) {
      revalidatePath("/admin-dashboard/amenities");
      updateTag(CACHE_TAG_AMENITIES);
    }
    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getCategories() {
  return await fetchApi("/categories?limit=1000", {
    method: "GET",
  });
}

export async function createCategory(name: string) {
  try {
    const headers = await getAuthHeaders();
    const result = await fetchApi("/categories", {
      method: "POST",
      headers,
      body: { name },
    });
    if (result.success) {
      revalidatePath("/admin-dashboard/categories");
      updateTag(CACHE_TAG_CATEGORIES);
    }
    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateCategory(id: string, name: string) {
  try {
    const headers = await getAuthHeaders();
    const result = await fetchApi(`/categories/${id}`, {
      method: "PATCH",
      headers,
      body: { name },
    });
    if (result.success) {
      revalidatePath("/admin-dashboard/categories");
      updateTag(CACHE_TAG_CATEGORIES);
    }
    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCategory(id: string, name: string) {
  try {
    const headers = await getAuthHeaders();
    const result = await fetchApi(`/categories/${id}`, {
      method: "DELETE",
      headers,
      body: { name },
    });
    if (result.success) {
      revalidatePath("/admin-dashboard/categories");
      updateTag(CACHE_TAG_CATEGORIES);
    }
    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAllRequests() {
  const headers = await getAuthHeaders();
  return await fetchApi("/rental-requests?limit=1000", {
    method: "GET",
    headers,
  });
}

export async function getAllLeases() {
  const headers = await getAuthHeaders();
  return await fetchApi("/leases?limit=1000", {
    method: "GET",
    headers,
  });
}

export async function getAllPayments() {
  const headers = await getAuthHeaders();
  return await fetchApi("/payments?limit=1000", {
    method: "GET",
    headers,
  });
}

export async function getAllProperties() {
  const headers = await getAuthHeaders();
  return await fetchApi("/properties/admin/all?limit=1000", {
    method: "GET",
    headers
  });
}

export async function adminUpdatePropertyStatus(id: string, status: string) {
  try {
    const headers = await getAuthHeaders();
    const result = await fetchApi(`/properties/${id}/status`, {
      method: "PATCH",
      headers,
      body: { status },
    });
    if (result.success !== false) {
      revalidatePath("/admin-dashboard/properties");
      updateTag(CACHE_TAG_PROPERTIES);
      if (id) updateTag(propertyDetailTag(id));
      return { success: true, data: result.data, message: result.message };
    }
    return { success: false, error: result.message || "Failed to update property status" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function adminTogglePropertyFeatured(id: string, isFeatured: boolean) {
  try {
    const headers = await getAuthHeaders();
    const result = await fetchApi(`/properties/${id}`, {
      method: "PATCH",
      headers,
      body: { isFeatured },
    });
    if ((result as any).success !== false) {
      revalidatePath("/admin-dashboard/properties");
      updateTag(CACHE_TAG_PROPERTIES);
      if (id) updateTag(propertyDetailTag(id));
      return { success: true, data: (result as any).data, message: (result as any).message || "Property featured status updated" };
    }
    return { success: false, error: (result as any).message || "Failed to feature property" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function adminDeleteProperty(id: string) {
  try {
    const headers = await getAuthHeaders();
    const result = await fetchApi(`/properties/${id}`, {
      method: "DELETE",
      headers,
    });
    if (result.success) {
      revalidatePath("/admin-dashboard/properties");
      updateTag(CACHE_TAG_PROPERTIES);
      updateTag(propertyDetailTag(id));
    }
    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function adminRestoreProperty(id: string) {
  try {
    const headers = await getAuthHeaders();
    const result = await fetchApi(`/properties/${id}/restore`, {
      method: "POST",
      headers,
    });
    if (result.success) {
      revalidatePath("/admin-dashboard/properties");
      updateTag(CACHE_TAG_PROPERTIES);
      updateTag(propertyDetailTag(id));
    }
    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function adminGetUserById(userId: string) {
  const headers = await getAuthHeaders();
  return await fetchApi(`/users/${userId}`, {
    method: "GET",
    headers,
  });
}

export async function adminRestoreUser(identifier: { email?: string; userId?: string; id?: string } | string, emailParam?: string) {
  try {
    const headers = await getAuthHeaders();
    
    let payload: Record<string, any> = {};

    if (typeof identifier === "object") {
      payload = {
        email: identifier.email,
        userId: identifier.userId || identifier.id,
        id: identifier.id || identifier.userId,
      };
    } else if (typeof identifier === "string") {
      if (identifier.includes("@")) {
        payload = { email: identifier };
      } else {
        payload = {
          email: emailParam,
          userId: identifier,
          id: identifier,
        };
      }
    }

    const result = await fetchApi("/users/restore", {
      method: "POST",
      headers,
      body: payload,
    });
    if (result.success) {
      revalidatePath("/admin-dashboard/users");
    }
    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function adminUpdateUserProfile(userId: string, data: any) {
  try {
    const headers = await getAuthHeaders();
    const result = await fetchApi(`/profile/${userId}`, {
      method: "PATCH",
      headers,
      body: data,
    });
    if (result.success) {
      revalidatePath("/admin-dashboard/users");
    }
    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function adminCancelRentalRequest(requestId: string) {
  try {
    const headers = await getAuthHeaders();
    const result = await fetchApi(`/rental-requests/${requestId}/cancel`, {
      method: "PATCH",
      headers,
    });
    if (result.success) {
      revalidatePath("/admin-dashboard/requests");
    }
    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function adminUpdateLeaseStatus(leaseId: string, status: string) {
  try {
    const headers = await getAuthHeaders();
    const result = await fetchApi(`/leases/${leaseId}/status`, {
      method: "PATCH",
      headers,
      body: { status },
    });
    if (result.success) {
      revalidatePath("/admin-dashboard/leases");
    }
    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function adminDeleteReview(reviewId: string) {
  try {
    const headers = await getAuthHeaders();
    const result = await fetchApi(`/reviews/${reviewId}`, {
      method: "DELETE",
      headers,
    });
    if (result.success) {
      revalidatePath("/admin-dashboard/reviews");
      updateTag(CACHE_TAG_PROPERTIES);
    }
    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAllReviews() {
  try {
    const headers = await getAuthHeaders();
    const result = await fetchApi("/reviews/admin/all?limit=1000", { method: "GET", headers });
    
    let allReviews: any[] = [];
    if (result.success && result.data) {
      const revs = Array.isArray(result.data) ? result.data : (result.data?.data || []);
      allReviews = revs.map((r: any) => ({
        ...r,
        propertyTitle: r.property?.title || "Property"
      }));
    }
    
    return { success: true, data: allReviews };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getVerificationQueue() {
  try {
    const headers = await getAuthHeaders();
    const result = await fetchApi('/properties/admin/verification-queue?limit=100', { method: 'GET', headers });
    return { success: true, data: result.data || [] };
  } catch (error: any) {
    return { success: false, data: [], error: error.message };
  }
}

export async function adminVerifyProperty(propertyId: string) {
  try {
    const headers = await getAuthHeaders();
    const result = await fetchApi(`/properties/${propertyId}/verify`, {
      method: 'PATCH',
      headers,
    });
    if (result.success) {
      revalidatePath('/admin-dashboard/verification-queue');
      revalidatePath('/admin-dashboard/properties');
      updateTag(CACHE_TAG_PROPERTIES);
      updateTag(propertyDetailTag(propertyId));
    }
    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function adminRejectProperty(propertyId: string) {
  try {
    const headers = await getAuthHeaders();
    const result = await fetchApi(`/properties/${propertyId}/reject`, {
      method: 'PATCH',
      headers,
    });
    if (result.success) {
      revalidatePath('/admin-dashboard/verification-queue');
      revalidatePath('/admin-dashboard/properties');
      updateTag(CACHE_TAG_PROPERTIES);
      updateTag(propertyDetailTag(propertyId));
    }
    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
