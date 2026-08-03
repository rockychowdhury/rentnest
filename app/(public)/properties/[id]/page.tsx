import React from "react";
import { getPropertyById } from "@/app/(dashboard)/_actions/propertiesActions";
import { getMe } from "@/service/getMe";
import { User, Property, PropertyStatus } from "@/types";
import { notFound } from "next/navigation";
import { PropertyDetailsGallery } from "@/components/properties/PropertyDetailsGallery";
import { RentRequestCard } from "@/components/properties/RentRequestCard";
import { MapPin, Bed, Bath, Home, CalendarDays, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default async function PropertyDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  
  const [propertyRes, userRes] = await Promise.all([
    getPropertyById(params.id),
    getMe()
  ]);

  const property = propertyRes.success ? (propertyRes.data as Property) : null;
  const user = userRes.success ? (userRes.data as User) : null;

  if (!property || property.status !== PropertyStatus.PUBLISHED) {
    notFound();
  }

  const locParts = [
    property.address?.streetAddress, 
    property.address?.upazila?.name, 
    property.address?.upazila?.district?.name
  ].filter(Boolean);
  const fullAddress = locParts.join(", ") || "Location not specified";

  let minBeds = 0, maxBeds = 0, minBaths = 0, maxBaths = 0;
  if (property.units && property.units.length > 0) {
    const beds = property.units.map(u => u.bedrooms);
    const baths = property.units.map(u => u.bathrooms);
    minBeds = Math.min(...beds);
    maxBeds = Math.max(...beds);
    minBaths = Math.min(...baths);
    maxBaths = Math.max(...baths);
  }

  return (
    <div className="w-full bg-background min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
                <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                {property.category?.name || "Property"}
              </Badge>
              {property.isFeatured && (
                <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-none">
                  Featured
                </Badge>
              )}
              <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                ID: {property.id.split("-")[0]}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground">
              {property.title}
            </h1>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <MapPin className="size-4 text-primary shrink-0" />
              <span>{fullAddress}</span>
            </div>
          </div>

          <PropertyDetailsGallery images={property.images || []} />
        </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
                    <div className="lg:col-span-2 space-y-10">
            
                        <div className="flex flex-wrap items-center gap-6 p-6 rounded-2xl border border-border bg-card shadow-sm">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Bed className="size-4" /> Bedrooms
                </span>
                <span className="text-lg font-bold">
                  {minBeds === maxBeds ? minBeds : `${minBeds}-${maxBeds}`}
                </span>
              </div>
              <Separator orientation="vertical" className="h-10 hidden sm:block" />
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Bath className="size-4" /> Bathrooms
                </span>
                <span className="text-lg font-bold">
                  {minBaths === maxBaths ? minBaths : `${minBaths}-${maxBaths}`}
                </span>
              </div>
              <Separator orientation="vertical" className="h-10 hidden sm:block" />
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Home className="size-4" /> Units
                </span>
                <span className="text-lg font-bold">
                  {property.totalUnits} Total
                </span>
              </div>
            </div>

                        <section className="space-y-4">
              <h2 className="text-2xl font-heading font-bold">About this property</h2>
              <div className="prose prose-sm sm:prose-base dark:prose-invert text-muted-foreground max-w-none leading-relaxed whitespace-pre-wrap">
                {property.description}
              </div>
            </section>

            <Separator />

                        {property.amenities && property.amenities.length > 0 && (
              <section className="space-y-6">
                <h2 className="text-2xl font-heading font-bold">Amenities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((pa, index) => (
                    <div key={pa.amenity?.id || index} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card shadow-sm">
                      <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <CheckCircle2 className="size-5" />
                      </div>
                      <span className="text-sm font-medium">{pa.amenity?.name}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <Separator />

                        <section className="space-y-6">
              <h2 className="text-2xl font-heading font-bold">Available Units</h2>
              <div className="space-y-4">
                {property.units?.filter(u => u.status === "AVAILABLE").length === 0 ? (
                  <p className="text-muted-foreground italic">No units are currently available.</p>
                ) : (
                  property.units?.filter(u => u.status === "AVAILABLE").map((unit) => (
                    <div key={unit.id} className="p-4 rounded-xl border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-lg">{unit.unitLabel}</h3>
                        <p className="text-sm text-muted-foreground">{unit.bedrooms} Bed, {unit.bathrooms} Bath • {unit.sizeSqft} sqft</p>
                      </div>
                      <div className="flex flex-col gap-1 sm:items-end">
                        {unit.pricing?.filter(p => p.isActive).map(p => (
                          <span key={p.id} className="font-bold text-primary">
                            {p.currency} {p.rentAmount?.toLocaleString()} <span className="text-xs text-muted-foreground font-normal">/ {p.rentType?.toLowerCase() || ''}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

          </div>

                    <div className="lg:col-span-1">
            <RentRequestCard property={property} user={user} />
          </div>

        </div>
      </div>
    </div>
  );
}
