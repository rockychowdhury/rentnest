import React, { Suspense } from "react";
import Link from "next/link";
import { getFeaturedProperties } from "@/service/getFeaturedProperties";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/shadcnUtils";

async function FeaturedPropertiesContent() {
  const properties = await getFeaturedProperties();

  if (!properties || properties.length === 0) {
    return (
      <div className="w-full text-center py-16 bg-muted/20 rounded-3xl border border-dashed border-border">
        <h3 className="text-xl font-semibold text-foreground mb-2">New listings added every day</h3>
        <p className="text-muted-foreground mb-6">Be the first to see yours</p>
        <Link 
          href="/register/landlord" 
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 h-9 px-4 py-2"
        >
          List your property
        </Link>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex gap-5 overflow-x-auto pb-8 pt-4 px-1 -mx-1 scrollbar-none snap-x snap-mandatory transform-gpu hide-scrollbar">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} layout="rail" />
        ))}
        
        {/* View All Card */}
        <div className="w-[200px] shrink-0 snap-start flex items-center justify-center">
          <Link 
            href="/properties?sort=newest" 
            className="flex flex-col items-center justify-center gap-4 text-muted-foreground hover:text-primary transition-colors group p-8"
          >
            <div className="size-14 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors">
              <ArrowRight className="size-6 transition-transform group-hover:translate-x-1" />
            </div>
            <span className="font-semibold text-sm uppercase tracking-wider">View All</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function FeaturedPropertiesSkeleton() {
  return (
    <div className="flex overflow-x-hidden gap-5 pb-8 pt-4 px-1 -mx-1">
      {[1, 2, 3, 4].map((i) => (
        <div 
          key={i} 
          className="shrink-0 flex flex-col space-y-3 w-[240px] sm:w-[280px]"
        >
          <Skeleton className="h-[250px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function FeaturedProperties() {
  return (
    <section className="py-20 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground tracking-tight">
            Fresh on RentNest
          </h2>
          <Link 
            href="/properties?sort=newest" 
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            View all <ArrowRight className="size-4" />
          </Link>
        </div>
        
        <Suspense fallback={<FeaturedPropertiesSkeleton />}>
          <FeaturedPropertiesContent />
        </Suspense>
      </div>
    </section>
  );
}
