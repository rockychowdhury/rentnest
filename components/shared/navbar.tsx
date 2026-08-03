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

export function Navbar({ user = null }: NavbarProps) {
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

  const navLinks = [
    { name: "Browse Properties", href: "/properties" },
  ];

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
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3.5 py-2 rounded-lg text-xs font-medium transition-colors hover:text-primary hover:bg-muted/50",
                  isActive
                    ? "text-primary font-semibold bg-primary/10"
                    : "text-muted-foreground"
                )}
              >
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

          {user ? (
            /* Logged In User Dropdown Menu via Portal */
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex items-center gap-2 p-1 rounded-full border border-border hover:border-primary/50 transition-all focus:outline-none"
                aria-label="User Menu"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} className="size-8 rounded-full object-cover border border-primary/20" />
                ) : (
                  <div className="size-8 rounded-full bg-primary/10 text-primary font-semibold text-xs flex items-center justify-center border border-primary/20">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-xl border border-border bg-card">
                <div className="px-3 py-2 border-b border-border/60">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {displayName}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-muted-foreground truncate">
                      {user.email}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {user.role}
                    </span>
                  </div>
                </div>

                <DropdownMenuItem
                  render={
                    <Link
                      href={getDashboardHref(user.role)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium rounded-lg text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                      <LayoutDashboard className="size-3.5 text-muted-foreground" />
                      Dashboard
                    </Link>
                  }
                  className="mt-1"
                />

                <DropdownMenuItem
                  render={
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium rounded-lg text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                      <Settings className="size-3.5 text-muted-foreground" />
                      Settings
                    </Link>
                  }
                />

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  variant="destructive"
                  onClick={async () => {
                    await logout();
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium rounded-lg text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                >
                  <LogOut className="size-3.5" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                  <Link
                    href="/properties"
                    onClick={() => setMobileDrawerOpen(false)}
                    className={cn(
                      "block px-4 py-3 rounded-xl text-base font-semibold transition-colors",
                      pathname === "/properties"
                        ? "text-primary bg-primary/10"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    Browse Properties
                  </Link>

                  {user && (
                    <>
                      <Link
                        href={getDashboardHref(user.role)}
                        onClick={() => setMobileDrawerOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-colors",
                          pathname.includes("dashboard")
                            ? "text-primary bg-primary/10"
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        <LayoutDashboard className="size-5 text-primary" />
                        Dashboard
                      </Link>

                      <Link
                        href="/settings"
                        onClick={() => setMobileDrawerOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-foreground hover:bg-muted transition-colors"
                      >
                        <Settings className="size-5 text-primary" />
                        Settings
                      </Link>
                    </>
                  )}
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

                  {user ? (
                    <div className="p-3.5 rounded-xl bg-muted/50 border border-border flex items-center justify-between">
                      <div className="overflow-hidden pr-2">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {displayName}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {user.role} • {user.email}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={async () => {
                          setMobileDrawerOpen(false);
                          await logout();
                        }}
                      >
                        <LogOut className="size-3.5 mr-1" />
                        Log Out
                      </Button>
                    </div>
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
