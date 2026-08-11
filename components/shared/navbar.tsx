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
  Home,
  User as UserIcon
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

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b",
        scrolled 
          ? "bg-background/85 backdrop-blur-2xl border-border/60 shadow-sm" 
          : "bg-background/70 backdrop-blur-lg border-border/30"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
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
                  "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors hover:text-foreground hover:bg-muted/60",
                  isActive
                    ? "text-foreground font-semibold bg-muted shadow-sm border border-border/50"
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
            <DropdownMenuTrigger className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors hover:text-foreground hover:bg-muted/60 text-muted-foreground focus:outline-none">
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
                <DropdownMenuTrigger render={<Button variant="ghost" className="gap-2 px-2 py-1 h-9 rounded-full hover:bg-muted/50 border border-transparent hover:border-border/50 transition-all duration-300" />}>
                  <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">
                    {(user.profile?.fullName || "User").charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{user.profile?.fullName || "User"}</span>
                  <ChevronDown className="size-3.5 text-muted-foreground/70 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-1.5 rounded-xl shadow-lg border-border/50 bg-background/95 backdrop-blur-xl">
                  <DropdownMenuLabel className="font-normal px-2.5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-muted flex items-center justify-center text-foreground text-sm font-bold border border-border/50">
                        {(user.profile?.fullName || "User").charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm font-semibold leading-tight text-foreground">{user.profile?.fullName || "User"}</p>
                        <p className="text-xs font-medium text-muted-foreground capitalize mt-0.5">{user.role.toLowerCase()}</p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/40 my-1" />
                  
                  <div className="px-1 py-1 space-y-0.5">
                    <DropdownMenuItem className="rounded-md cursor-pointer hover:bg-muted focus:bg-muted py-2 px-2.5">
                      <Link href={getDashboardHref(user.role)} className="flex items-center w-full group/item">
                        <LayoutDashboard className="size-4 text-muted-foreground mr-2.5 group-hover/item:text-foreground transition-colors" />
                        <span className="font-medium text-sm">Overview</span>
                      </Link>
                    </DropdownMenuItem>

                    {user.role === "LANDLORD" && (
                      <>
                        <DropdownMenuItem className="rounded-md cursor-pointer hover:bg-muted focus:bg-muted py-2 px-2.5">
                          <Link href="/landlord-dashboard/properties" className="flex items-center w-full group/item">
                            <Building className="size-4 text-muted-foreground mr-2.5 group-hover/item:text-foreground transition-colors" />
                            <span className="font-medium text-sm">My Properties</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-md cursor-pointer hover:bg-muted focus:bg-muted py-2 px-2.5">
                          <Link href="/landlord-dashboard/applications" className="flex items-center w-full group/item">
                            <Briefcase className="size-4 text-muted-foreground mr-2.5 group-hover/item:text-foreground transition-colors" />
                            <span className="font-medium text-sm">Applications</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    {user.role === "TENANT" && (
                      <>
                        <DropdownMenuItem className="rounded-md cursor-pointer hover:bg-muted focus:bg-muted py-2 px-2.5">
                          <Link href="/tenant-dashboard/applications" className="flex items-center w-full group/item">
                            <Briefcase className="size-4 text-muted-foreground mr-2.5 group-hover/item:text-foreground transition-colors" />
                            <span className="font-medium text-sm">My Applications</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-md cursor-pointer hover:bg-muted focus:bg-muted py-2 px-2.5">
                          <Link href="/properties?saved=true" className="flex items-center w-full group/item">
                            <Home className="size-4 text-muted-foreground mr-2.5 group-hover/item:text-foreground transition-colors" />
                            <span className="font-medium text-sm">Saved Properties</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                  </div>

                  <DropdownMenuSeparator className="bg-border/40 my-1" />
                  
                  <div className="px-1 py-1 space-y-0.5">
                    <DropdownMenuItem className="rounded-md cursor-pointer hover:bg-muted focus:bg-muted py-2 px-2.5">
                      <Link href="/profile" className="flex items-center w-full group/item">
                        <UserIcon className="mr-2.5 size-4 text-muted-foreground group-hover/item:text-foreground transition-colors" />
                        <span className="font-medium text-sm">Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                      onClick={async () => {
                        await logout();
                        setUser(null);
                        window.location.href = "/";
                      }} 
                      className="rounded-md cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive py-2 px-2.5 mt-0.5"
                    >
                      <LogOut className="mr-2.5 size-4" />
                      <span className="font-medium text-sm">Log out</span>
                    </DropdownMenuItem>
                  </div>
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
                  <div className="space-y-4 w-full">
                    <div className="space-y-2">
                      <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase px-1 pb-1">Dashboard</p>
                      <Link href={getDashboardHref(user.role)} onClick={() => setMobileDrawerOpen(false)} className="w-full">
                        <Button variant="secondary" className="w-full justify-start h-11 font-medium bg-muted/60">
                          <LayoutDashboard className="mr-3 size-4 text-primary" />
                          Overview
                        </Button>
                      </Link>
                      
                      {user.role === "LANDLORD" && (
                        <Link href="/landlord-dashboard/properties" onClick={() => setMobileDrawerOpen(false)} className="w-full">
                          <Button variant="secondary" className="w-full justify-start h-11 font-medium bg-muted/60">
                            <Building className="mr-3 size-4 text-blue-500" />
                            My Properties
                          </Button>
                        </Link>
                      )}
                      
                      {user.role === "TENANT" && (
                        <Link href="/tenant-dashboard/applications" onClick={() => setMobileDrawerOpen(false)} className="w-full">
                          <Button variant="secondary" className="w-full justify-start h-11 font-medium bg-muted/60">
                            <Briefcase className="mr-3 size-4 text-blue-500" />
                            My Applications
                          </Button>
                        </Link>
                      )}
                    </div>

                    <Button 
                      variant="destructive" 
                      className="w-full h-11 text-sm font-semibold flex items-center justify-center gap-2 group transition-all"
                      onClick={async () => {
                        setMobileDrawerOpen(false);
                        await logout();
                        setUser(null);
                        window.location.href = "/";
                      }}
                    >
                      <LogOut className="size-4 transition-transform group-hover:-translate-x-1" />
                      Log Out
                    </Button>
                  </div>
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
