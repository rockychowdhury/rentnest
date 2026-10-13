import React from "react";
import { AdminSidebar, adminNavItems } from "../_components/admin/AdminSidebar";
import { MobileDashboardHeader } from "../_components/MobileDashboardHeader";
import { getAccountProfile } from "../_actions/accountActions";
import { LogoutTrigger } from "@/components/auth/LogoutTrigger";

import { DashboardBackButton } from "@/components/shared/DashboardBackButton";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profileRes = await getAccountProfile();
  
  if (!profileRes?.success) {
    return <LogoutTrigger />;
  }

  const user = profileRes?.data;

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-muted/40">
      <MobileDashboardHeader user={user} navItems={adminNavItems} roleTitle="Admin" />
      <AdminSidebar user={user} />
      
      <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8">
        <div className="max-w-screen-2xl mx-auto space-y-6 sm:space-y-8">
          <DashboardBackButton />
          {children}
        </div>
      </main>
    </div>
  );
}
