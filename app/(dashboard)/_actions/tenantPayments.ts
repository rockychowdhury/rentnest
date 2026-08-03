"use server";

import { fetchApi } from "@/lib/api";
import { cookies } from "next/headers";

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function getTenantPayments() {
  try {
    const headers = await getAuthHeaders();
    const paymentsData = await fetchApi<any>("/payments/my-payments/", { headers }).catch(() => ({ data: [] }));
    const leasesData = await fetchApi<any>("/leases/my-leases", { headers }).catch(() => ({ data: [] }));
    
    const allPayments = paymentsData.data || [];
    const statementPayments = allPayments.filter((p: any) => p.status !== "PENDING");
    const pendingPayments = allPayments.filter((p: any) => p.status === "PENDING");
    const pendingPaymentLeases = (leasesData.data || []).filter((l: any) => l.status === "PENDING_PAYMENT");

    return { 
      success: true, 
      data: {
        statementPayments: statementPayments,
        pendingPayments: pendingPayments,
        pendingLeases: pendingPaymentLeases
      } 
    };
  } catch (error: any) {
    return { success: false, data: { statementPayments: [], pendingPayments: [], pendingLeases: [] }, error: error.message };
  }
}
export async function checkoutLeasePayment(leaseId: string) {
  try {
    const headers = await getAuthHeaders();
    const result = await fetchApi<any>(`/payments/checkout/lease/${leaseId}`, {
      method: "POST",
      headers
    });
    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
