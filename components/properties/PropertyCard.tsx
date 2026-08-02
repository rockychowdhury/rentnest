"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, MapPin, Bed, Bath, Zap, Droplets, Car, Shield, Star } from "lucide-react";
import { FeatureImagePlaceholder } from "@/components/shared/FeatureImagePlaceholder";
import { Badge } from "@/components/ui/badge";
import { PropertyItem } from "@/service/getProperties";
import { cn } from "@/lib/utils/shadcnUtils";

interface PropertyCardProps {
  property: PropertyItem;
  layout?: "grid" | "rail";
}

export function PropertyCard({ property, layout = "grid" }: PropertyCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  const renderPrice = () => {
    if (property.minPrice === property.maxPrice) {
      return (
        <span>
          ৳{property.minPrice.toLocaleString()}
          <span className="text-[10px] text-muted-foreground font-normal">/mo</span>
        </span>
      );
    }
    return (
      <span>
        ৳{property.minPrice.toLocaleString()} – ৳{property.maxPrice.toLocaleString()}
        <span className="text-[10px] text-muted-foreground font-normal">/mo</span>
      </span>
    );
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "generator-backup":
        return <span title="Generator Backup"><Zap className="size-3 text-amber-500" /></span>;
      case "wasa-water":
        return <span title="WASA Water"><Droplets className="size-3 text-blue-500" /></span>;
      case "parking":
        return <span title="Parking"><Car className="size-3 text-emerald-500" /></span>;
      case "security":
        return <span title="24/7 Security"><Shield className="size-3 text-indigo-500" /></span>;
      default:
        return null;
    }
  };

  return (
    <Link
      href={`/properties/${property.id}`}
      className={cn(
        "group relative rounded-2xl border border-border bg-card p-4 flex flex-col justify-between transition-all duration-200 hover:border-primary/40 hover:shadow-lg",
        layout === "rail" ? "w-[300px] sm:w-[340px] shrink-0 snap-start" : "w-full"
      )}
    >
      <div className="space-y-3">
        {/* Image Container with Badges & Save Action */}
        <div className="relative w-full overflow-hidden rounded-xl">
          <FeatureImagePlaceholder
            label={property.placeholderLabel}
            aspect="4/3"
            className="w-full transition-transform duration-300 group-hover:scale-102"
          />

          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 flex-wrap">
            <Badge variant="secondary" className="text-[10px] font-semibold">
              {property.categoryName}
            </Badge>
            {property.isFeatured && (
              <Badge className="text-[10px] bg-primary text-primary-foreground">
                Featured
              </Badge>
            )}
          </div>

          <button
            onClick={toggleSave}
            className="absolute top-3 right-3 z-10 size-8 rounded-full bg-card/90 backdrop-blur-md border border-border flex items-center justify-center text-foreground hover:scale-110 transition-transform shadow-xs"
            title={isSaved ? "Remove from favorites" : "Save to favorites"}
          >
            <Heart
              className={cn(
                "size-4 transition-colors",
                isSaved ? "text-primary fill-primary" : "text-muted-foreground"
              )}
            />
          </button>
        </div>

        {/* Content Info */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1 truncate">
              <MapPin className="size-3 text-primary shrink-0" />
              <span className="truncate">{property.location}</span>
            </div>

            {property.rating && (
              <div className="flex items-center gap-1 font-semibold text-foreground shrink-0">
                <Star className="size-3 text-amber-500 fill-amber-500" />
                <span>{property.rating.toFixed(1)}</span>
                <span className="text-[10px] text-muted-foreground font-normal">
                  ({property.reviewCount})
                </span>
              </div>
            )}
          </div>

          <h3 className="text-sm sm:text-base font-heading font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {property.title}
          </h3>

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {property.description}
          </p>
        </div>
      </div>

      {/* Footer Specs & Availability */}
      <div className="pt-4 border-t border-border/60 mt-4 space-y-2">
        <div className="flex items-center justify-between gap-2">
          {/* Bedrooms / Bathrooms */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1" title="Bedrooms">
              <Bed className="size-3.5" />
              {property.bedroomsMin === property.bedroomsMax
                ? property.bedroomsMin
                : `${property.bedroomsMin}-${property.bedroomsMax}`}
            </span>
            <span className="flex items-center gap-1" title="Bathrooms">
              <Bath className="size-3.5" />
              {property.bathroomsMin === property.bathroomsMax
                ? property.bathroomsMin
                : `${property.bathroomsMin}-${property.bathroomsMax}`}
            </span>
          </div>

          {/* Top Amenities */}
          <div className="flex items-center gap-1.5">
            {property.amenities.slice(0, 3).map((a) => (
              <span key={a} className="p-1 rounded bg-muted/60">
                {getAmenityIcon(a)}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          {/* Availability Status */}
          <span
            className={cn(
              "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
              property.availableNow
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                : "bg-muted text-muted-foreground border-border"
            )}
          >
            {property.availableNow
              ? `${property.availableUnits} of ${property.totalUnits} available`
              : "Leased"}
          </span>

          {/* Price Range */}
          <div className="text-sm font-heading font-bold text-primary">
            {renderPrice()}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PropertyCard;
