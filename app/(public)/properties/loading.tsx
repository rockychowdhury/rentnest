import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PropertiesLoadingSkeleton } from "@/components/properties/PropertiesLoadingSkeleton";

export default function PropertiesLoading() {
  return (
    <div className="w-full min-h-screen bg-background flex flex-col">
      {/* Filter bar placeholder — mirrors PropertyFilterBar height */}
      <div className="border-b border-border/60 bg-card">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <Skeleton className="h-10 flex-1 rounded-full" />
          <Skeleton className="h-10 w-24 rounded-full hidden sm:block" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
      <PropertiesLoadingSkeleton />
    </div>
  );
}
