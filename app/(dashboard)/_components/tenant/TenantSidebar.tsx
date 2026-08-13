"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/shadcnUtils";
import { 
  LayoutDashboard, 
  Heart, 
  FileText, 
  Key, 
  CreditCard, 
  Star, 
  User,
  LogOut
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { logout } from "@/service/logout";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { User as UserType } from "@/types";

export const tenantNavItems = [
  { name: "Overview", href: "/tenant-dashboard", icon: LayoutDashboard },
  { name: "My Leases", href: "/tenant-dashboard/lease", icon: Key },
  { name: "Payments", href: "/tenant-dashboard/payments", icon: CreditCard },
  { name: "Saved Properties", href: "/tenant-dashboard/saved-properties", icon: Heart },
  { name: "Applications", href: "/tenant-dashboard/applications", icon: FileText },
  { name: "My Reviews", href: "/tenant-dashboard/reviews", icon: Star },
  { name: "Account", href: "/tenant-dashboard/account", icon: User },
];

export function TenantSidebar({ user }: { user?: UserType | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const userName = (user as any)?.fullName || user?.profile?.fullName || "Tenant User";
  const userInitials = userName.substring(0, 2).toUpperCase();
  const userEmail = user?.email || "";

  return (
    <nav className="w-64 shrink-0 border-r border-border/40 bg-card h-screen sticky top-0 flex flex-col hidden md:flex">
      <div className="p-6 pb-2">
        <Logo />
      </div>
      <div className="flex-1 p-4 space-y-1">
        {tenantNavItems.map((item) => {
          const isActive = item.href === "/tenant-dashboard"
            ? pathname === item.href
            : pathname?.startsWith(item.href);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              suppressHydrationWarning
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
              {item.name}
            </Link>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-border/40 mt-auto">
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-3">
            <Avatar className="size-10 border border-border">
              <AvatarImage src={user?.profile?.avatarUrl || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">{userInitials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold truncate">{userName}</span>
              <span className="text-xs text-muted-foreground truncate">{userEmail}</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
        <form action={async () => {
          await logout();
          router.push("/login");
        }}>
          <Button type="submit" variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-2">
            <LogOut className="size-4" />
            Logout
          </Button>
        </form>
      </div>
    </nav>
  );
}
