import React from "react";
import { TenantSidebar, tenantNavItems } from "../_components/tenant/TenantSidebar";
import { MobileDashboardHeader } from "../_components/MobileDashboardHeader";
import { getMe } from "@/service/getMe";
import { LogoutTrigger } from "@/components/auth/LogoutTrigger";

import { DashboardBackButton } from "@/components/shared/DashboardBackButton";

export default async function TenantDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profileRes = await getMe();
  
  if (!profileRes?.success) {
    return <LogoutTrigger />;
  }

  const user = profileRes?.data || null;

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-muted/20">
      <MobileDashboardHeader user={user} navItems={tenantNavItems} roleTitle="Tenant" />
      <TenantSidebar user={user} />
      <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8">
        <div className="max-w-screen-2xl mx-auto space-y-6 sm:space-y-8">
          <DashboardBackButton />
          {children}
        </div>
      </main>
    </div>
  );
}
