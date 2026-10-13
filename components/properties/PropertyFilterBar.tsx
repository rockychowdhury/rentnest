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
  ChevronsUpDown,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
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
  const [timeFilter, setTimeFilter] = useState(searchParams.get("timeFilter") || "");
  const [quickAvailable, setQuickAvailable] = useState(searchParams.get("quickAvailable") === "true");
  const [flexibleRent, setFlexibleRent] = useState(searchParams.get("flexibleRent") === "true");
  const [rentType, setRentType] = useState(searchParams.get("rentType") || "");

  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "createdAt");
  const [sortOrder, setSortOrder] = useState(searchParams.get("sortOrder") || "desc");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    searchParams.get("amenities") ? searchParams.get("amenities")!.split(",") : []
  );

  // Debounced inputs for price & search
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);
  const debouncedMinPrice = useDebouncedValue(minPrice, 500);
  const debouncedMaxPrice = useDebouncedValue(maxPrice, 500);

  const [categoryOpen, setCategoryOpen] = useState(false);
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
    setTimeFilter(searchParams.get("timeFilter") || "");
    setQuickAvailable(searchParams.get("quickAvailable") === "true");
    setFlexibleRent(searchParams.get("flexibleRent") === "true");
    setRentType(searchParams.get("rentType") || "");

    setSortBy(searchParams.get("sortBy") || "createdAt");
    setSortOrder(searchParams.get("sortOrder") || "desc");
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
      bathrooms,

      isFeatured,
      timeFilter,
      quickAvailable,
      flexibleRent,
      rentType,
      sortBy,
      sortOrder,
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
    setTimeFilter("");
    setQuickAvailable(false);
    setFlexibleRent(false);
    setRentType("");
    
    setSortBy("createdAt");
    setSortOrder("desc");
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
        <div className="flex items-center gap-3 w-full">
          {/* Free-text Search Input (Left side) */}
          <div className="relative flex-1">
            {isPending ? (
              <Loader2 className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-primary animate-spin" />
            ) : (
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            )}
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by keyword, property name, or description..."
              className="pl-8 h-9 text-xs bg-muted/20 border-border shadow-sm rounded-full transition-colors focus-visible:bg-background w-full max-w-xl"
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
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Category Combobox (Desktop) */}
            <div className="hidden lg:block w-48 shrink-0">
              <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                <PopoverTrigger
                  render={
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={categoryOpen}
                      className="w-full justify-between h-9 text-xs font-normal rounded-xl border-border shadow-sm px-3"
                    />
                  }
                >
                  <div className="flex items-center gap-2 truncate">
                    <Building className="size-3.5 shrink-0 opacity-50" />
                    <span className="truncate">
                      {category && category !== "ALL"
                        ? categoriesList.find((c) => c.id === category || c.slug === category)?.name || category
                        : "All Categories"}
                    </span>
                  </div>
                  <ChevronDown className="ml-2 size-3.5 shrink-0 opacity-50" />
                </PopoverTrigger>
                <PopoverContent className="w-[250px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search category..." className="h-10 text-sm" />
                    <CommandList>
                      <CommandEmpty className="text-sm py-4 text-center">No category found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="ALL"
                          onSelect={() => {
                            setCategory("");
                            updateURL({ categoryId: "" });
                            setCategoryOpen(false);
                          }}
                          className="text-sm py-2"
                        >
                          <Check
                            className={cn(
                              "mr-2 size-4 shrink-0 text-primary",
                              !category || category === "ALL" ? "opacity-100" : "opacity-0"
                            )}
                          />
                          All Categories
                        </CommandItem>
                        {categoriesList.map((cat) => {
                          const isSelected = category === cat.id;
                          return (
                            <CommandItem
                              key={cat.id}
                              value={cat.name} // Used for filtering internally by Command
                              onSelect={() => {
                                setCategory(cat.id);
                                updateURL({ categoryId: cat.id });
                                setCategoryOpen(false);
                              }}
                              className="text-sm py-2"
                            >
                              <Check
                                className={cn(
                                  "mr-2 size-4 shrink-0 text-primary",
                                  isSelected ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {cat.name}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Sort Select */}
            <div className="hidden sm:block w-44 shrink-0">
              <Select
                value={`${sortBy}_${sortOrder}`}
                onValueChange={(val) => {
                  let nextSortBy = "createdAt";
                  let nextSortOrder = "desc";
                  
                  if (val === "createdAt_asc") {
                    nextSortOrder = "asc";
                  } else if (val === "rentAmount_asc") {
                    nextSortBy = "rentAmount";
                    nextSortOrder = "asc";
                  } else if (val === "rentAmount_desc") {
                    nextSortBy = "rentAmount";
                    nextSortOrder = "desc";
                  } else if (val === "popular_desc") {
                    nextSortBy = "popular";
                    nextSortOrder = "desc";
                  }
                  
                  setSortBy(nextSortBy);
                  setSortOrder(nextSortOrder);
                  updateURL({ sortBy: nextSortBy, sortOrder: nextSortOrder });
                }}
              >
                <SelectTrigger className="h-9 text-xs rounded-xl px-3">
                  <SelectValue placeholder="Sort by">
                    {sortBy === "createdAt" && sortOrder === "asc"
                      ? "Oldest First"
                      : sortBy === "rentAmount" && sortOrder === "asc"
                      ? "Price: Low to High"
                      : sortBy === "rentAmount" && sortOrder === "desc"
                      ? "Price: High to Low"
                      : sortBy === "popular"
                      ? "Popular Right Now"
                      : "Newest First"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt_desc">Newest First</SelectItem>
                  <SelectItem value="createdAt_asc">Oldest First</SelectItem>
                  <SelectItem value="rentAmount_asc">Price: Low to High</SelectItem>
                  <SelectItem value="rentAmount_desc">Price: High to Low</SelectItem>
                  <SelectItem value="popular_desc">Popular Right Now</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters (Hidden to prevent layout shift: use invisible class) */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className={cn("h-9 text-xs px-3 rounded-full transition-opacity whitespace-nowrap", hasActiveFilters ? "opacity-100" : "opacity-0 pointer-events-none w-0 px-0")}
            >
              <RotateCcw className="size-3.5 mr-1.5" />
              Clear
            </Button>

          {/* Mobile & Drawer Filter Trigger Button */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger
              render={
                <Button variant="outline" className="h-9 px-3 text-xs gap-1.5 shrink-0 relative shadow-sm rounded-xl font-medium" />
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

                {/* Rent Type & Timing */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground">Rent Type</label>
                    <Select
                      value={rentType || "ALL"}
                      onValueChange={(val) => {
                        const next = !val || val === "ALL" ? "" : val;
                        setRentType(next);
                        updateURL({ rentType: next });
                      }}
                    >
                      <SelectTrigger className="w-full h-9 text-xs">
                        <SelectValue placeholder="Any Type">
                          {rentType === "DAILY" ? "Daily" : rentType === "MONTHLY" ? "Monthly" : rentType === "HOURLY" ? "Hourly" : "Any Type"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">Any Type</SelectItem>
                        <SelectItem value="MONTHLY">Monthly</SelectItem>
                        <SelectItem value="DAILY">Daily</SelectItem>
                        <SelectItem value="HOURLY">Hourly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground">Date Listed</label>
                    <Select
                      value={timeFilter || "ALL"}
                      onValueChange={(val) => {
                        const next = !val || val === "ALL" ? "" : val;
                        setTimeFilter(next);
                        updateURL({ timeFilter: next });
                      }}
                    >
                      <SelectTrigger className="w-full h-9 text-xs">
                        <SelectValue placeholder="Any Time">
                          {timeFilter === "today" ? "Today" : timeFilter === "this-month" ? "This Month" : "Any Time"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">Any Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="this-month">This Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-4 pt-4 border-t border-border">
                  
                  {/* Flexible Rent */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <Label htmlFor="flexible-rent" className="text-xs font-semibold text-foreground cursor-pointer">Flexible Rent</Label>
                      <span className="text-[10px] text-muted-foreground">Properties offering flexible terms</span>
                    </div>
                    <Switch
                      id="flexible-rent"
                      checked={flexibleRent}
                      onCheckedChange={(checked) => {
                        setFlexibleRent(checked);
                        updateURL({ flexibleRent: checked });
                      }}
                    />
                  </div>

                  {/* Quick Available */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <Label htmlFor="quick-available" className="text-xs font-semibold text-foreground cursor-pointer">Quick Available</Label>
                      <span className="text-[10px] text-muted-foreground">Move-in ready within 10 days</span>
                    </div>
                    <Switch
                      id="quick-available"
                      checked={quickAvailable}
                      onCheckedChange={(checked) => {
                        setQuickAvailable(checked);
                        updateURL({ quickAvailable: checked });
                      }}
                    />
                  </div>

                  {/* Featured */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <Label htmlFor="featured" className="text-xs font-semibold text-foreground cursor-pointer">Featured Properties</Label>
                      <span className="text-[10px] text-muted-foreground">Only show premium listings</span>
                    </div>
                    <Switch
                      id="featured"
                      checked={isFeatured}
                      onCheckedChange={(checked) => {
                        setIsFeatured(checked);
                        updateURL({ isFeatured: checked });
                      }}
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


          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyFilterBar;
