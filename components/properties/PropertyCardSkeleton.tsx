import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/shadcnUtils";

interface PropertyCardSkeletonProps {
  layout?: "grid" | "rail";
  className?: string;
}

/**
 * Mirrors PropertyCard DOM exactly (same widths, aspect, padding, footer)
 * so loading -> loaded has zero layout shift.
 */
export function PropertyCardSkeleton({ layout = "grid", className }: PropertyCardSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex flex-col rounded-xl border border-border/50 bg-card overflow-hidden",
        layout === "rail" ? "w-[240px] sm:w-[280px] shrink-0" : "w-full h-full",
        className
      )}
    >
      <Skeleton className="w-full aspect-[16/10] rounded-none" />
      <div className="flex flex-col flex-1 p-3 sm:p-4">
        <div className="mb-3 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <div className="flex items-center gap-1.5">
            <Skeleton className="size-3 rounded-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <div className="flex items-center gap-1.5 mb-4 mt-auto">
          <Skeleton className="h-5 w-14 rounded" />
          <Skeleton className="h-5 w-14 rounded" />
          <Skeleton className="h-5 w-16 rounded" />
        </div>
        <div className="pt-3 flex items-center justify-between border-t border-border/40">
          <div className="space-y-1.5">
            <Skeleton className="h-2 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="size-7 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default PropertyCardSkeleton;
