import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyDetailsLoading() {
  return (
    <div className="w-full bg-background min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-12 w-full max-w-2xl" />
          <Skeleton className="h-4 w-64" />
        </div>

        <Skeleton className="h-[420px] w-full rounded-2xl" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-24 w-full rounded-2xl" />
            <div className="space-y-3">
              <Skeleton className="h-8 w-56" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-80 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
