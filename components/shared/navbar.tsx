"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogOut,
  Settings,
  LayoutDashboard,
  Building,
  Menu,
  X,
  ChevronDown,
  Info,
  Phone,
  HelpCircle,
  Briefcase,
  Home
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils/shadcnUtils";
import { Button } from "@/components/ui/button";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
    { name: "For Landlords", href: "/for-landlords", icon: Briefcase },
    { name: "How It Works", href: "/how-it-works", icon: HelpCircle },
  ];

  if (user) {
    navLinks.push({ name: "Dashboard", href: getDashboardHref(user.role), icon: LayoutDashboard });
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200 backdrop-blur-xl bg-background/80 border-b border-border/40",
        scrolled ? "shadow-sm border-border bg-background/95" : ""
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/properties" && pathname.includes("dashboard") && link.name === "Dashboard");
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors hover:text-primary hover:bg-muted/50",
                  isActive
                    ? "text-primary font-semibold bg-primary/10"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="size-4" />
                {link.name}
              </Link>
            );
          })}
          
          {/* Company Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors hover:text-primary hover:bg-muted/50 text-muted-foreground focus:outline-none">
              <Info className="size-4" />
              Company
              <ChevronDown className="size-3.5 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem render={<Link href="/about" />}>
                About Us
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/contact" />}>
                Contact
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/faq" />}>
                FAQ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Right Cluster - Mobile & Desktop */}
        <div className="flex items-center gap-2.5">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          {isUserLoading ? (
            <div className="hidden md:flex items-center gap-2" aria-hidden="true">
              <div className="h-8 w-16 animate-pulse rounded-md bg-muted" />
              <div className="h-8 w-28 animate-pulse rounded-md bg-muted" />
            </div>
          ) : user ? (
            /* Logged In User Controls (Desktop) */
            <div className="hidden md:flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="outline" className="gap-2 px-3 pl-2 shadow-xs rounded-full" />}>
                  <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                    {(user.profile?.fullName || "User").charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{user.profile?.fullName || "User"}</span>
                  <ChevronDown className="size-3.5 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.profile?.fullName || "User"}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.role}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem render={<Link href={getDashboardHref(user.role)} />} className="cursor-pointer">
                    <LayoutDashboard className="mr-2 size-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/settings" />} className="cursor-pointer">
                    <Settings className="mr-2 size-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={async () => await logout()} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                    <LogOut className="mr-2 size-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            /* Logged Out Desktop CTA Cluster */
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Log in
              </Link>
              <Link href="/register/landlord">
                <Button size="sm" className="font-semibold shadow-xs">
                  <Building className="mr-1.5 size-4" />
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
            <SheetContent side="left" className="w-[85vw] max-w-sm p-0 flex flex-col bg-card border-r border-border shadow-2xl">
              <SheetHeader className="p-4 border-b border-border flex items-center justify-between text-left">
                <Logo />
                <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div className="space-y-1.5">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href || (link.href !== "/properties" && pathname.includes("dashboard") && link.name === "Dashboard");
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

                  <Accordion className="w-full">
                    <AccordionItem value="company" className="border-none">
                      <AccordionTrigger className="px-4 py-3 rounded-xl hover:bg-muted hover:no-underline font-semibold text-base">
                        <div className="flex items-center gap-3 text-foreground">
                          <Info className="size-5 text-primary" />
                          Company
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-0 pl-12 space-y-2 pt-1">
                        <Link href="/about" onClick={() => setMobileDrawerOpen(false)} className="block py-2 text-muted-foreground hover:text-foreground font-medium">About Us</Link>
                        <Link href="/contact" onClick={() => setMobileDrawerOpen(false)} className="block py-2 text-muted-foreground hover:text-foreground font-medium">Contact</Link>
                        <Link href="/faq" onClick={() => setMobileDrawerOpen(false)} className="block py-2 text-muted-foreground hover:text-foreground font-medium">FAQ</Link>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>

              <div className="p-4 border-t border-border bg-muted/30">
                <div className="flex items-center justify-between mb-4 px-1">
                  <span className="text-sm font-medium">Theme</span>
                  <ThemeToggle />
                </div>
                
                {isUserLoading ? (
                  <div className="grid grid-cols-1 gap-3 pt-2" aria-hidden="true">
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
                  <div className="grid grid-cols-1 gap-3">
                    <Link href="/login" onClick={() => setMobileDrawerOpen(false)} className="w-full">
                      <Button variant="outline" className="w-full h-11 text-sm font-semibold">Log in</Button>
                    </Link>
                    <Link href="/register/landlord" onClick={() => setMobileDrawerOpen(false)} className="w-full">
                      <Button className="w-full h-11 text-sm font-semibold shadow-md">
                        <Building className="mr-2 size-4" />
                        List Your Property
                      </Button>
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
