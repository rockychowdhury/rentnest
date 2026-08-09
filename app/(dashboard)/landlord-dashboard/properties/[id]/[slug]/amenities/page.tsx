"use client";

import { useEffect, useState, use } from "react";
import { Property } from "@/types";
import { getPropertyById } from "@/app/(dashboard)/_actions/propertiesActions";
import { setPropertyAmenities } from "@/app/(dashboard)/_actions/propertyAmenitiesActions";
import { AmenityToggleGrid } from "@/app/(dashboard)/_components/properties/AmenityToggleGrid";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function PropertyAmenitiesPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);

  const loadData = async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefetching(true);
    
    const propRes = await getPropertyById(params.id);
      
      if (propRes.success && propRes.data) {
        setProperty(propRes.data);
      } else {
        toast.error("Failed to load property");
      }
      
    if (!silent) setIsLoading(false);
    else setIsRefetching(false);
  };

  useEffect(() => {
    loadData();
  }, [params.id]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!property) return null;

  const initialAmenities = property.amenities?.map((pa: any) => ({
    id: pa.amenity.id,
    name: pa.amenity.name,
    description: pa.amenity.description
  })) || [];

  return (
    <div className="animate-in fade-in-50 duration-300">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Amenities</CardTitle>
            {isRefetching && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>
          <CardDescription>Select the amenities available at this property.</CardDescription>
        </CardHeader>
        <CardContent>
          <AmenityToggleGrid 
            initialAmenities={initialAmenities} 
            amenityType="PROPERTY,COMMON"
            onSave={async (amenityIds) => {
              const res = await setPropertyAmenities(property.id, amenityIds);
              if (res.success) {
                loadData(true);
              }
              return res as any;
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
