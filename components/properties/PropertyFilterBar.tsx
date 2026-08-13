"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  X,
  Building,
  RotateCcw,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { getPublicCategories, CategoryItem } from "@/service/getCategories";
import { getPublicAmenities, AmenityItem } from "@/service/getAmenities";
import { cn } from "@/lib/utils/shadcnUtils";
import { toast } from "sonner";
import { AreaSearchCombobox } from "./AreaSearchCombobox";

interface PropertyFilterBarProps {
  categories?: CategoryItem[];
  amenities?: AmenityItem[];
}

export function PropertyFilterBar({ categories: initialCategories, amenities: initialAmenities }: PropertyFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>(initialCategories || []);
  const [amenitiesList, setAmenitiesList] = useState<AmenityItem[]>(initialAmenities || []);

  // Fetch Categories & Amenities dynamically if not provided as props
  useEffect(() => {
    if (!initialCategories || initialCategories.length === 0) {
      getPublicCategories().then(setCategoriesList);
    }
    if (!initialAmenities || initialAmenities.length === 0) {
      getPublicAmenities().then(setAmenitiesList);
    }
  }, [initialCategories, initialAmenities]);

  // Local Input States
  const [searchTerm, setSearchTerm] = useState(searchParams.get("searchTerm") || "");
  const [areaId, setAreaId] = useState(searchParams.get("areaId") || "");
  const [areaName, setAreaName] = useState(searchParams.get("areaName") || "");
  const [category, setCategory] = useState(searchParams.get("categoryId") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "");
  const [bathrooms, setBathrooms] = useState(searchParams.get("bathrooms") || "");

  const [isFeatured, setIsFeatured] = useState(searchParams.get("isFeatured") === "true");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    searchParams.get("amenities") ? searchParams.get("amenities")!.split(",") : []
  );

  // Debounced inputs for price & search
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 400);
  const debouncedMinPrice = useDebouncedValue(minPrice, 400);
  const debouncedMaxPrice = useDebouncedValue(maxPrice, 400);

  const [geoLocating, setGeoLocating] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Sync controls with URL searchParams change
  useEffect(() => {
    setSearchTerm(searchParams.get("searchTerm") || "");
    setAreaId(searchParams.get("areaId") || "");
    setAreaName(searchParams.get("areaName") || "");
    setCategory(searchParams.get("categoryId") || "");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setBedrooms(searchParams.get("bedrooms") || "");
    setBathrooms(searchParams.get("bathrooms") || "");

    setIsFeatured(searchParams.get("isFeatured") === "true");
    setSort(searchParams.get("sort") || "newest");
    setSelectedAmenities(
      searchParams.get("amenities") ? searchParams.get("amenities")!.split(",") : []
    );
  }, [searchParams]);

  // Update URL helper
  const updateURL = (overrides: Record<string, string | string[] | boolean | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    const nextState = {
      searchTerm: debouncedSearchTerm,
      areaId,
      areaName,
      categoryId: category,
      minPrice: debouncedMinPrice,
      maxPrice: debouncedMaxPrice,
      bedrooms,

      isFeatured,
      sort,
      amenities: selectedAmenities,
      ...overrides,
    };

    Object.entries(nextState).forEach(([key, val]) => {
      if (val === undefined || val === "" || val === false || (Array.isArray(val) && val.length === 0)) {
        params.delete(key);
      } else if (Array.isArray(val)) {
        params.set(key, val.join(","));
      } else {
        params.set(key, String(val));
      }
    });

    startTransition(() => {
      const queryString = params.toString();
      router.replace(queryString ? `/properties?${queryString}` : "/properties", { scroll: false });
    });
  };

  // Trigger URL update on debounced input change only when user types/changes inputs
  useEffect(() => {
    const currentSearch = searchParams.get("searchTerm") || "";
    const currentMin = searchParams.get("minPrice") || "";
    const currentMax = searchParams.get("maxPrice") || "";

    // Prevent loop in strict mode by verifying value actually changed
    if (
      debouncedSearchTerm === currentSearch &&
      debouncedMinPrice === currentMin &&
      debouncedMaxPrice === currentMax
    ) {
      return;
    }

    updateURL({});
  }, [debouncedSearchTerm, debouncedMinPrice, debouncedMaxPrice]);

  const handleClearAll = () => {
    setSearchTerm("");
    setAreaId("");
    setAreaName("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setBedrooms("");
    setBathrooms("");

    setIsFeatured(false);
    setSort("newest");
    setSelectedAmenities([]);

    startTransition(() => {
      router.replace("/properties", { scroll: false });
    });
  };



  const toggleAmenity = (amenityId: string) => {
    const next = selectedAmenities.includes(amenityId)
      ? selectedAmenities.filter((a) => a !== amenityId)
      : [...selectedAmenities, amenityId];
    setSelectedAmenities(next);
    updateURL({ amenities: next });
  };

  const hasActiveFilters = Array.from(searchParams.keys()).some(
    (k) => k !== "page" && k !== "limit"
  );

  return (
    <div className="w-full bg-card border-b border-border shadow-xs sticky top-14 z-30">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
        {/* Main Search Controls */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Free-text Search Input */}
          <div className="relative flex-1 min-w-[150px] max-w-sm">
            {isPending ? (
              <Loader2 className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-primary animate-spin" />
            ) : (
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            )}
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search keyword..."
              className="pl-8 h-9 text-xs bg-muted/20 border-border shadow-sm rounded-md transition-colors focus-visible:bg-background"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  updateURL({ searchTerm: "" });
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            )}
          </div>

          {/* Location Combobox */}
          <div className="w-[180px] sm:w-[220px] shrink-0">
            <AreaSearchCombobox
              value={areaId}
              defaultAreaName={areaName}
              onChange={(id, name) => {
                setAreaId(id);
                setAreaName(name);
                updateURL({ areaId: id, areaName: name });
              }}
              className="h-9"
            />
          </div>

          {/* Category Select (Desktop) */}
          <div className="hidden lg:block w-44 shrink-0">
            <Select
              value={category || "ALL"}
              onValueChange={(val) => {
                const next = !val || val === "ALL" ? "" : val;
                setCategory(next);
                updateURL({ categoryId: next });
              }}
            >
              <SelectTrigger className="h-10 text-xs">
                <Building className="size-3.5 mr-1.5 text-muted-foreground shrink-0" />
                <SelectValue placeholder="All Categories">
                  {categoriesList.find((c) => c.id === category || c.slug === category)?.name || (!category || category === "ALL" ? "All Categories" : category)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Categories</SelectItem>
                {categoriesList.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort Select */}
          <div className="w-36 sm:w-44 shrink-0">
            <Select
              value={sort || "newest"}
              onValueChange={(val) => {
                const next = !val ? "newest" : val;
                setSort(next);
                updateURL({ sort: next });
              }}
            >
              <SelectTrigger className="h-10 text-xs">
                <SelectValue placeholder="Sort by">
                  {sort === "oldest"
                    ? "Oldest First"
                    : sort === "price_asc"
                    ? "Price: Low to High"
                    : sort === "price_desc"
                    ? "Price: High to Low"
                    : "Newest First"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mobile & Drawer Filter Trigger Button */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger
              render={
                <Button variant="outline" size="sm" className="h-9 px-3 text-xs gap-1.5 shrink-0 relative shadow-sm" />
              }
            >
              <SlidersHorizontal className="size-3.5 text-primary" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="size-2 rounded-full bg-primary absolute top-2 right-2" />
              )}
            </SheetTrigger>

            {/* Full-Height Drawer Sheet */}
            <SheetContent side="right" className="w-[90vw] sm:max-w-md p-0 flex flex-col">
              <SheetHeader className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0">
                <SheetTitle className="text-base font-heading font-bold">
                  Filter Properties
                </SheetTitle>
              </SheetHeader>

              {/* Filter Sheet Body */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                {/* Location Combobox (Mobile Drawer) */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground">Location</label>
                  <AreaSearchCombobox
                    value={areaId}
                    defaultAreaName={areaName}
                    onChange={(id, name) => {
                      setAreaId(id);
                      setAreaName(name);
                      updateURL({ areaId: id, areaName: name });
                    }}
                    className="w-full h-10"
                  />
                </div>

                {/* Category Select */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground">Property Category</label>
                  <Select
                    value={category || "ALL"}
                    onValueChange={(val) => {
                      const next = !val || val === "ALL" ? "" : val;
                      setCategory(next);
                      updateURL({ categoryId: next });
                    }}
                  >
                    <SelectTrigger className="w-full h-10 text-xs">
                      <SelectValue placeholder="All Categories">
                        {categoriesList.find((c) => c.id === category || c.slug === category)?.name || (!category || category === "ALL" ? "All Categories" : category)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Categories</SelectItem>
                      {categoriesList.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground">Rent Price Range (৳)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Min ৳"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="h-9 text-xs"
                    />
                    <Input
                      type="number"
                      placeholder="Max ৳"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                {/* Bedrooms & Bathrooms */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground">Bedrooms</label>
                    <Select
                      value={bedrooms || "ALL"}
                      onValueChange={(val) => {
                        const next = !val || val === "ALL" ? "" : val;
                        setBedrooms(next);
                        updateURL({ bedrooms: next });
                      }}
                    >
                      <SelectTrigger className="w-full h-9 text-xs">
                        <SelectValue placeholder="Any">
                          {bedrooms && bedrooms !== "ALL" ? `${bedrooms}+ Beds` : "Any Beds"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">Any Beds</SelectItem>
                        <SelectItem value="1">1+ Bed</SelectItem>
                        <SelectItem value="2">2+ Beds</SelectItem>
                        <SelectItem value="3">3+ Beds</SelectItem>
                        <SelectItem value="4">4+ Beds</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground">Bathrooms</label>
                    <Select
                      value={bathrooms || "ALL"}
                      onValueChange={(val) => {
                        const next = !val || val === "ALL" ? "" : val;
                        setBathrooms(next);
                        updateURL({ bathrooms: next });
                      }}
                    >
                      <SelectTrigger className="w-full h-9 text-xs">
                        <SelectValue placeholder="Any">
                          {bathrooms && bathrooms !== "ALL" ? `${bathrooms}+ Baths` : "Any Baths"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">Any Baths</SelectItem>
                        <SelectItem value="1">1+ Bath</SelectItem>
                        <SelectItem value="2">2+ Baths</SelectItem>
                        <SelectItem value="3">3+ Baths</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Amenities Multi-Select */}
                {amenitiesList.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground">Amenities</label>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                      {amenitiesList.map((a) => {
                        const active = selectedAmenities.includes(a.id);
                        return (
                          <button
                            key={a.id}
                            type="button"
                            onClick={() => toggleAmenity(a.id)}
                            className={cn(
                              "flex items-center justify-between p-2.5 rounded-lg border text-xs font-medium transition-colors text-left",
                              active
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-card hover:bg-muted"
                            )}
                          >
                            <span className="truncate">{a.name}</span>
                            {active && <Check className="size-3 text-primary shrink-0 ml-1" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Toggles */}
                <div className="space-y-3 pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">Featured Properties Only</span>
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => {
                        const next = e.target.checked;
                        setIsFeatured(next);
                        updateURL({ isFeatured: next });
                      }}
                      className="size-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Sheet Footer */}
              <div className="p-6 border-t border-border flex items-center gap-2 bg-background shrink-0 mt-auto">
                <Button variant="outline" className="flex-1 text-xs" onClick={handleClearAll}>
                  Clear All
                </Button>
                <Button className="flex-1 text-xs font-semibold" onClick={() => setSheetOpen(false)}>
                  Show Results
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Clear All CTA */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="h-9 text-xs text-muted-foreground hover:text-destructive gap-1 shrink-0"
            >
              <RotateCcw className="size-3.5" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PropertyFilterBar;
