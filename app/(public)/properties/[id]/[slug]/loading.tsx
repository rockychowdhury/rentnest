import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyDetailsLoading() {
  return (
    <div className="w-full bg-background min-h-screen pb-20">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Title block — mirrors badges + h1 + address row */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-10 sm:h-12 w-full max-w-2xl" />
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 rounded-full" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>

        {/* Gallery — mirrors PropertyDetailsGallery */}
        <Skeleton className="h-[280px] sm:h-[420px] w-full rounded-xl" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* Stats bar */}
            <div className="flex flex-wrap items-center gap-6 p-6 rounded-2xl border border-border bg-card">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-12" />
              </div>
              <Skeleton className="h-10 w-px hidden sm:block" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-12" />
              </div>
              <Skeleton className="h-10 w-px hidden sm:block" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
            {/* About + amenities + units */}
            <div className="space-y-3">
              <Skeleton className="h-7 w-56" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          </div>
          {/* Sticky request card */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-border/50 bg-card p-5 space-y-4 lg:sticky lg:top-20">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
