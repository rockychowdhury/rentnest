import React from "react";
import Link from "next/link";
import { MapPin, Bed, Bath, ArrowRight, Square } from "lucide-react";
import { PropertyImage } from "@/components/shared/PropertyImage";
import { Badge } from "@/components/ui/badge";
import { PropertyItem } from "@/service/getProperties";
import { FavoriteButton } from "./FavoriteButton";
import { cn } from "@/lib/utils/shadcnUtils";

interface PropertyCardProps {
  property: PropertyItem;
  layout?: "grid" | "rail";
}

export function PropertyCard({ property, layout = "grid" }: PropertyCardProps) {
  const renderPrice = () => {
    const rentPeriod = property.primaryRentType ? `/${property.primaryRentType.toLowerCase()}` : "/mo";

    if (property.minPrice === 0 && property.maxPrice === 0) {
      return (
        <div className="flex items-end gap-1">
          <span className="text-sm font-heading font-bold text-primary tracking-tight">Contact for Rent</span>
        </div>
      );
    }

    if (property.minPrice === property.maxPrice) {
      return (
        <div className="flex items-end gap-1">
          <span className="text-base sm:text-lg font-heading font-bold text-primary tracking-tight leading-none">
            ৳{property.minPrice.toLocaleString()}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium leading-none">{rentPeriod}</span>
        </div>
      );
    }

    return (
      <div className="flex items-end gap-1 flex-wrap">
        <span className="text-base sm:text-lg font-heading font-bold text-primary tracking-tight leading-none">
          ৳{property.minPrice.toLocaleString()}
        </span>
        <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground leading-none">
          – ৳{property.maxPrice.toLocaleString()}
        </span>
        <span className="text-[10px] text-muted-foreground font-medium leading-none">{rentPeriod}</span>
      </div>
    );
  };

  const displayImage = property.coverImage;

  return (
    <Link
      href={`/properties/${property.id}/${property.slug}`}
      className={cn(
        "group relative flex flex-col rounded-xl border border-border/50 bg-card overflow-hidden transition-all duration-300 transform-gpu hover:border-primary/30 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        layout === "rail" ? "w-[240px] sm:w-[280px] shrink-0 snap-start" : "w-full h-full"
      )}
    >
      {/* Property Image Header */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-muted">
        <PropertyImage
          src={displayImage}
          alt={property.title}
          aspect="16/10"
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105 transform-gpu"
        />
        
        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
        
        {/* Top Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-wrap items-center gap-1.5 pointer-events-none">
          <Badge variant="secondary" className="bg-background/95 text-foreground backdrop-blur-md border-none shadow-sm text-[10px] font-semibold px-2 py-0.5 uppercase tracking-wider">
            {property.categoryName}
          </Badge>
          {property.isFeatured && (
            <Badge className="bg-primary text-primary-foreground backdrop-blur-md border-none shadow-sm text-[10px] font-semibold px-2 py-0.5 uppercase tracking-wider">
              Featured
            </Badge>
          )}
        </div>

        {/* Favorite Button */}
        <div className="absolute top-2 right-2 z-10">
          <FavoriteButton propertyId={property.id} />
        </div>
      </div>

      {/* Body Content */}
      <div className="flex flex-col flex-1 p-3 sm:p-4">
        {/* Title & Location */}
        <div className="mb-3">
          <h3 className="text-sm sm:text-base font-heading font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1">
            {property.title}
          </h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3 text-primary/70 shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>
        </div>

        {/* Info Pills */}
        <div className="flex items-center gap-1.5 mb-4 mt-auto flex-wrap overflow-hidden">
          {property.bedroomsMin > 0 && (
            <div className="flex items-center gap-1 bg-secondary/15 text-secondary-foreground px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap">
              <Bed className="size-3 text-secondary" />
              <span>
                {property.bedroomsMin === property.bedroomsMax
                  ? property.bedroomsMin
                  : `${property.bedroomsMin}-${property.bedroomsMax}`}
              </span>
            </div>
          )}
          {property.bathroomsMin > 0 && (
            <div className="flex items-center gap-1 bg-secondary/15 text-secondary-foreground px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap">
              <Bath className="size-3 text-secondary" />
              <span>
                {property.bathroomsMin === property.bathroomsMax
                  ? property.bathroomsMin
                  : `${property.bathroomsMin}-${property.bathroomsMax}`}
              </span>
            </div>
          )}
          {!!property.sizeSqft && property.sizeSqft > 0 && (
            <div className="flex items-center gap-1 bg-secondary/15 text-secondary-foreground px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap">
              <Square className="size-2.5 text-secondary" />
              <span>{property.sizeSqft} sqft</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 flex items-center justify-between border-t border-border/40">
          <div>
            <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest block mb-0.5">
              Rent Starts From
            </span>
            {renderPrice()}
          </div>
          
          <div className="size-7 rounded-full bg-primary/10 group-hover:bg-primary flex items-center justify-center transition-colors">
            <ArrowRight className="size-3.5 text-primary group-hover:text-primary-foreground transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PropertyCard;
