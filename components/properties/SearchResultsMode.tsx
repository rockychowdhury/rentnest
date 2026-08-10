import React from "react";
import Link from "next/link";
import { SearchX, RotateCcw } from "lucide-react";
import { PropertyCard } from "./PropertyCard";
import { GetPropertiesResponse } from "@/service/getProperties";
import { Button } from "@/components/ui/button";
import { EmptyProperties } from "./EmptyProperties";

import { CustomPagination } from "@/components/shared/pagination";

interface SearchResultsModeProps {
  results: GetPropertiesResponse;
  searchParams: Record<string, string | string[] | undefined>;
}

export function SearchResultsMode({ results, searchParams }: SearchResultsModeProps) {
  const { data, total, page } = results;

  if (total === 0) {
    return <EmptyProperties />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Results Counter */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground">
          Showing <span className="text-foreground font-bold">{total}</span> matching properties
        </h2>
      </div>

      {/* Grid Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.map((property) => (
          <PropertyCard key={property.id} property={property} layout="grid" />
        ))}
      </div>

      {/* Pagination */}
      <CustomPagination meta={{ page: page || 1, limit: 12, total }} />
    </div>
  );
}

export default SearchResultsMode;
