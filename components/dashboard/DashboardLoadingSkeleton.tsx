import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Mirrors tenant/landlord/admin overview layout:
 * header row + 4-col StatCard grid + charts row + activity feed.
 * Uses subtle pulse (no flashy spinners) to avoid eye-catching shift.
 */
export function DashboardLoadingSkeleton() {
  return (
    <div className="space-y-8" aria-hidden="true">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-36 rounded-full" />
        </div>
      </div>

      {/* Lease/overview banner */}
      <Skeleton className="h-28 w-full rounded-xl" />

      {/* 4-col StatCard grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border border-border/50 bg-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="size-8 rounded-lg" />
            </div>
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 rounded-xl border border-border/50 bg-card p-5 space-y-4">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-56 w-full rounded-lg" />
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-5 space-y-3">
          <Skeleton className="h-5 w-32" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="size-8 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardLoadingSkeleton;
