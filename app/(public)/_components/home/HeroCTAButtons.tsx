"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Building, Heart, Plus } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";

export function HeroCTAButtons() {
  const { role, loading } = useUserRole();

  if (loading) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-4 animate-pulse">
        <div className="h-12 w-48 bg-white/20 rounded-full" />
        <div className="h-12 w-48 bg-white/10 rounded-full" />
      </div>
    );
  }

  // Tenant State
  if (role === "TENANT") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link href="/properties">
          <Button size="lg" className="rounded-full shadow-lg shadow-primary/25 group">
            Browse All Properties
            <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
        <Link href="/tenant-dashboard/saved-properties">
          <Button size="lg" variant="outline" className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white backdrop-blur-md">
            <Heart className="mr-2 size-4" />
            My Saved Homes
          </Button>
        </Link>
      </div>
    );
  }

  // Landlord State
  if (role === "LANDLORD") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link href="/landlord-dashboard/properties/new">
          <Button size="lg" className="rounded-full shadow-lg shadow-primary/25 group">
            <Plus className="mr-2 size-4" />
            List a Property
          </Button>
        </Link>
        <Link href="/landlord-dashboard/properties">
          <Button size="lg" variant="outline" className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white backdrop-blur-md">
            <Building className="mr-2 size-4" />
            Manage Listings
          </Button>
        </Link>
      </div>
    );
  }

  // Admin State (or any other)
  if (role === "ADMIN") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link href="/admin-dashboard">
          <Button size="lg" className="rounded-full shadow-lg shadow-primary/25 group">
            Admin Dashboard
            <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    );
  }

  // Unauthenticated (Guest) State
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Link href="/properties">
        <Button size="lg" className="rounded-full shadow-lg shadow-primary/25 group">
          Explore Properties
          <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </Link>
      <Link href="/register?role=LANDLORD">
        <Button size="lg" variant="outline" className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white backdrop-blur-md">
          <Building className="mr-2 size-4" />
          List Your Property
        </Button>
      </Link>
    </div>
  );
}
