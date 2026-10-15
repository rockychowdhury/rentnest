import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Lightweight navigation fallback: pages stream their own shell + granular
// Suspense zones, so this only flashes until first bytes arrive. It renders a
// quiet page-shell shape (header + blocks) — never a full dashboard replica,
// and never touches the sidebar layout.
export default function DashboardLoading() {
  return (
    <div className="space-y-8" aria-hidden="true">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="h-9 w-36 rounded-full" />
      </div>
      <Skeleton className="h-24 w-full rounded-xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
