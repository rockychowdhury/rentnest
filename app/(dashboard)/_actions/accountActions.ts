"use server";

import { fetchApi } from "@/lib/api";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function getAccountProfile() {
  try {
    const headers = await getAuthHeaders();
    const result = await fetchApi<any>("/users/me", { headers, next: { revalidate: 600 } });
    return { success: true, data: result.data || result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateAccount(data: any) {
  try {
    const headers = await getAuthHeaders();
    const result = await fetchApi<any>("/users/me", {
      method: "PATCH",
      headers,
      body: data,
    });
    revalidatePath("/", "layout");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateProfile(data: any) {
  try {
    const headers = await getAuthHeaders();
    const result = await fetchApi<any>("/profile/me", {
      method: "PATCH",
      headers,
      body: data,
    });
    revalidatePath("/", "layout");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function changePassword(data: any) {
  try {
    const headers = await getAuthHeaders();
    const result = await fetchApi<any>("/auth/change-password", {
      method: "PATCH",
      headers,
      body: data,
    });
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteAccount() {
  try {
    const headers = await getAuthHeaders();
    await fetchApi<any>("/users/me", {
      method: "DELETE",
      headers,
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
