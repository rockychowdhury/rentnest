import React from "react";
import { LandlordSidebar, landlordNavItems } from "../_components/landlord/LandlordSidebar";
import { MobileDashboardHeader } from "../_components/MobileDashboardHeader";
import { getMe } from "@/service/getMe";

export default async function LandlordDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profileRes = await getMe();
  const user = profileRes?.data || null;

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-muted/20">
      <MobileDashboardHeader user={user} navItems={landlordNavItems} roleTitle="Landlord" />
      <LandlordSidebar user={user} />
      <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}
