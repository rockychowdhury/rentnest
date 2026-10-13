"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardBackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // Don't show the back button if we are at the root of a dashboard (e.g. /tenant-dashboard)
  const isDashboardRoot = 
    pathname === "/tenant-dashboard" || 
    pathname === "/admin-dashboard" || 
    pathname === "/landlord-dashboard";

  if (isDashboardRoot) {
    return null;
  }

  return (
    <Button 
      variant="ghost" 
      size="sm"
      className="mb-4 gap-2 text-muted-foreground hover:text-foreground -ml-2"
      onClick={() => router.back()}
    >
      <ArrowLeft className="size-4" />
      Back
    </Button>
  );
}
