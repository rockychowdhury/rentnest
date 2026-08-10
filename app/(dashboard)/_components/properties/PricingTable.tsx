"use client";

import { useState } from "react";
import { PropertyUnit, Pricing, RentType } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PricingFormRow } from "./PricingFormRow";
import { createPricing, updatePricing, deletePricing } from "@/app/(dashboard)/_actions/pricingActions";
import { toast } from "sonner";

interface PricingTableProps {
  unit: PropertyUnit;
  onPricingUpdated: () => void;
  disabled?: boolean;
}

export function PricingTable({ unit, onPricingUpdated, disabled }: PricingTableProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const existingRentTypes = unit.pricing?.map(p => p.rentType) || [];
  
  const availableRentTypes = Object.values(RentType).filter(
    (rt) => !existingRentTypes.includes(rt as RentType)
  );

  const handleAddSubmit = async (data: Partial<Pricing>) => {
    const res = await createPricing(unit.id, data);
    if (res.success) {
      toast.success("Pricing added");
      setIsAddOpen(false);
      onPricingUpdated();
    } else {
      toast.error(res.error || "Failed to add pricing");
    }
  };

  const handleEditSubmit = async (id: string, data: Partial<Pricing>) => {
    const res = await updatePricing(id, data);
    if (res.success) {
      toast.success("Pricing updated");
      onPricingUpdated();
    } else {
      toast.error(res.error || "Failed to update pricing");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await deletePricing(id);
    if (res.success) {
      toast.success("Pricing removed");
      onPricingUpdated();
    } else {
      toast.error(res.error || "Failed to remove pricing");
    }
  };

  return (
    <div className="space-y-4">
      {unit.pricing && unit.pricing.length > 0 ? (
        <div className="border rounded-md divide-y">
          {unit.pricing.map((price) => (
            <PricingFormRow 
              key={price.id} 
              pricing={price} 
              onSave={(data: Partial<Pricing>) => handleEditSubmit(price.id, data)}
              onDelete={() => handleDelete(price.id)}
              disabled={disabled}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-6 border rounded-md border-dashed text-muted-foreground bg-muted/10">
          <p className="text-sm mb-3">No pricing set for this unit yet</p>
          {!disabled && (
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger render={
                <Button variant="default" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Pricing
                </Button>
              } />
              <DialogContent>
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-4">Add New Pricing Option</h3>
                  <PricingFormRow 
                    availableTypes={availableRentTypes}
                    onSave={handleAddSubmit}
                    onCancel={() => setIsAddOpen(false)}
                    isCreate
                  />
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}

      {unit.pricing && unit.pricing.length > 0 && availableRentTypes.length > 0 && !disabled && (
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger render={
            <Button variant="default" size="sm" className="w-fit mt-2">
              <Plus className="h-4 w-4 mr-2" />
              Add Pricing
            </Button>
          } />
          <DialogContent>
            <div className="p-4">
              <h3 className="text-lg font-medium mb-4">Add New Pricing Option</h3>
              <PricingFormRow 
                availableTypes={availableRentTypes}
                onSave={handleAddSubmit}
                onCancel={() => setIsAddOpen(false)}
                isCreate
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
