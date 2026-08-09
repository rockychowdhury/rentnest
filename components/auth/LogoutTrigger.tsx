"use client";

import { useEffect } from "react";
import { logout } from "@/service/logout";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function LogoutTrigger() {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      await logout();
      toast.error("User does not exist. You have been logged out.");
      // Hard redirect to clear any lingering client cache state
      window.location.href = "/login";
    };
    
    handleLogout();
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-muted/20">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground text-sm font-medium">Syncing account state...</p>
    </div>
  );
}
