"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils/shadcnUtils";
import { Menu, LogOut, LucideIcon } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { logout } from "@/service/logout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { User as UserType } from "@/types";

export interface DashboardNavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface MobileDashboardHeaderProps {
  user?: UserType | null;
  navItems: DashboardNavItem[];
  roleTitle: string;
}

export function MobileDashboardHeader({ user, navItems, roleTitle }: MobileDashboardHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const userName = (user as any)?.fullName || user?.profile?.fullName || "User";
  const userInitials = userName.substring(0, 2).toUpperCase();
  const userEmail = user?.email || "";

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    router.push("/login");
  };

  return (
    <header className="md:hidden sticky top-0 z-50 w-full bg-card border-b border-border px-4 py-3 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon-sm" className="text-foreground" />
            }
          >
            <Menu className="size-5" />
            <span className="sr-only">Toggle menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 flex flex-col bg-card">
            <SheetHeader className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Logo />
                <Badge variant="outline" className="text-[10px] uppercase font-bold px-1.5 py-0.5">
                  {roleTitle}
                </Badge>
              </div>
              <SheetTitle className="sr-only">{roleTitle} Navigation</SheetTitle>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {navItems.map((item) => {
                const isActive = item.href.endsWith("-dashboard") 
                  ? pathname === item.href 
                  : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="p-4 border-t border-border mt-auto">
              <div className="flex items-center gap-3 mb-3 px-1">
                <Avatar className="size-9 border border-border">
                  <AvatarImage src={user?.profile?.avatarUrl || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{userInitials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col overflow-hidden text-left">
                  <span className="text-xs font-semibold text-foreground truncate">{userName}</span>
                  <span className="text-[10px] text-muted-foreground truncate">{userEmail}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-2"
                onClick={handleLogout}
              >
                <LogOut className="size-4" />
                Sign out
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <Logo />
      </div>

      <div className="flex items-center gap-2">
        <Avatar className="size-8 border border-border">
          <AvatarImage src={user?.profile?.avatarUrl || undefined} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{userInitials}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
