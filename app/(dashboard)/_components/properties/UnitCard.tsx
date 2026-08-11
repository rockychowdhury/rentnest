"use client";

import { useState } from "react";
import { PropertyUnit, UnitStatus, RentType } from "@/types";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Bed, Bath, Maximize, Layers } from "lucide-react";
import { UnitStatusBadge } from "./UnitStatusBadge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { UnitForm } from "./UnitForm";
import { DangerZone } from "./DangerZone";
import { PricingTable } from "./PricingTable";
import { setUnitAmenities, updatePropertyUnit, updateUnitStatus, softDeleteUnit } from "@/app/(dashboard)/_actions/unitsActions";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AmenityToggleGrid } from "./AmenityToggleGrid";
import { CheckSquare } from "lucide-react";

interface UnitCardProps {
  unit: PropertyUnit;
  onUnitUpdated: () => void;
}

export function UnitCard({ unit, onUnitUpdated }: UnitCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAmenitiesOpen, setIsAmenitiesOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const lowestRent = unit.pricing
    ?.filter(p => p.isActive)
    ?.map(p => p.rentAmount)
    ?.sort((a, b) => a - b)[0];

  const handleEditSubmit = async (data: Partial<PropertyUnit>) => {
    const res = await updatePropertyUnit(unit.id, data);
    if (res.success) {
      toast.success("Unit updated successfully");
      setIsEditOpen(false);
      onUnitUpdated();
    } else {
      toast.error(res.error || "Failed to update unit");
    }
  };

  const handleStatusChange = async (newStatus: UnitStatus) => {
    setIsUpdatingStatus(true);
    const res = await updateUnitStatus(unit.id, newStatus);
    if (res.success) {
      toast.success("Unit status updated");
      onUnitUpdated();
    } else {
      toast.error(res.error || "Failed to update status");
    }
    setIsUpdatingStatus(false);
  };

  const handleSoftDelete = async () => {
    const res = await softDeleteUnit(unit.id);
    if (res.success) {
      toast.success("Unit removed");
      onUnitUpdated();
    } else {
      toast.error(res.error || "Failed to remove unit");
    }
  };

  const isArchived = !!unit.deletedAt;

  return (
    <AccordionItem value={unit.id} className="border rounded-md px-4 bg-card mb-4 shadow-sm relative">
      <AccordionTrigger className="hover:no-underline py-4 pr-40">
        <div className="flex flex-1 items-center justify-between pr-4">
          <div className="flex items-center gap-4">
            <h4 className="font-semibold text-foreground text-base tracking-tight">{unit.unitLabel}</h4>
            <div className="hidden md:flex items-center gap-3 text-sm text-muted-foreground font-medium">
              <div className="flex items-center gap-1.5"><Bed className="w-4 h-4" /> {unit.bedrooms} Bed</div>
              <div className="flex items-center gap-1.5"><Bath className="w-4 h-4" /> {unit.bathrooms} Bath</div>
              {unit.sizeSqft && <div className="flex items-center gap-1.5"><Maximize className="w-4 h-4" /> {unit.sizeSqft} Sqft</div>}
              {unit.floor && <div className="flex items-center gap-1.5"><Layers className="w-4 h-4" /> Fl: {unit.floor}</div>}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {lowestRent !== undefined && (
              <span className="font-medium text-primary hidden sm:inline-block">
                From {unit.pricing?.[0]?.currency || "$"}{lowestRent.toLocaleString()}
              </span>
            )}
            {isArchived && <span className="text-xs text-destructive font-medium">Removed</span>}
          </div>
        </div>
      </AccordionTrigger>

      {/* Select component is positioned absolutely over the header to avoid invalid <button> inside <button> HTML nesting */}
      <div 
        className="absolute right-12 top-4 z-10" 
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <Select
          value={unit.status}
          onValueChange={(val) => handleStatusChange(val as UnitStatus)}
          disabled={isUpdatingStatus || isArchived}
        >
          <SelectTrigger className={`w-[130px] h-8 text-xs font-semibold ${
            unit.status === UnitStatus.AVAILABLE ? 'bg-success/10 text-success border-success/20' : 
            unit.status === UnitStatus.OCCUPIED ? 'bg-warning/10 text-warning-foreground border-warning/20' : 
            'bg-muted text-muted-foreground'
          }`}>
            <SelectValue placeholder="Status">
              {unit.status === UnitStatus.AVAILABLE ? "Available" : 
               unit.status === UnitStatus.OCCUPIED ? "Occupied" : 
               unit.status === UnitStatus.MAINTENANCE ? "Maintenance" : "Status"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={UnitStatus.AVAILABLE} className="text-success font-medium">Available</SelectItem>
            <SelectItem value={UnitStatus.OCCUPIED} className="text-warning-foreground font-medium">Occupied</SelectItem>
            <SelectItem value={UnitStatus.MAINTENANCE} className="text-muted-foreground font-medium">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <AccordionContent className="pt-2 pb-6 space-y-6 border-t mt-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1 max-w-[60%]">
            <h5 className="font-medium text-sm text-foreground">Unit Description</h5>
            <p className="text-sm text-muted-foreground leading-relaxed">{unit.description || "No description provided."}</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAmenitiesOpen} onOpenChange={setIsAmenitiesOpen}>
              <DialogTrigger render={
                <Button variant="outline" size="sm" disabled={isArchived}>
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Amenities
                </Button>
              } />
              <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="pt-4">
                  <AmenityToggleGrid 
                    initialAmenities={unit.amenities?.map(a => ({ id: a.amenity.id, name: a.amenity.name })) || []}
                    amenityType="UNIT,COMMON"
                    onSave={async (amenityIds) => {
                      const res = await setUnitAmenities(unit.id, amenityIds);
                      if (res.success) {
                        setIsAmenitiesOpen(false);
                        onUnitUpdated();
                      }
                      return res as any;
                    }}
                  />
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger render={
                <Button variant="outline" size="sm" disabled={isArchived}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Info
                </Button>
              } />
              <DialogContent className="sm:max-w-[500px]">
                <UnitForm 
                  initialData={unit} 
                  onSubmit={handleEditSubmit} 
                  onCancel={() => setIsEditOpen(false)} 
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="pt-2">
          <h5 className="font-medium text-sm text-foreground mb-3">Pricing Configurations</h5>
          <PricingTable unit={unit} onPricingUpdated={onUnitUpdated} disabled={isArchived} />
        </div>

        <DangerZone
          isUnit
          isArchived={isArchived}
          onArchive={handleSoftDelete}
          onRestore={() => {
            toast.error("Restore functionality not available for units in API yet.");
          }}
          title="Remove Unit"
          archiveDescription="Removing this unit will hide it from active listings. Historical data (leases, requests) will be preserved."
          restoreDescription="Restoring this unit will make it active again."
        />
      </AccordionContent>
    </AccordionItem>
  );
}
