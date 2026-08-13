"use client";

import React, { useEffect, useState } from "react";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { useSavedProperties } from "@/hooks/useSavedProperties";
import { HeartCrack, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SavedPropertiesClient() {
  const { savedProperties } = useSavedProperties();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-heading font-bold text-foreground tracking-tight">
          Saved Properties
        </h1>
        <p className="text-muted-foreground">
          Properties you have saved for later consideration.
        </p>
      </div>

      {savedProperties.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[400px] border border-dashed rounded-xl border-border bg-card/50 text-center px-4">
          <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <HeartCrack className="size-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">No Saved Properties</h2>
          <p className="text-muted-foreground max-w-sm mb-6">
            You haven&apos;t saved any properties yet. Browse our listings and click the heart icon to save them here.
          </p>
          <Link href="/properties">
            <Button>Browse Properties</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {savedProperties.map((property) => (
            <PropertyCard key={property.id} property={property} layout="grid" />
          ))}
        </div>
      )}
    </div>
  );
}
