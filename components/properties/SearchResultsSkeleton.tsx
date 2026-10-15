import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PropertyCardSkeleton } from "./PropertyCardSkeleton";

export function SearchResultsSkeleton() {
  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-5 w-24 hidden sm:block" />
      </div>

      {/* Matches SearchResultsMode: grid 1/2/4 cols, grid-layout cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <PropertyCardSkeleton key={i} layout="grid" />
        ))}
      </div>
    </div>
  );
}
