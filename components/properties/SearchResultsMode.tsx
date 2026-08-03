import React from "react";
import Link from "next/link";
import { SearchX, RotateCcw } from "lucide-react";
import { PropertyCard } from "./PropertyCard";
import { GetPropertiesResponse } from "@/service/getProperties";
import { Button } from "@/components/ui/button";

interface SearchResultsModeProps {
  results: GetPropertiesResponse;
  searchParams: Record<string, string | string[] | undefined>;
}

export function SearchResultsMode({ results, searchParams }: SearchResultsModeProps) {
  const { data, total } = results;

  if (total === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <div className="size-16 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
          <SearchX className="size-8" />
        </div>
        <div className="space-y-1 max-w-md mx-auto">
          <h2 className="text-xl font-heading font-bold text-foreground">
            No matching properties found
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We couldn't find any listings matching your active search criteria. Try clearing or relaxing some filters.
          </p>
        </div>
        <div>
          <Link href="/properties">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <RotateCcw className="size-3.5" />
              Clear all filters
            </Button>
          </Link>
        </div>
      </div>
    );
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((property) => (
          <PropertyCard key={property.id} property={property} layout="grid" />
        ))}
      </div>
    </div>
  );
}

export default SearchResultsMode;
