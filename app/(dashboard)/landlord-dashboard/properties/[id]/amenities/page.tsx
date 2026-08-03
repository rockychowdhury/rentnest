"use client";

import { useEffect, useState, use } from "react";
import { Property } from "@/types";
import { getPropertyById } from "@/app/(dashboard)/_actions/propertiesActions";
import { AmenityToggleGrid } from "@/app/(dashboard)/_components/properties/AmenityToggleGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function PropertyAmenitiesPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const propRes = await getPropertyById(params.id);
      
      if (propRes.success && propRes.data) {
        setProperty(propRes.data);
      } else {
        toast.error("Failed to load property");
      }
      
      setIsLoading(false);
    };
    
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
          <CardTitle>Amenities</CardTitle>
          <CardDescription>Select the amenities available at this property.</CardDescription>
        </CardHeader>
        <CardContent>
          <AmenityToggleGrid 
            propertyId={property.id} 
            initialAmenities={initialAmenities} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
