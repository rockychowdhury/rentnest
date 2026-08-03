"use server";

import { fetchApi } from "@/lib/api";
import { cookies } from "next/headers";
import { getTenantApplications } from "./tenantApplications";
import { getTenantPayments } from "./tenantPayments";

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function getTenantOverview() {
  try {
    const headers = await getAuthHeaders();
    
    // Fetch live Applications, Payments, and Favorites from backend API
    const [appsRes, paymentsRes, favoritesRes] = await Promise.all([
      getTenantApplications().catch(() => ({ success: false, data: [] })),
      getTenantPayments().catch(() => ({ success: false, data: { statementPayments: [] } })),
      fetchApi<any>("/favorites/my-favorites", { headers }).catch(() => ({ data: [] })),
    ]);

    const applications = Array.isArray(appsRes.data) ? appsRes.data : [];
    const statementPayments = paymentsRes?.data?.statementPayments || [];
    const favorites = Array.isArray(favoritesRes?.data) ? favoritesRes.data : [];

    const pendingApplications = applications.filter((app: any) => app.status === "PENDING").length;
    const savedPropertiesCount = favorites.length; // Real count from backend (0 if none saved)

    // Build real recent activity list from live applications & payments
    const recentActivity = [
      ...applications.slice(0, 3).map((app: any) => ({
        id: `app-${app.id}`,
        type: "APPLICATION_UPDATE",
        title: `Rental Request: ${app.propertyUnit?.property?.title || app.propertyUnit?.unitLabel || 'Property'}`,
        description: `Status: ${app.status} • Move-in Date: ${app.moveInDate || 'TBD'}`,
        date: app.createdAt || new Date().toISOString(),
      })),
      ...statementPayments.slice(0, 3).map((p: any) => ({
        id: `pay-${p.id}`,
        type: "PAYMENT",
        title: `Rent Payment: ৳${Number(p.amount).toLocaleString()}`,
        description: `Payment status: ${p.status} via ${p.paymentMethod || 'Online'}`,
        date: p.createdAt || new Date().toISOString(),
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

    return {
      success: true,
      data: {
        hasActiveLease: false,
        isPaymentDue: false,
        upcomingPayment: null,
        stats: {
          pendingApplications,
          savedProperties: savedPropertiesCount,
        },
        recentActivity,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      data: {
        hasActiveLease: false,
        isPaymentDue: false,
        upcomingPayment: null,
        stats: {
          pendingApplications: 0,
          savedProperties: 0,
        },
        recentActivity: [],
      },
    };
  }
}
