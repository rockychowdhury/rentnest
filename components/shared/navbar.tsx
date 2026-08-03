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

interface NavbarProps {
  user?: UserType | null;
}

export function Navbar({ user = null }: NavbarProps) {
  const displayName = user?.profile?.fullName || "User";
  const avatarUrl = user?.profile?.avatarUrl || null;

  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState<"EN" | "BN">("EN");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setUserMenuOpen(false);
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

        {/* Right Cluster */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === "EN" ? "BN" : "EN")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors border border-border/50"
            title="Toggle Language"
          >
            <Globe className="size-3.5 text-primary" />
            <span>{lang}</span>
          </button>

          {user ? (
            /* Logged In User Dropdown */
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 p-1 rounded-full border border-border hover:border-primary/50 transition-all focus:outline-none"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} className="size-8 rounded-full object-cover border border-primary/20" />
                ) : (
                  <div className="size-8 rounded-full bg-primary/10 text-primary font-semibold text-xs flex items-center justify-center border border-primary/20">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 w-56 rounded-2xl border border-border bg-card p-2 shadow-xl z-20 space-y-1">
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

                    <Link
                      href={getDashboardHref(user.role)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-foreground hover:bg-muted transition-colors"
                    >
                      <LayoutDashboard className="size-3.5 text-muted-foreground" />
                      Dashboard
                    </Link>

                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-foreground hover:bg-muted transition-colors"
                    >
                      <Settings className="size-3.5 text-muted-foreground" />
                      Settings
                    </Link>

                    <button
                      onClick={async () => {
                        await logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-destructive hover:bg-destructive/10 transition-colors text-left"
                    >
                      <LogOut className="size-3.5 text-destructive" />
                      Log Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Logged Out CTA Cluster */
            <div className="flex items-center gap-2">
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
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          aria-label="Toggle navigation menu"
        >
          {mobileDrawerOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bottom-0 bg-background/95 backdrop-blur-lg border-t border-border z-40 p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-top duration-200">
          <div className="space-y-4">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "text-primary font-semibold bg-primary/10"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom Drawer CTA Cluster */}
          <div className="pt-6 border-t border-border space-y-3">
            <div className="flex items-center justify-between mb-2 px-2">
              <span className="text-xs text-muted-foreground font-medium">
                Language
              </span>
              <button
                onClick={() => setLang(lang === "EN" ? "BN" : "EN")}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium text-foreground bg-muted border border-border"
              >
                <Globe className="size-3.5 text-primary" />
                {lang}
              </button>
            </div>

            {user ? (
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-muted/50 border border-border flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      {displayName}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {user.role}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={getDashboardHref(user.role)}>
                      <Button size="sm" variant="outline">Dashboard</Button>
                    </Link>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={async () => {
                        await logout();
                      }}
                    >
                      <LogOut className="size-3.5 mr-1" />
                      Log Out
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login">
                  <Button variant="outline" className="w-full">Log in</Button>
                </Link>
                <Link href="/register">
                  <Button className="w-full font-semibold">List Property</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
