"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Building, ChevronDown, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/shadcnUtils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { CategoryItem } from "@/service/getCategories";
import { searchAreasGlobally } from "@/app/(dashboard)/_actions/addressActions";
import { Area } from "@/types";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { Input } from "@/components/ui/input";

interface HeroSearchFormProps {
  categories: CategoryItem[];
}

export function HeroSearchForm({ categories }: HeroSearchFormProps) {
  const router = useRouter();

  // Location Search State
  const [inputValue, setInputValue] = useState("");
  const debouncedInput = useDebouncedValue(inputValue, 300);
  const [areas, setAreas] = useState<any[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  
  const [selectedAreaId, setSelectedAreaId] = useState<string>("");
  const [selectedAreaName, setSelectedAreaName] = useState<string>("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  
  const locationRef = useRef<HTMLDivElement>(null);
  
  // Custom click outside logic
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categoryOpen, setCategoryOpen] = useState(false);

  // Fetch areas on search
  useEffect(() => {
    // If an area is already selected, don't trigger another search
    if (selectedAreaId) {
      return;
    }

    if (debouncedInput.length < 2) {
      setAreas([]);
      return;
    }

    let isMounted = true;
    const fetchLocations = async () => {
      setIsLoadingLocation(true);
      try {
        const res = await searchAreasGlobally(debouncedInput);
        if (isMounted && res.success) {
          setAreas(res.data || []);
          setShowLocationDropdown(true);
        }
      } catch (error) {
        console.error("Failed to search areas:", error);
      } finally {
        if (isMounted) {
          setIsLoadingLocation(false);
        }
      }
    };

    fetchLocations();

    return () => {
      isMounted = false;
    };
  }, [debouncedInput, selectedAreaId]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedAreaId) params.set("areaId", selectedAreaId);
    if (selectedCategory) params.set("categoryId", selectedCategory);
    
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="w-full flex flex-col md:flex-row items-center gap-2 md:gap-0 p-1">
      
      {/* Location Direct Input */}
      <div className="relative w-full flex-1" ref={locationRef}>
        <div className="relative flex items-center w-full group rounded-full hover:bg-white/5 transition-colors">
          <MapPin className="absolute left-5 size-5 text-white/70 pointer-events-none" />
          <Input
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setSelectedAreaId(""); // Clear selection if user types
              if (e.target.value.length >= 2) setShowLocationDropdown(true);
            }}
            onFocus={() => {
              if (inputValue.length >= 2 || areas.length > 0) setShowLocationDropdown(true);
            }}
            placeholder="Search city, area, or location..."
            className="w-full h-14 pl-12 pr-4 text-base bg-transparent border-transparent text-white placeholder:text-white/70 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none shadow-none rounded-full"
          />
          {isLoadingLocation && (
            <Loader2 className="absolute right-4 size-5 text-white/70 animate-spin" />
          )}
        </div>

        {/* Custom Dropdown for Location Results */}
        {showLocationDropdown && (inputValue.length >= 2 || areas.length > 0) && (
          <div className="absolute top-full left-0 mt-3 w-full bg-card rounded-xl shadow-2xl border border-border z-50 max-h-[350px] overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {!isLoadingLocation && inputValue.length > 0 && inputValue.length < 2 && (
              <div className="p-5 text-center text-sm text-muted-foreground">
                Type at least 2 characters...
              </div>
            )}
            {!isLoadingLocation && areas.length === 0 && inputValue.length >= 2 && (
              <div className="p-5 text-center text-sm text-muted-foreground">
                No locations found.
              </div>
            )}
            
            {areas.length > 0 && (
              <ul className="py-2">
                {areas.map((area) => (
                  <li
                    key={area.id}
                    onClick={() => {
                      setSelectedAreaId(area.id.toString());
                      setSelectedAreaName(area.name);
                      setInputValue(`${area.name}, ${area.district.name}`);
                      setShowLocationDropdown(false);
                    }}
                    className="px-5 py-3 hover:bg-muted cursor-pointer flex items-center gap-4 transition-colors"
                  >
                    <div className="p-2 bg-muted rounded-full shrink-0">
                      <MapPin className="size-4 text-foreground" />
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="font-semibold text-foreground text-sm truncate">
                        {area.name}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {area.district.name}, {area.district.division.name}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="hidden md:block w-[1px] h-8 bg-white/20 mx-2" />

      {/* Category Select */}
      <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={categoryOpen}
              className="w-full md:w-auto flex-[0.6] justify-between h-14 bg-transparent border-transparent text-white hover:bg-white/10 hover:text-white rounded-full shadow-none px-6 text-base"
            />
          }
        >
          <div className="flex items-center gap-2 truncate">
            <Building className="size-5 opacity-70" />
            <span className="truncate">
              {selectedCategory
                ? categories.find((c) => c.id === selectedCategory)?.name || "Selected Category"
                : "All Categories"}
            </span>
          </div>
          <ChevronDown className="ml-2 size-5 shrink-0 opacity-50" />
        </PopoverTrigger>
        <PopoverContent className="w-[320px] p-0 rounded-xl shadow-2xl border-border mt-1" align="start">
          <Command>
            <CommandInput placeholder="Search category..." className="h-12" />
            <CommandList className="max-h-[200px] overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <CommandEmpty>No category found.</CommandEmpty>
              <CommandGroup>
                {categories.map((cat) => (
                  <CommandItem
                    key={cat.id}
                    value={cat.name}
                    onSelect={() => {
                      setSelectedCategory(cat.id);
                      setCategoryOpen(false);
                    }}
                    className="cursor-pointer py-3 px-4"
                  >
                    <Check
                      className={cn(
                        "mr-3 size-4 text-primary",
                        selectedCategory === cat.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="text-sm font-medium">{cat.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Search Button */}
      <Button 
        onClick={handleSearch}
        className="size-14 shrink-0 rounded-full bg-primary hover:bg-primary/90 text-white shadow-[0_4px_20px_rgba(225,29,72,0.4)] transition-all ml-3"
        aria-label="Search Properties"
      >
        <Search className="size-6" />
      </Button>
    </div>
  );
}
