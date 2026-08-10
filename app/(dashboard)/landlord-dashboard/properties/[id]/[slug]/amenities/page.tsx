"use client";

import { useEffect, useState, use } from "react";
import { Property } from "@/types";
import { setPropertyAmenities } from "@/app/(dashboard)/_actions/propertyAmenitiesActions";
import { usePropertyContext } from "@/app/(dashboard)/_components/properties/PropertyProvider";
import { AmenityToggleGrid } from "@/app/(dashboard)/_components/properties/AmenityToggleGrid";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PropertyAmenitiesPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const { property, setProperty } = usePropertyContext();
  const router = useRouter();

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
                router.refresh();
              }
              return res as any;
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
