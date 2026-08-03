"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PropertyUnit, UnitStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";

const preprocessNumber = z.preprocess((val) => {
  if (val === "" || val == null) return undefined;
  return Number(val);
}, z.number());

const preprocessOptionalNumber = z.preprocess((val) => {
  if (val === "" || val == null) return undefined;
  return Number(val);
}, z.number().optional());

const unitSchema = z.object({
  unitLabel: z.string().min(1, "Unit label is required"),
  bedrooms: preprocessNumber.refine(val => val !== undefined && val >= 0, "Cannot be negative"),
  bathrooms: preprocessNumber.refine(val => val !== undefined && val >= 0, "Cannot be negative"),
  sizeSqft: preprocessOptionalNumber,
  floor: preprocessOptionalNumber,
  description: z.string().optional(),
  status: z.nativeEnum(UnitStatus),
});

type UnitFormValues = z.infer<typeof unitSchema>;

interface UnitFormProps {
  initialData?: Partial<PropertyUnit>;
  onSubmit: (data: Partial<PropertyUnit>) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function UnitForm({ initialData, onSubmit, onCancel, isLoading = false }: UnitFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UnitFormValues>({
    resolver: zodResolver(unitSchema) as any,
    defaultValues: {
      unitLabel: initialData?.unitLabel || "",
      bedrooms: initialData?.bedrooms ?? ("" as any),
      bathrooms: initialData?.bathrooms ?? ("" as any),
      sizeSqft: initialData?.sizeSqft ?? ("" as any),
      floor: initialData?.floor ?? ("" as any),
      description: initialData?.description || "",
      status: initialData?.status || UnitStatus.AVAILABLE,
    },
  });

  const handleFormSubmit = async (data: UnitFormValues) => {
    await onSubmit(data);
  };

  const isEdit = !!initialData?.id;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edit Unit" : "Add Unit"}</DialogTitle>
        <DialogDescription>
          {isEdit ? "Update the details for this property unit." : "Create a new unit for this property."}
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
        <div className="space-y-2">
          <Label>Unit Label / Number</Label>
          <Input {...register("unitLabel")} placeholder="e.g. Apt 101, Ground Floor" />
          {errors.unitLabel && <p className="text-sm text-destructive">{errors.unitLabel.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select 
            value={watch("status")} 
            onValueChange={(val) => setValue("status", val as UnitStatus)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status">
                {watch("status") === UnitStatus.AVAILABLE ? "Available" : 
                 watch("status") === UnitStatus.OCCUPIED ? "Occupied" : 
                 watch("status") === UnitStatus.MAINTENANCE ? "Maintenance" : "Status"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UnitStatus.AVAILABLE}>Available</SelectItem>
              <SelectItem value={UnitStatus.OCCUPIED}>Occupied</SelectItem>
              <SelectItem value={UnitStatus.MAINTENANCE}>Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Bedrooms</Label>
          <Input type="number" {...register("bedrooms")} />
          {errors.bedrooms && <p className="text-sm text-destructive">{errors.bedrooms.message as string}</p>}
        </div>

        <div className="space-y-2">
          <Label>Bathrooms</Label>
          <Input type="number" {...register("bathrooms")} />
          {errors.bathrooms && <p className="text-sm text-destructive">{errors.bathrooms.message as string}</p>}
        </div>

        <div className="space-y-2">
          <Label>Size (Sqft) - Optional</Label>
          <Input type="number" {...register("sizeSqft")} placeholder="e.g. 1200" />
          {errors.sizeSqft && <p className="text-sm text-destructive">{errors.sizeSqft.message as string}</p>}
        </div>

        <div className="space-y-2">
          <Label>Floor - Optional</Label>
          <Input type="number" {...register("floor")} placeholder="e.g. 2" />
          {errors.floor && <p className="text-sm text-destructive">{errors.floor.message as string}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Description - Optional</Label>
          <Textarea {...register("description")} placeholder="Describe the unit..." className="resize-none" />
        </div>
      </div>

      <DialogFooter>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" className="bg-primary hover:bg-primary-hover" disabled={isLoading}>
          {isLoading ? "Saving..." : isEdit ? "Save Changes" : "Create Unit"}
        </Button>
      </DialogFooter>
    </form>
  );
}
