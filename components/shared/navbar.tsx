"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Globe,
  LogOut,
  Settings,
  LayoutDashboard,
  Building,
  Menu,
  X,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils/shadcnUtils";
import { Button } from "@/components/ui/button";
import { logout } from "@/service/logout";
import { getMe } from "@/service/getMe";
import type { User as UserType } from "@/types";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

interface NavbarProps {
  user?: UserType | null;
}

export function Navbar({ user: initialUser = undefined }: NavbarProps) {
  const [user, setUser] = useState<UserType | null | undefined>(initialUser);

  useEffect(() => {
    let active = true;
    getMe()
      .then((res) => {
        if (!active) return;
        setUser(res?.success && res?.data ? (res.data as UserType) : null);
      })
      .catch(() => {
        if (active) setUser(null);
      });
    return () => {
      active = false;
    };
  }, []);

  const isUserLoading = user === undefined;
  const displayName = user?.profile?.fullName || "User";
  const avatarUrl = user?.profile?.avatarUrl || null;

  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState<"EN" | "BN">("EN");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [pathname]);

  const getDashboardHref = (role: string) => {
    switch (role) {
      case "TENANT":
        return "/tenant-dashboard";
      case "LANDLORD":
        return "/landlord-dashboard";
      case "ADMIN":
        return "/admin-dashboard";
      default:
        return "/";
    }
  };

  const navLinks = [
    { name: "Browse Properties", href: "/properties", icon: Building },
  ];

  if (user) {
    navLinks.push({ name: "Dashboard", href: getDashboardHref(user.role), icon: LayoutDashboard });
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200 backdrop-blur-md bg-background/90 border-b border-border/40",
        scrolled ? "shadow-sm border-border bg-background/95" : ""
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/properties" && pathname.includes("dashboard"));
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors hover:text-primary hover:bg-muted/50",
                  isActive
                    ? "text-primary font-semibold bg-primary/10"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="size-3.5" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Cluster - Mobile & Desktop */}
        <div className="flex items-center gap-2.5">
          {/* Language Toggle (Desktop) */}
          <button
            onClick={() => setLang(lang === "EN" ? "BN" : "EN")}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors border border-border/50"
            title="Toggle Language"
          >
            <Globe className="size-3.5 text-primary" />
            <span>{lang}</span>
          </button>

          {isUserLoading ? (
            <div className="hidden md:flex items-center gap-2" aria-hidden="true">
              <div className="h-8 w-16 animate-pulse rounded-md bg-muted" />
              <div className="h-8 w-28 animate-pulse rounded-md bg-muted" />
            </div>
          ) : user ? (
            /* Logged In User Controls (Desktop) */
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  await logout();
                }}
                className="group flex items-center gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all font-medium text-xs px-3"
                title="Log Out"
              >
                <LogOut className="size-4 transition-transform group-hover:scale-110 group-hover:-translate-x-0.5" />
                <span className="hidden lg:inline">Log Out</span>
              </Button>
            </div>
          ) : (
            /* Logged Out Desktop CTA Cluster */
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-2 text-xs font-medium text-foreground hover:text-primary transition-colors"
              >
                Log in
              </Link>
              <Link href="/register">
                <Button size="sm" className="font-semibold shadow-xs">
                  <Building className="mr-1.5 size-3.5" />
                  List Your Property
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Sheet Menu Trigger */}
          <Sheet open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
            <SheetTrigger
              render={
                <button
                  className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                  aria-label="Toggle navigation menu"
                >
                  <Menu className="size-5" />
                </button>
              }
            />
            <SheetContent side="top" className="w-full max-h-[85vh] p-0 flex flex-col bg-card border-b border-border shadow-2xl">
              <SheetHeader className="p-4 border-b border-border flex items-center justify-between">
                <Logo />
                <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="space-y-2">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href || (link.href !== "/properties" && pathname.includes("dashboard"));
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileDrawerOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-colors",
                          isActive
                            ? "text-primary bg-primary/10"
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        <Icon className="size-5 text-primary" />
                        {link.name}
                      </Link>
                    );
                  })}
                </div>

                <div className="pt-6 border-t border-border space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-xs text-muted-foreground font-medium">
                      Language
                    </span>
                    <button
                      onClick={() => setLang(lang === "EN" ? "BN" : "EN")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-foreground bg-muted border border-border"
                    >
                      <Globe className="size-3.5 text-primary" />
                      {lang}
                    </button>
                  </div>

                  {isUserLoading ? (
                    <div className="grid grid-cols-2 gap-3 pt-2" aria-hidden="true">
                      <div className="h-11 w-full animate-pulse rounded-lg bg-muted" />
                      <div className="h-11 w-full animate-pulse rounded-lg bg-muted" />
                    </div>
                  ) : user ? (
                    <Button 
                      variant="destructive" 
                      className="w-full h-11 text-sm font-semibold flex items-center justify-center gap-2 group transition-all"
                      onClick={async () => {
                        setMobileDrawerOpen(false);
                        await logout();
                      }}
                    >
                      <LogOut className="size-4 transition-transform group-hover:-translate-x-1" />
                      Log Out
                    </Button>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <Link href="/login" onClick={() => setMobileDrawerOpen(false)}>
                        <Button variant="outline" className="w-full h-11 text-sm font-semibold">Log in</Button>
                      </Link>
                      <Link href="/register" onClick={() => setMobileDrawerOpen(false)}>
                        <Button className="w-full h-11 text-sm font-semibold">List Property</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
