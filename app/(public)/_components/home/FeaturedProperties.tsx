import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { getFeaturedProperties } from "@/service/getFeaturedProperties";

export async function FeaturedProperties() {
  const properties = await getFeaturedProperties();

  if (!properties || properties.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-background border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Curated Selection
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mt-1">
              Fresh on RentNest
            </h2>
          </div>
          <Link
            href="/properties?isFeatured=true"
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 group"
          >
            View all featured listings
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Carousel / Scroll Container */}
        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory transform-gpu">
          {properties.map((item) => (
            <PropertyCard key={item.id} property={item} layout="rail" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProperties;
