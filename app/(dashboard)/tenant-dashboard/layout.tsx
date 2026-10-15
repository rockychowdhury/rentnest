import React from "react";
import { TenantSidebar, tenantNavItems } from "../_components/tenant/TenantSidebar";
import { MobileDashboardHeader } from "../_components/MobileDashboardHeader";

import { DashboardBackButton } from "@/components/shared/DashboardBackButton";

/**
 * Fully static shell: no server data fetch, so this layout prerenders once
 * and the router reuses it across every dashboard navigation — the sidebar
 * never suspends, refetches, or flashes. Auth is enforced by the proxy
 * (unauthenticated users never reach here); identity blocks inside the
 * sidebar/header resolve the user client-side via useCurrentUser.
 */
export default function TenantDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-muted/20">
      <MobileDashboardHeader navItems={tenantNavItems} roleTitle="Tenant" />
      <TenantSidebar />
      <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8">
        <div className="max-w-screen-2xl mx-auto space-y-6 sm:space-y-8">
          <DashboardBackButton />
          {children}
        </div>
      </main>
    </div>
  );
}
