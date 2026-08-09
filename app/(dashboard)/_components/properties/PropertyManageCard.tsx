"use client";

import Link from "next/link";
import Image from "next/image";
import { MoreVertical, Edit, Archive, Undo2, Building2, MapPin, CheckCircle, EyeOff } from "lucide-react";
import { Property, PropertyStatus } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import { PropertyStatusBadge } from "./PropertyStatusBadge";
import { ArchivedIndicator } from "./ArchivedIndicator";

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

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-md">
      <div className="relative aspect-video w-full bg-muted">
        <Image 
          src={coverImage} 
          alt={property.title} 
          fill 
          unoptimized
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isArchived ? (
            <ArchivedIndicator />
          ) : (
            <PropertyStatusBadge status={property.status} />
          )}
        </div>
      </div>
      
      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="line-clamp-1 font-semibold leading-none tracking-tight">
              {property.title}
            </h3>
            <p className="mt-1 line-clamp-1 text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {shortAddress}
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button variant="ghost" size="icon" className="-mt-2 -mr-2 h-8 w-8 text-muted-foreground">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            } />
            <DropdownMenuContent align="end">
              <Link href={`/landlord-dashboard/properties/${property.id}/${property.slug}/details`} className="w-full">
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Property
                </DropdownMenuItem>
              </Link>
              
              {!isArchived && (
                <>
                  <DropdownMenuSeparator />
                  {(property.status === PropertyStatus.DRAFT || property.status === PropertyStatus.REJECTED) && (
                    <DropdownMenuItem onClick={() => onRequestVerification(property.id)}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Request Verification
                    </DropdownMenuItem>
                  )}
                  {property.status === PropertyStatus.ACTIVE && property.isVerified && (
                    <DropdownMenuItem onClick={() => onDeactivate(property.id)}>
                      <EyeOff className="mr-2 h-4 w-4" />
                      Make Inactive
                    </DropdownMenuItem>
                  )}
                  {property.status === PropertyStatus.INACTIVE && property.isVerified && (
                    <DropdownMenuItem onClick={() => onRestore(property.id)}>
                      <Undo2 className="mr-2 h-4 w-4" />
                      Restore Listing
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive" 
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
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <div className="flex w-full items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Building2 className="h-4 w-4" />
            {property.totalUnits} {property.totalUnits === 1 ? 'unit' : 'units'} total
          </span>
          {property.category && (
            <span className="truncate max-w-[120px]">{property.category.name}</span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
 
