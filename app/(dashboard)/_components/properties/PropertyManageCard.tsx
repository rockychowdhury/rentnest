"use client";

import React from "react";
import Link from "next/link";
import { MoreVertical, Edit, Archive, Undo2, Building2, MapPin, CheckCircle, EyeOff, Bed, Bath, ArrowRight, Square } from "lucide-react";
import { Property, PropertyStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { PropertyStatusBadge } from "./PropertyStatusBadge";
import { ArchivedIndicator } from "./ArchivedIndicator";
import { PropertyImage } from "@/components/shared/PropertyImage";
import { Badge } from "@/components/ui/badge";

interface PropertyManageCardProps {
  property: Property;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
  onRequestVerification: (id: string) => void;
  onDeactivate: (id: string) => void;
}

export function PropertyManageCard({ property, onArchive, onRestore, onRequestVerification, onDeactivate }: PropertyManageCardProps) {
  const coverImage = property.images?.find((img) => img.isCover)?.url || property.images?.[0]?.url || "/placeholder.svg";
  const addressParts = [property.address?.area?.name, property.address?.streetAddress].filter(Boolean);
  const shortAddress = addressParts.join(", ") || "No address provided";
  
  const isArchived = !!property.deletedAt;
  const categoryName = property.category?.name || "Property";

  let bedroomsMin = 0, bedroomsMax = 0;
  let bathroomsMin = 0, bathroomsMax = 0;
  let sizeSqft = 0;
  let minPrice = 0, maxPrice = 0;

  if (property.units && property.units.length > 0) {
    const activeUnits = property.units.filter(u => !u.deletedAt);
    if (activeUnits.length > 0) {
      bedroomsMin = Math.min(...activeUnits.map(u => u.bedrooms || 0));
      bedroomsMax = Math.max(...activeUnits.map(u => u.bedrooms || 0));
      bathroomsMin = Math.min(...activeUnits.map(u => u.bathrooms || 0));
      bathroomsMax = Math.max(...activeUnits.map(u => u.bathrooms || 0));
      sizeSqft = Math.max(...activeUnits.map(u => u.sizeSqft || 0));
      
      const prices = activeUnits.flatMap(u => u.pricing ? u.pricing.map(p => p.rentAmount) : []);
      if (prices.length > 0) {
        minPrice = Math.min(...prices);
        maxPrice = Math.max(...prices);
      }
    }
  }

  const renderPrice = () => {
    if (minPrice === 0 && maxPrice === 0) {
      return (
        <div className="flex items-end gap-1">
          <span className="text-sm font-heading font-bold text-primary tracking-tight">Price Not Set</span>
        </div>
      );
    }
    
    if (minPrice === maxPrice) {
      return (
        <div className="flex items-end gap-1">
          <span className="text-base sm:text-lg font-heading font-bold text-primary tracking-tight leading-none">
            ৳{minPrice.toLocaleString()}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium leading-none">/mo</span>
        </div>
      );
    }

    return (
      <div className="flex items-end gap-1 flex-wrap">
        <span className="text-base sm:text-lg font-heading font-bold text-primary tracking-tight leading-none">
          ৳{minPrice.toLocaleString()}
        </span>
        <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground leading-none">
          – ৳{maxPrice.toLocaleString()}
        </span>
        <span className="text-[10px] text-muted-foreground font-medium leading-none">/mo</span>
      </div>
    );
  };

  return (
    <div className="group relative flex flex-col rounded-xl border border-border/50 bg-card overflow-hidden transition-all duration-300 transform-gpu hover:border-primary/50 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-full h-full">
      {/* Property Image Header */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-muted">
        <PropertyImage
          src={coverImage}
          alt={property.title}
          aspect="16/10"
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105 transform-gpu"
        />
        
        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
        
        {/* Top Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5 pointer-events-none">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="secondary" className="bg-background/95 text-foreground backdrop-blur-md border-none shadow-sm text-[10px] font-semibold px-2 py-0.5 uppercase tracking-wider">
              {categoryName}
            </Badge>
            {property.isFeatured && (
              <Badge className="bg-primary text-primary-foreground backdrop-blur-md border-none shadow-sm text-[10px] font-semibold px-2 py-0.5 uppercase tracking-wider">
                Featured
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            {isArchived ? (
              <ArchivedIndicator />
            ) : (
              <PropertyStatusBadge status={property.status} />
            )}
          </div>
        </div>

        {/* Action Menu Button */}
        <div className="absolute top-2 right-2 z-20">
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/50 hover:bg-background/80 backdrop-blur-md text-foreground rounded-full border-none shadow-sm">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            } />
            <DropdownMenuContent align="end" className="w-48">
              <Link href={`/landlord-dashboard/properties/${property.id}/${property.slug}/details`} className="w-full cursor-pointer">
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Property
                </DropdownMenuItem>
              </Link>
              
              {!isArchived && (
                <>
                  <DropdownMenuSeparator />
                  {(property.status === PropertyStatus.DRAFT || property.status === PropertyStatus.REJECTED) && (
                    <DropdownMenuItem onClick={() => onRequestVerification(property.id)} className="cursor-pointer">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Request Verification
                    </DropdownMenuItem>
                  )}
                  {property.status === PropertyStatus.ACTIVE && property.isVerified && (
                    <DropdownMenuItem onClick={() => onDeactivate(property.id)} className="cursor-pointer">
                      <EyeOff className="mr-2 h-4 w-4" />
                      Make Inactive
                    </DropdownMenuItem>
                  )}
                  {property.status === PropertyStatus.INACTIVE && property.isVerified && (
                    <DropdownMenuItem onClick={() => onRestore(property.id)} className="cursor-pointer">
                      <Undo2 className="mr-2 h-4 w-4" />
                      Restore Listing
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive cursor-pointer" 
                    onClick={() => onArchive(property.id)}
                  >
                    <Archive className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Body Content */}
      <Link href={`/landlord-dashboard/properties/${property.id}/${property.slug}/details`} className="flex flex-col flex-1 p-3 sm:p-4 hover:no-underline">
        {/* Title & Location */}
        <div className="mb-3">
          <h3 className="text-sm sm:text-base font-heading font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1">
            {property.title}
          </h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3 text-primary/70 shrink-0" />
            <span className="truncate">{shortAddress}</span>
          </div>
        </div>

        {/* Info Pills */}
        <div className="flex items-center gap-1.5 mb-4 mt-auto flex-wrap overflow-hidden">
          {bedroomsMin > 0 && (
            <div className="flex items-center gap-1 bg-secondary/15 text-secondary-foreground dark:bg-muted/50 dark:text-foreground px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap">
              <Bed className="size-3 text-secondary" />
              <span>
                {bedroomsMin === bedroomsMax
                  ? bedroomsMin
                  : `${bedroomsMin}-${bedroomsMax}`}
              </span>
            </div>
          )}
          {bathroomsMin > 0 && (
            <div className="flex items-center gap-1 bg-secondary/15 text-secondary-foreground dark:bg-muted/50 dark:text-foreground px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap">
              <Bath className="size-3 text-secondary" />
              <span>
                {bathroomsMin === bathroomsMax
                  ? bathroomsMin
                  : `${bathroomsMin}-${bathroomsMax}`}
              </span>
            </div>
          )}
          {!!sizeSqft && sizeSqft > 0 && (
            <div className="flex items-center gap-1 bg-secondary/15 text-secondary-foreground dark:bg-muted/50 dark:text-foreground px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap">
              <Square className="size-2.5 text-secondary" />
              <span>{sizeSqft} sqft</span>
            </div>
          )}
          <div className="flex items-center gap-1 bg-secondary/15 text-secondary-foreground dark:bg-muted/50 dark:text-foreground px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap">
             <Building2 className="size-3 text-secondary" />
             <span>{property.totalUnits} {property.totalUnits === 1 ? 'unit' : 'units'}</span>
          </div>
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
      </Link>
    </div>
  );
}
