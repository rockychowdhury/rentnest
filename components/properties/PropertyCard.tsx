import React from "react";
import Link from "next/link";
import { MapPin, Bed, Bath, Star, ArrowRight } from "lucide-react";
import { OptimizedPropertyImage } from "@/components/shared/OptimizedPropertyImage";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
          <span className="text-base font-heading font-bold text-primary tracking-tight">Contact for Rent</span>
        </div>
      );
    }

    if (property.minPrice === property.maxPrice) {
      return (
        <div className="flex items-end gap-1">
          <span className="text-lg sm:text-xl font-heading font-bold text-primary tracking-tight">
            ৳{property.minPrice.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground mb-0.5 font-medium">{rentPeriod}</span>
        </div>
      );
    }

    return (
      <div className="flex items-end gap-1 flex-wrap">
        <span className="text-lg sm:text-xl font-heading font-bold text-primary tracking-tight">
          ৳{property.minPrice.toLocaleString()}
        </span>
        <span className="text-xs sm:text-sm font-semibold text-muted-foreground mb-0.5">
          – ৳{property.maxPrice.toLocaleString()}
        </span>
        <span className="text-xs text-muted-foreground mb-0.5 font-medium">{rentPeriod}</span>
      </div>
    );
  };

  const displayImage = property.coverImage || property.placeholderLabel;
  const landlordName = property.landlord?.fullName || "Verified Host";
  const landlordAvatar = property.landlord?.avatarUrl;
  const landlordInitials = landlordName.substring(0, 2).toUpperCase();

  return (
    <Link
      href={`/properties/${property.id}/${property.slug}`}
      className={cn(
        "group relative flex flex-col rounded-2xl border border-border/60 bg-card overflow-hidden transition-all duration-300 transform-gpu hover:border-primary/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]",
        layout === "rail" ? "w-[280px] sm:w-[320px] shrink-0 snap-start" : "w-full h-full"
      )}
    >
      {/* Property Image Header */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-muted/30">
        <OptimizedPropertyImage
          src={displayImage}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 transform-gpu"
        />
        
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30 pointer-events-none" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-1.5 pointer-events-none">
          <Badge variant="secondary" className="bg-background/90 text-foreground backdrop-blur-sm border-none shadow-xs text-xs font-semibold px-2.5 py-0.5">
            {property.categoryName}
          </Badge>
          {property.isFeatured && (
            <Badge className="bg-primary text-primary-foreground backdrop-blur-sm border-none shadow-xs text-xs font-semibold px-2.5 py-0.5">
              Featured
            </Badge>
          )}
        </div>

        {/* Isolated Client Heart Save Button */}
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton propertyId={property.id} />
        </div>

        {/* Floating Bed/Bath Specs Pill */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-white pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-medium bg-black/50 backdrop-blur-md px-2 py-1 rounded-md">
              <Bed className="size-3.5" />
              {property.bedroomsMin === property.bedroomsMax
                ? property.bedroomsMin
                : `${property.bedroomsMin}-${property.bedroomsMax}`}{" "}
              Beds
            </span>
            <span className="flex items-center gap-1 text-xs font-medium bg-black/50 backdrop-blur-md px-2 py-1 rounded-md">
              <Bath className="size-3.5" />
              {property.bathroomsMin === property.bathroomsMax
                ? property.bathroomsMin
                : `${property.bathroomsMin}-${property.bathroomsMax}`}{" "}
              Baths
            </span>
          </div>

          {property.rating ? (
            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md text-amber-400 px-2 py-1 rounded-md text-xs font-bold">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              <span>{property.rating.toFixed(1)}</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Body Content */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <div className="flex justify-between items-start gap-2 mb-1.5">
          <h3 className="text-base font-heading font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 flex-1">
            {property.title}
          </h3>
        </div>

        {/* Location Subtext */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
          <MapPin className="size-3.5 text-primary shrink-0" />
          <span className="truncate">{property.location}</span>
        </div>

        {/* Landlord Host Row */}
        <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-muted/40 border border-border/40">
          <Avatar className="size-6 border border-border shrink-0">
            <AvatarImage src={landlordAvatar} />
            <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">
              {landlordInitials}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-foreground font-medium truncate flex-1">
            Hosted by {landlordName}
          </span>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-border text-muted-foreground font-normal shrink-0">
            {property.availableUnits > 0 ? `${property.availableUnits} Vacant` : "Leased"}
          </Badge>
        </div>

        {/* Footer (Price & CTA) */}
        <div className="mt-auto pt-3 flex items-center justify-between border-t border-border/50">
          <div>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-0.5">
              Rent Starts From
            </span>
            {renderPrice()}
          </div>
          
          <div className="size-9 rounded-full bg-primary/10 group-hover:bg-primary flex items-center justify-center transition-colors">
            <ArrowRight className="size-4 text-primary group-hover:text-primary-foreground transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PropertyCard;
