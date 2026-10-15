import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PropertyCardSkeleton } from "./PropertyCardSkeleton";

function RailSkeleton({ titleWidth = "w-64" }: { titleWidth?: string }) {
  return (
    <section className="space-y-4" aria-hidden="true">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div className="space-y-2">
          <Skeleton className={`h-7 w-64 max-w-full ${titleWidth}`} />
          <Skeleton className="h-3 w-96 max-w-full" />
        </div>
        <Skeleton className="h-4 w-20" />
      </div>
      {/* Matches PropertyRail: horizontal snap scroll, fixed-width rail cards */}
      <div className="flex gap-5 overflow-hidden pb-4">
        {[1, 2, 3, 4].map((i) => (
          <PropertyCardSkeleton key={i} layout="rail" />
        ))}
      </div>
    </section>
  );
}

export function PropertiesLoadingSkeleton() {
  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14 w-full">
      <RailSkeleton />
      <RailSkeleton titleWidth="w-56" />
    </div>
  );
}
