"use client";

import { Amenity } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { setPropertyAmenities } from "@/app/(dashboard)/_actions/propertyAmenitiesActions";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Loader2, Search, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { getAllAmenities } from "@/app/(dashboard)/_actions/propertyAmenitiesActions";

interface AmenityToggleGridProps {
  propertyId: string;
  initialAmenities: { id: string; name: string; description?: string }[];
}

export function AmenityToggleGrid({ propertyId, initialAmenities }: AmenityToggleGridProps) {
  const [selectedMap, setSelectedMap] = useState<Record<string, { id: string; name: string }>>(() => {
    const map: Record<string, { id: string; name: string }> = {};
    initialAmenities.forEach(a => map[a.id] = { id: a.id, name: a.name });
    return map;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 400);
  const [searchResults, setSearchResults] = useState<Amenity[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchAmenities = async () => {
      setIsSearching(true);
      const res = await getAllAmenities(debouncedSearchTerm, 10);
      if (res.success) {
        setSearchResults(res.data);
      }
      setIsSearching(false);
    };

    fetchAmenities();
  }, [debouncedSearchTerm]);

  const handleToggle = (amenity: { id: string; name: string }, checked: boolean) => {
    setSelectedMap(prev => {
      const newMap = { ...prev };
      if (checked) {
        newMap[amenity.id] = amenity;
      } else {
        delete newMap[amenity.id];
      }
      return newMap;
    });
  };

  const handleUpdate = async () => {
    setIsSaving(true);
    const amenityIdsArray = Object.keys(selectedMap);
    
    try {
      const res = await setPropertyAmenities(propertyId, amenityIdsArray);
      if (res.success) {
        toast.success("Amenities updated successfully");
      } else {
        toast.error(res.error || "Failed to update amenities");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const selectedList = Object.values(selectedMap);

  return (
    <div className="space-y-8">
            <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          Current Amenities
        </h3>
        
        {selectedList.length === 0 ? (
          <p className="text-sm text-muted-foreground p-4 bg-muted/20 border rounded-md">
            This property currently has no amenities. Search below to add some.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-4 border rounded-md bg-muted/10">
            {selectedList.map((amenity) => (
              <div key={amenity.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                <Checkbox 
                  id={`current-amenity-${amenity.id}`}
                  checked={true}
                  onCheckedChange={(checked) => handleToggle(amenity, checked as boolean)}
                />
                <label 
                  htmlFor={`current-amenity-${amenity.id}`}
                  className="text-sm font-medium leading-none cursor-pointer flex-1"
                >
                  {amenity.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Add Amenities</h3>
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search amenities..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {searchResults.map((amenity) => {
            const isChecked = !!selectedMap[amenity.id];
            
            return (
              <div key={amenity.id} className="flex items-center space-x-3 p-3 rounded-md border border-transparent hover:border-border bg-card shadow-sm hover:shadow transition-all">
                <Checkbox 
                  id={`search-amenity-${amenity.id}`}
                  checked={isChecked}
                  onCheckedChange={(checked) => handleToggle({ id: amenity.id, name: amenity.name }, checked as boolean)}
                />
                <label 
                  htmlFor={`search-amenity-${amenity.id}`}
                  className="text-sm font-medium leading-none cursor-pointer flex-1"
                >
                  {amenity.name}
                </label>
              </div>
            );
          })}
          
          {!isSearching && searchResults.length === 0 && (
            <p className="text-sm text-muted-foreground col-span-full py-4 text-center">
              No amenities found matching your search.
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t mt-6">
        <Button onClick={handleUpdate} disabled={isSaving} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update Amenities
        </Button>
      </div>
    </div>
  );
}
