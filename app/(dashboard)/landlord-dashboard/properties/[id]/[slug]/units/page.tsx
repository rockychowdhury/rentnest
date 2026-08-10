"use client";

import React, { useEffect, useState, use } from "react";
import { PropertyUnit } from "@/types";
import { getPropertyUnits, createPropertyUnit } from "@/app/(dashboard)/_actions/unitsActions";
import { usePropertyContext } from "@/app/(dashboard)/_components/properties/PropertyProvider";
import { UnitCard } from "@/app/(dashboard)/_components/properties/UnitCard";
import { UnitForm } from "@/app/(dashboard)/_components/properties/UnitForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Accordion } from "@/components/ui/accordion";
import { Plus, Layers, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function PropertyUnitsPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const { property, setProperty } = usePropertyContext();
  const [units, setUnits] = useState<PropertyUnit[]>(property.units || []);
  const [isRefetching, setIsRefetching] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  
  const isPropertyArchived = !!property.deletedAt;

  const loadData = async () => {
    setIsRefetching(true);
    
    const unitsRes = await getPropertyUnits(params.id);
    
    if (unitsRes.success) {
      setUnits(unitsRes.data);
      setProperty({ ...property, units: unitsRes.data });
    } else {
      toast.error("Failed to load units");
    }
    
    setIsRefetching(false);
  };

  const hasFetched = React.useRef(false);

  useEffect(() => {
    if (!hasFetched.current && (!property.units || property.units.length === 0)) {
      hasFetched.current = true;
      loadData();
    }
  }, [params.id]);

  const handleAddUnit = async (data: Partial<PropertyUnit>) => {
    setIsAdding(true);
    const res = await createPropertyUnit(params.id, data);
    if (res.success) {
      toast.success("Unit created successfully");
      setIsAddOpen(false);
      loadData();
    } else {
      toast.error(res.error || "Failed to create unit");
    }
    setIsAdding(false);
  };

  if (!property) return null;

  const activeUnits = units.filter(u => !u.deletedAt);
  const archivedUnits = units.filter(u => !!u.deletedAt);
  const displayUnits = showArchived ? [...activeUnits, ...archivedUnits] : activeUnits;

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold tracking-tight">Units & Pricing</h2>
            {isRefetching && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>
          <p className="text-sm text-muted-foreground">Manage individual units and their rental rates.</p>
        </div>
        
        {!isPropertyArchived && (
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger render={
              <Button className="bg-primary hover:bg-primary-hover">
                <Plus className="mr-2 h-4 w-4" />
                Add Unit
              </Button>
            } />
            <DialogContent className="sm:max-w-[500px]">
              <UnitForm 
                onSubmit={handleAddUnit} 
                onCancel={() => setIsAddOpen(false)} 
                isLoading={isAdding}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {activeUnits.length === 0 && !showArchived ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg bg-muted/20 text-center">
          <div className="bg-primary/10 p-3 rounded-full mb-4">
            <Layers className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">No active units</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            Add a unit to start renting this property. You'll be able to set pricing after creating a unit.
          </p>
          {!isPropertyArchived && (
            <Button onClick={() => setIsAddOpen(true)} className="bg-primary hover:bg-primary-hover">
              <Plus className="mr-2 h-4 w-4" />
              Add your first unit
            </Button>
          )}
        </div>
      ) : (
        <Accordion className="w-full">
          {displayUnits.map((unit) => (
            <UnitCard 
              key={unit.id} 
              unit={unit} 
              onUnitUpdated={loadData} 
            />
          ))}
        </Accordion>
      )}

      {archivedUnits.length > 0 && (
        <div className="flex items-center justify-end mt-6">
          <div className="flex items-center space-x-2">
            <Switch 
              id="show-removed" 
              checked={showArchived}
              onCheckedChange={setShowArchived}
            />
            <Label htmlFor="show-removed" className="text-sm text-muted-foreground font-normal">
              Show removed units ({archivedUnits.length})
            </Label>
          </div>
        </div>
      )}
    </div>
  );
}
