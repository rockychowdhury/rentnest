import React, { Suspense } from "react";
import { getProperties } from "@/service/getProperties";
import { getPublicCategories } from "@/service/getCategories";
import { getPublicAmenities } from "@/service/getAmenities";
import { PropertyFilterBar } from "@/components/properties/PropertyFilterBar";
import { DiscoveryMode } from "@/components/properties/DiscoveryMode";
import { SearchResultsMode } from "@/components/properties/SearchResultsMode";
import { PropertiesLoadingSkeleton } from "@/components/properties/PropertiesLoadingSkeleton";

interface PropertiesPageProps {
  searchParams: Promise<{
    searchTerm?: string;
    location?: string;
    division?: string;
    district?: string;
    upazila?: string;
    categoryId?: string;
    minPrice?: string;
    maxPrice?: string;
    amenities?: string;
    bedrooms?: string;
    bathrooms?: string;
    availableNow?: string;
    isFeatured?: string;
    sort?: "newest" | "oldest" | "price_asc" | "price_desc";
    page?: string;
    limit?: string;
  }>;
}

async function AsyncSearchResults({ resolvedParams }: { resolvedParams: any }) {
  const searchResults = await getProperties({
    searchTerm: resolvedParams.searchTerm,
    location: resolvedParams.location,
    division: resolvedParams.division,
    district: resolvedParams.district,
    upazila: resolvedParams.upazila,
    categoryId: resolvedParams.categoryId,
    minPrice: resolvedParams.minPrice ? Number(resolvedParams.minPrice) : undefined,
    maxPrice: resolvedParams.maxPrice ? Number(resolvedParams.maxPrice) : undefined,
    bedrooms: resolvedParams.bedrooms ? Number(resolvedParams.bedrooms) : undefined,
    bathrooms: resolvedParams.bathrooms ? Number(resolvedParams.bathrooms) : undefined,
    availableNow: resolvedParams.availableNow === "true" ? true : undefined,
    isFeatured: resolvedParams.isFeatured === "true" ? true : undefined,
    amenities: resolvedParams.amenities ? resolvedParams.amenities.split(",") : undefined,
    sort: resolvedParams.sort,
    page: resolvedParams.page ? Number(resolvedParams.page) : 1,
    limit: resolvedParams.limit ? Number(resolvedParams.limit) : 12,
  });

  return <SearchResultsMode results={searchResults} searchParams={resolvedParams} />;
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const [resolvedParams, categories, amenities] = await Promise.all([
    searchParams,
    getPublicCategories(),
    getPublicAmenities(),
  ]);

  const filterKeys = Object.keys(resolvedParams).filter((k) => {
    if (k === "page" || k === "limit") return false;
    if (k === "sort" && resolvedParams[k as keyof typeof resolvedParams] === "newest") return false;
    return true;
  });
  const isSearchMode = filterKeys.length > 0;

  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col">
            <PropertyFilterBar categories={categories} amenities={amenities} />

            <main className="flex-1">
        <Suspense key={JSON.stringify(resolvedParams)} fallback={<PropertiesLoadingSkeleton />}>
          {isSearchMode ? (
            <AsyncSearchResults resolvedParams={resolvedParams} />
          ) : (
            <DiscoveryMode />
          )}
        </Suspense>
      </main>
    </div>
  );
}
