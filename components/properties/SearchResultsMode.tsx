"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { PropertyCard } from "./PropertyCard";
import { GetPropertiesResponse, PropertyItem } from "@/service/getProperties";
import { EmptyProperties } from "./EmptyProperties";
import { fetchMoreProperties } from "@/app/(public)/properties/_actions/fetchMoreProperties";
import { Loader2 } from "lucide-react";

interface SearchResultsModeProps {
  results: GetPropertiesResponse;
  searchParams: Record<string, string | string[] | undefined>;
}

export function SearchResultsMode({ results, searchParams }: SearchResultsModeProps) {
  const [items, setItems] = useState<PropertyItem[]>(results.data);
  const [page, setPage] = useState(results.page);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const hasMore = items.length < results.total;
  const observerTarget = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    const nextPage = page + 1;
    
    try {
      const response = await fetchMoreProperties({
        searchTerm: searchParams.searchTerm as string,
        areaId: searchParams.areaId as string,
        districtId: searchParams.districtId as string,
        categoryId: searchParams.categoryId as string,
        minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
        maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
        bedrooms: searchParams.bedrooms ? Number(searchParams.bedrooms) : undefined,
        bathrooms: searchParams.bathrooms ? Number(searchParams.bathrooms) : undefined,
        isFeatured: searchParams.isFeatured === "true" ? true : undefined,
        amenities: searchParams.amenities ? (searchParams.amenities as string).split(",") : undefined,
        sortBy: searchParams.sortBy as string,
        sortOrder: searchParams.sortOrder as string,
        timeFilter: searchParams.timeFilter as string,
        quickAvailable: searchParams.quickAvailable === "true" ? true : undefined,
        flexibleRent: searchParams.flexibleRent === "true" ? true : undefined,
        rentType: searchParams.rentType as string,
        limit: 20,
        page: nextPage,
      });

      if (response.data && response.data.length > 0) {
        setItems(prev => [...prev, ...response.data]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Failed to load more properties:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, page, searchParams]);

  // Use a ref to keep track of the latest loadMore function without triggering effect rebuilds
  const loadMoreRef = useRef(loadMore);
  useEffect(() => {
    loadMoreRef.current = loadMore;
  }, [loadMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMoreRef.current();
        }
      },
      { threshold: 0.1, rootMargin: "200px" } // Load slightly before reaching the bottom
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []); // Empty dependency array ensures observer is created ONLY once on mount

  if (results.total === 0) {
    return <EmptyProperties />;
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">


      {/* Grid Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((property) => (
          <PropertyCard key={property.id} property={property} layout="grid" />
        ))}
      </div>

      {/* Infinite Scroll Sentinel */}
      {hasMore && (
        <div ref={observerTarget} className="flex justify-center py-8 w-full">
          {isLoadingMore && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
        </div>
      )}
    </div>
  );
}

export default SearchResultsMode;
