"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils/shadcnUtils";
import { 
  LayoutDashboard, 
  Users, 
  Building,
  ScrollText,
  CreditCard,
  Settings,
  LogOut,
  GitPullRequest,
  Tags,
  Sparkles,
  Star
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { logout } from "@/service/logout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const adminNavItems = [
  { name: "Overview", href: "/admin-dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/admin-dashboard/users", icon: Users },
  { name: "Properties", href: "/admin-dashboard/properties", icon: Building },
  { name: "Requests", href: "/admin-dashboard/requests", icon: GitPullRequest },
  { name: "Leases", href: "/admin-dashboard/leases", icon: ScrollText },
  { name: "Payments", href: "/admin-dashboard/payments", icon: CreditCard },
  { name: "Amenities", href: "/admin-dashboard/amenities", icon: Sparkles },
  { name: "Categories", href: "/admin-dashboard/categories", icon: Tags },
  { name: "Reviews", href: "/admin-dashboard/reviews", icon: Star },
];

export function AdminSidebar({ user }: { user: any }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <aside className="w-64 shrink-0 bg-card border-r border-border h-screen sticky top-0 flex flex-col hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Logo />
      </div>

      <div className="flex-1 py-6 px-4 space-y-1">
        {adminNavItems.map((item) => {
          const isActive = item.href === "/admin-dashboard"
            ? pathname === item.href
            : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              suppressHydrationWarning
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="size-4" />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-border mt-auto">
        <div className="flex items-center gap-3 mb-4 px-2">
          <Avatar className="size-10">
            <AvatarImage src={user?.profile?.avatarUrl || undefined} />
            <AvatarFallback>{user?.profile?.fullName?.substring(0, 2).toUpperCase() || "AD"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium truncate">{user?.profile?.fullName || "Admin"}</span>
            <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
          </div>
        </div>
        
        <Link 
          href="/admin-dashboard/account"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors w-full",
            pathname === "/admin-dashboard/account"
              ? "bg-primary text-primary-foreground" 
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Settings className="size-4" />
          Account Settings
        </Link>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 mt-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="size-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
