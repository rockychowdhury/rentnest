"use server";

import { fetchApi } from "@/lib/api";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  return token ? { 
    Authorization: `Bearer ${token}`,
    Cookie: `accessToken=${token}`
  } : {};
};

// ========================
// USERS
// ========================

export async function getAllUsers() {
  const headers = await getAuthHeaders();
  const result = await fetchApi("/users", {
    method: "GET",
    headers,
  });
  return result;
}

export async function updateUserStatus(userId: string, status: string) {
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
}

// ========================
// AMENITIES
// ========================

export async function getAmenities() {
  return await fetchApi("/amenities", {
    method: "GET",
  });
}

export async function createAmenity(name: string) {
  const headers = await getAuthHeaders();
  const result = await fetchApi("/amenities", {
    method: "POST",
    headers,
    body: { name },
  });
  if (result.success) {
    revalidatePath("/admin-dashboard/amenities");
  }
  return result;
}

export async function updateAmenity(id: string, name: string) {
  const headers = await getAuthHeaders();
  const result = await fetchApi(`/amenities/${id}`, {
    method: "PATCH",
    headers,
    body: { name },
  });
  if (result.success) {
    revalidatePath("/admin-dashboard/amenities");
  }
  return result;
}

export async function deleteAmenity(id: string, name: string) {
  const headers = await getAuthHeaders();
  const result = await fetchApi(`/amenities/${id}`, {
    method: "DELETE",
    headers,
    body: { name },
  });
  if (result.success) {
    revalidatePath("/admin-dashboard/amenities");
  }
  return result;
}

// ========================
// CATEGORIES
// ========================

export async function getCategories() {
  return await fetchApi("/categories", {
    method: "GET",
  });
}

export async function createCategory(name: string) {
  const headers = await getAuthHeaders();
  const result = await fetchApi("/categories", {
    method: "POST",
    headers,
    body: { name },
  });
  if (result.success) {
    revalidatePath("/admin-dashboard/categories");
  }
  return result;
}

export async function updateCategory(id: string, name: string) {
  const headers = await getAuthHeaders();
  const result = await fetchApi(`/categories/${id}`, {
    method: "PATCH",
    headers,
    body: { name },
  });
  if (result.success) {
    revalidatePath("/admin-dashboard/categories");
  }
  return result;
}

export async function deleteCategory(id: string, name: string) {
  const headers = await getAuthHeaders();
  const result = await fetchApi(`/categories/${id}`, {
    method: "DELETE",
    headers,
    body: { name },
  });
  if (result.success) {
    revalidatePath("/admin-dashboard/categories");
  }
  return result;
}

// ========================
// REQUESTS
// ========================

export async function getAllRequests() {
  const headers = await getAuthHeaders();
  return await fetchApi("/rental-requests", {
    method: "GET",
    headers,
  });
}

// ========================
// LEASES
// ========================

export async function getAllLeases() {
  const headers = await getAuthHeaders();
  return await fetchApi("/leases", {
    method: "GET",
    headers,
  });
}

// ========================
// PAYMENTS
// ========================

export async function getAllPayments() {
  const headers = await getAuthHeaders();
  return await fetchApi("/payments", {
    method: "GET",
    headers,
  });
}

// ========================
// PROPERTIES (Admin Actions)
// ========================

export async function getAllProperties() {
  return await fetchApi("/properties", {
    method: "GET",
  });
}

export async function adminUpdatePropertyStatus(id: string, status: string) {
  const headers = await getAuthHeaders();
  const result = await fetchApi(`/properties/${id}/status`, {
    method: "PATCH",
    headers,
    body: { status },
  });
  if (result.success) {
    revalidatePath("/admin-dashboard/properties");
  }
  return result;
}

export async function adminDeleteProperty(id: string) {
  const headers = await getAuthHeaders();
  const result = await fetchApi(`/properties/${id}`, {
    method: "DELETE",
    headers,
  });
  if (result.success) {
    revalidatePath("/admin-dashboard/properties");
  }
  return result;
}

export async function adminRestoreProperty(id: string) {
  const headers = await getAuthHeaders();
  const result = await fetchApi(`/properties/${id}/restore`, {
    method: "POST",
    headers,
  });
  if (result.success) {
    revalidatePath("/admin-dashboard/properties");
  }
  return result;
}

export async function adminGetUserById(userId: string) {
  const headers = await getAuthHeaders();
  return await fetchApi(`/users/${userId}`, {
    method: "GET",
    headers,
  });
}

export async function adminRestoreUser(identifier: { email?: string; userId?: string; id?: string } | string, emailParam?: string) {
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
}

export async function adminUpdateUserProfile(userId: string, data: any) {
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
}

export async function adminCancelRentalRequest(requestId: string) {
  const headers = await getAuthHeaders();
  const result = await fetchApi(`/rental-requests/${requestId}/cancel`, {
    method: "PATCH",
    headers,
  });
  if (result.success) {
    revalidatePath("/admin-dashboard/requests");
  }
  return result;
}

export async function adminUpdateLeaseStatus(leaseId: string, status: string) {
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
}

export async function adminDeleteReview(reviewId: string) {
  const headers = await getAuthHeaders();
  const result = await fetchApi(`/reviews/${reviewId}`, {
    method: "DELETE",
    headers,
  });
  if (result.success) {
    revalidatePath("/admin-dashboard/reviews");
  }
  return result;
}

