"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogOut,
  LayoutDashboard,
  Building,
  Menu,
  ChevronDown,
  ArrowRight,
  ArrowUpRight,
  Plus,
  Heart,
  FileText,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils/shadcnUtils";
import { logout } from "@/service/logout";
import { getMe } from "@/service/getMe";
import type { User as UserType } from "@/types";
import { ThemeToggle } from "./theme-toggle";

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

  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route change (deferred to avoid cascading render)
  useEffect(() => {
    const t = setTimeout(() => setMobileDrawerOpen(false), 0);
    return () => clearTimeout(t);
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

  const getAccountHref = (role?: string | null) => {
    if (role === "TENANT") return "/tenant-dashboard/account";
    if (role === "LANDLORD") return "/landlord-dashboard/account";
    if (role === "ADMIN") return "/admin-dashboard/account";
    return "/login";
  };

  // Role-aware primary CTA: landlords go straight to creation,
  // tenants get browse (never a landlord-only route -> no 400),
  // guests go to landlord registration.
  const primaryCta =
    user?.role === "LANDLORD"
      ? { href: "/landlord-dashboard/properties/new", label: "List Your Property", icon: Plus }
      : user?.role === "TENANT"
        ? { href: "/properties", label: "Browse Properties", icon: ArrowRight }
        : user?.role === "ADMIN"
          ? { href: "/admin-dashboard", label: "Admin Dashboard", icon: LayoutDashboard }
          : { href: "/register?role=LANDLORD", label: "List Your Property", icon: Plus };

  const navLinks = [
    { name: "Browse", href: "/properties" },
    { name: "For Landlords", href: "/for-landlords" },
    { name: "How It Works", href: "/how-it-works" },
  ];

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/properties")
      return pathname === "/properties" || pathname.startsWith("/properties/");
    return pathname === href || pathname.startsWith(href + "/");
  };

  const onDashboard = pathname.includes("-dashboard");
  const displayName = user?.profile?.fullName || "User";
  const displayInitial = displayName.charAt(0).toUpperCase();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "border-line/70 bg-paper/90 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.25)] backdrop-blur-2xl"
          : "border-line/40 bg-paper/75 backdrop-blur-xl"
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-screen-2xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-[72px] lg:px-8">
        {/* Left — brand + primary nav */}
        <div className="flex min-w-0 items-center gap-8 lg:gap-10">
          <Logo />

          {/* Desktop Navigation — editorial underline style */}
          <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => {
              const active = isActiveLink(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative py-2 font-body text-[13.5px] font-medium tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active ? "text-ink" : "text-muted-foreground hover:text-ink"
                  )}
                >
                  {link.name}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-0 -bottom-px h-0.5 origin-left rounded-full bg-ledger transition-transform duration-300",
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )}
                  />
                </Link>
              );
            })}

            {/* Company dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  "group relative flex items-center gap-1 py-2 font-body text-[13.5px] font-medium tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  pathname === "/about" || pathname === "/contact" || pathname === "/faq"
                    ? "text-ink"
                    : "text-muted-foreground hover:text-ink"
                )}
              >
                Company
                <ChevronDown className="size-3.5 opacity-60 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52 rounded-2xl border-line/60 bg-paper p-1.5 shadow-xl">
                {[
                  { name: "About Us", href: "/about", hint: "Who we are" },
                  { name: "Contact", href: "/contact", hint: "Talk to us" },
                  { name: "FAQ", href: "/faq", hint: "Quick answers" },
                ].map((item) => (
                  <DropdownMenuItem
                    key={item.href}
                    render={
                      <Link
                        href={item.href}
                        className="flex items-center justify-between rounded-xl px-3 py-2.5 focus-visible:outline-none"
                      />
                    }
                    className="rounded-xl focus:bg-field/60"
                  >
                    <span>
                      <span className="block font-body text-sm font-medium text-ink">{item.name}</span>
                      <span className="block font-body text-xs text-muted-foreground">{item.hint}</span>
                    </span>
                    <ArrowUpRight className="size-4 text-muted-foreground" />
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Authenticated shortcut — only rendered for the right role */}
            {!isUserLoading && user && (
              <Link
                href={getDashboardHref(user.role)}
                aria-current={onDashboard ? "page" : undefined}
                className={cn(
                  "group relative py-2 font-body text-[13.5px] font-semibold tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  onDashboard ? "text-ink" : "text-ledger hover:text-ink"
                )}
              >
                Dashboard
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-0 -bottom-px h-0.5 origin-left rounded-full bg-ledger transition-transform duration-300",
                    onDashboard ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )}
                />
              </Link>
            )}
          </nav>
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          {isUserLoading ? (
            <div className="hidden items-center gap-2 md:flex" aria-hidden="true">
              <div className="h-9 w-20 animate-pulse rounded-full bg-field" />
              <div className="h-9 w-36 animate-pulse rounded-full bg-field" />
            </div>
          ) : user ? (
            <div className="hidden items-center gap-3 md:flex">
              {/* North-star action — isolated, role-aware */}
              <Link
                href={primaryCta.href}
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-ledger px-4 font-body text-[13px] font-semibold text-white shadow-[0_8px_20px_-8px_var(--color-ledger)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-8px_var(--color-ledger)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:translate-y-0"
              >
                <primaryCta.icon className="size-4" />
                {primaryCta.label}
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button
                      aria-label="Account menu"
                      className="flex h-9 items-center gap-2 rounded-full border border-line/70 bg-paper py-1 pl-1 pr-2.5 transition-all duration-200 hover:-translate-y-px hover:border-line hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  }
                >
                  <span className="flex size-7 items-center justify-center rounded-full bg-ledger/10 font-display text-xs font-bold text-ledger">
                    {displayInitial}
                  </span>
                  <span className="max-w-24 truncate font-body text-[13px] font-medium text-ink">
                    {displayName}
                  </span>
                  <ChevronDown className="size-3.5 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-64 rounded-2xl border-line/60 bg-paper p-2 shadow-xl"
                >
                  <DropdownMenuLabel className="px-3 py-3 font-normal">
                    <p className="truncate font-body text-sm font-semibold text-ink">{displayName}</p>
                    <p className="mt-0.5 font-body text-xs font-medium capitalize text-muted-foreground">
                      {user.role.toLowerCase()} account
                    </p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-line/60" />

                  <div className="space-y-0.5 p-1">
                    <DropdownMenuItem className="rounded-xl focus:bg-field/60" render={<Link href={getDashboardHref(user.role)} className="flex w-full items-center gap-2.5 px-3 py-2" />}>
                      <LayoutDashboard className="size-4 text-muted-foreground" />
                      <span className="font-body text-sm font-medium text-ink">Dashboard overview</span>
                    </DropdownMenuItem>

                    {user.role === "LANDLORD" && (
                      <>
                        <DropdownMenuItem className="rounded-xl focus:bg-field/60" render={<Link href="/landlord-dashboard/properties" className="flex w-full items-center gap-2.5 px-3 py-2" />}>
                          <Building className="size-4 text-muted-foreground" />
                          <span className="font-body text-sm font-medium text-ink">My properties</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl focus:bg-field/60" render={<Link href="/landlord-dashboard/requests" className="flex w-full items-center gap-2.5 px-3 py-2" />}>
                          <FileText className="size-4 text-muted-foreground" />
                          <span className="font-body text-sm font-medium text-ink">Rental requests</span>
                        </DropdownMenuItem>
                      </>
                    )}

                    {user.role === "TENANT" && (
                      <>
                        <DropdownMenuItem className="rounded-xl focus:bg-field/60" render={<Link href="/tenant-dashboard/applications" className="flex w-full items-center gap-2.5 px-3 py-2" />}>
                          <FileText className="size-4 text-muted-foreground" />
                          <span className="font-body text-sm font-medium text-ink">My applications</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl focus:bg-field/60" render={<Link href="/tenant-dashboard/saved-properties" className="flex w-full items-center gap-2.5 px-3 py-2" />}>
                          <Heart className="size-4 text-muted-foreground" />
                          <span className="font-body text-sm font-medium text-ink">Saved homes</span>
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuItem className="rounded-xl focus:bg-field/60" render={<Link href={getAccountHref(user.role)} className="flex w-full items-center gap-2.5 px-3 py-2" />}>
                      <LayoutDashboard className="size-4 text-muted-foreground" />
                      <span className="font-body text-sm font-medium text-ink">Account settings</span>
                    </DropdownMenuItem>
                  </div>

                  <DropdownMenuSeparator className="bg-line/60" />

                  <div className="p-1">
                    <DropdownMenuItem
                      onClick={async () => {
                        await logout();
                        setUser(null);
                        window.location.href = "/";
                      }}
                      className="rounded-xl text-destructive focus:bg-destructive/10 focus:text-destructive"
                    >
                      <span className="flex w-full items-center gap-2.5 px-3 py-2">
                        <LogOut className="size-4" />
                        <span className="font-body text-sm font-medium">Log out</span>
                      </span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden items-center gap-1 md:flex">
              <Link
                href="/login"
                className="rounded-full px-4 py-2 font-body text-[13.5px] font-medium text-muted-foreground transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Log in
              </Link>
              <Link
                href="/register?role=LANDLORD"
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-ledger px-4 font-body text-[13px] font-semibold text-white shadow-[0_8px_20px_-8px_var(--color-ledger)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-8px_var(--color-ledger)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:translate-y-0"
              >
                <Plus className="size-4" />
                List Your Property
              </Link>
            </div>
          )}

          {/* Mobile trigger */}
          <Sheet open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
            <SheetTrigger
              render={
                <button
                  aria-label="Open navigation menu"
                  className="rounded-xl p-2.5 text-muted-foreground transition-colors hover:bg-field/60 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
                >
                  <Menu className="size-5" />
                </button>
              }
            />
            <SheetContent
              side="left"
              className="flex w-[86vw] max-w-sm flex-col border-r border-line/60 bg-paper p-0"
            >
              <SheetHeader className="flex flex-row items-center justify-between border-b border-line/60 px-5 py-4 text-left">
                <Logo />
                <SheetTitle className="sr-only">Site navigation</SheetTitle>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto px-5 py-6">
                <p className="font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Explore
                </p>
                <nav aria-label="Mobile" className="mt-3">
                  {[
                    ...navLinks.map((l, i) => ({ ...l, index: `0${i + 1}` })),
                    ...(!isUserLoading && user
                      ? [{ name: "Dashboard", href: getDashboardHref(user.role), index: "04" }]
                      : []),
                  ].map((link) => {
                    const active = isActiveLink(link.href) || (link.name === "Dashboard" && onDashboard);
                    return (
                      <Link
                        key={link.href + link.name}
                        href={link.href}
                        onClick={() => setMobileDrawerOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className="group flex items-baseline gap-3 border-b border-line/50 py-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <span className="font-body text-[11px] font-semibold text-muted-foreground">
                          {link.index}
                        </span>
                        <span
                          className={cn(
                            "font-display text-xl font-bold tracking-tight transition-colors",
                            active ? "text-ledger" : "text-ink group-hover:text-ledger"
                          )}
                        >
                          {link.name}
                        </span>
                        <ArrowUpRight className="ml-auto size-4 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ledger" />
                      </Link>
                    );
                  })}
                </nav>

                <p className="mt-8 font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Company
                </p>
                <div className="mt-2 flex flex-col">
                  {[
                    { name: "About Us", href: "/about" },
                    { name: "Contact", href: "/contact" },
                    { name: "FAQ", href: "/faq" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileDrawerOpen(false)}
                      className="rounded-lg py-2.5 font-body text-sm font-medium text-muted-foreground transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border-t border-line/60 bg-field/40 px-5 py-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-body text-[13px] font-medium text-muted-foreground">Appearance</span>
                  <ThemeToggle />
                </div>

                {isUserLoading ? (
                  <div className="h-12 w-full animate-pulse rounded-2xl bg-field" aria-hidden="true" />
                ) : user ? (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3 rounded-2xl border border-line/60 bg-paper px-4 py-3">
                      <span className="flex size-9 items-center justify-center rounded-full bg-ledger/10 font-display text-sm font-bold text-ledger">
                        {displayInitial}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-body text-sm font-semibold text-ink">{displayName}</p>
                        <p className="font-body text-xs capitalize text-muted-foreground">
                          {user.role.toLowerCase()} account
                        </p>
                      </div>
                    </div>
                    <Link
                      href={primaryCta.href}
                      onClick={() => setMobileDrawerOpen(false)}
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-ledger font-body text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px active:translate-y-0"
                    >
                      <primaryCta.icon className="size-4" />
                      {primaryCta.label}
                    </Link>
                    <button
                      onClick={async () => {
                        setMobileDrawerOpen(false);
                        await logout();
                        setUser(null);
                        window.location.href = "/";
                      }}
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-line/70 font-body text-sm font-semibold text-muted-foreground transition-colors hover:text-destructive"
                    >
                      <LogOut className="size-4" />
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2.5">
                    <Link
                      href="/login"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="flex h-12 w-full items-center justify-center rounded-2xl border border-line/70 font-body text-sm font-semibold text-ink transition-colors hover:bg-field/60"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/register?role=LANDLORD"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-ledger font-body text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px active:translate-y-0"
                    >
                      <Plus className="size-4" />
                      List Your Property
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
