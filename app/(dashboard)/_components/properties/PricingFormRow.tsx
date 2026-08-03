"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Pricing, RentType, Currency } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Save, X } from "lucide-react";
import { useState } from "react";

const preprocessNumber = z.preprocess((val) => {
  if (val === "" || val == null) return undefined;
  return Number(val);
}, z.number());

const preprocessOptionalNumber = z.preprocess((val) => {
  if (val === "" || val == null) return undefined;
  return Number(val);
}, z.number().optional());

const pricingSchema = z.object({
  rentType: z.nativeEnum(RentType),
  rentAmount: preprocessNumber.refine(val => val !== undefined && val >= 0, "Must be positive"),
  securityDeposit: preprocessOptionalNumber.refine(val => val === undefined || val >= 0, "Cannot be negative"),
  currency: z.nativeEnum(Currency),
  isActive: z.boolean(),
});

type PricingFormValues = z.infer<typeof pricingSchema>;

interface PricingFormRowProps {
  pricing?: Pricing;
  availableTypes?: RentType[];
  isCreate?: boolean;
  onSave: (data: Partial<Pricing>) => Promise<void>;
  onDelete?: () => Promise<void>;
  onCancel?: () => void;
  disabled?: boolean;
}

export function PricingFormRow({ 
  pricing, 
  availableTypes = [], 
  isCreate = false,
  onSave, 
  onDelete,
  onCancel,
  disabled 
}: PricingFormRowProps) {
  const [isEditing, setIsEditing] = useState(isCreate);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PricingFormValues>({
    resolver: zodResolver(pricingSchema) as any,
    defaultValues: {
      rentType: pricing?.rentType || availableTypes[0] || RentType.MONTHLY,
      rentAmount: pricing?.rentAmount ?? ("" as any),
      securityDeposit: pricing?.securityDeposit ?? ("" as any),
      currency: pricing?.currency as Currency || Currency.BDT,
      isActive: pricing?.isActive ?? true,
    },
  });

  const handleFormSubmit = async (data: PricingFormValues) => {
    setIsLoading(true);
    await onSave(data);
    setIsLoading(false);
    if (!isCreate) setIsEditing(false);
  };

  const activeRentType = watch("rentType");
  const isActive = watch("isActive");

  if (!isEditing) {
    return (
      <div className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${disabled ? 'opacity-60' : ''}`}>
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Type</p>
            <p className="font-medium">{pricing?.rentType}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Rent</p>
            <p className="font-medium">{pricing?.currency} {pricing?.rentAmount?.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Deposit</p>
            <p className="font-medium">{pricing?.securityDeposit ? `${pricing.currency} ${pricing.securityDeposit.toLocaleString()}` : "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Status</p>
            <p className={`font-medium ${pricing?.isActive ? 'text-success' : 'text-muted-foreground'}`}>
              {pricing?.isActive ? 'Active' : 'Inactive'}
            </p>
          </div>
        </div>
        {!disabled && (
          <div className="flex items-center justify-end gap-2 shrink-0">
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>Edit</Button>
            {onDelete && (
              <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={`p-4 border-l-2 border-primary bg-muted/30 space-y-4 ${isCreate ? 'border-none p-0 bg-transparent' : ''}`}>
      <div className={`grid grid-cols-1 gap-4 ${isCreate ? 'sm:grid-cols-2' : 'sm:grid-cols-2 md:grid-cols-4'}`}>
        <div className="space-y-2">
          <Label>Rent Type</Label>
          <Select 
            value={activeRentType} 
            onValueChange={(val) => setValue("rentType", val as RentType)}
            disabled={!isCreate}
          >
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(RentType).map(rt => <SelectItem key={rt} value={rt}>{rt}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Rent Amount</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center border-r border-input bg-muted rounded-l-md w-[72px]">
              <Select value={watch("currency")} onValueChange={(val) => setValue("currency", val as Currency)}>
                <SelectTrigger className="h-full border-none bg-transparent shadow-none focus:ring-0 focus:ring-offset-0 px-2 rounded-r-none rounded-l-md text-sm font-medium hover:bg-muted/80">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Currency).map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input 
              type="number" 
              className="pl-[80px]"
              {...register("rentAmount")} 
            />
          </div>
          {errors.rentAmount && <p className="text-xs text-destructive">{errors.rentAmount.message as string}</p>}
        </div>

        <div className="space-y-2">
          <Label>Deposit (Optional)</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center justify-center bg-muted border-r border-input rounded-l-md w-[72px]">
              <span className="text-sm text-muted-foreground font-medium">{watch("currency")}</span>
            </div>
            <Input 
              type="number" 
              className="pl-[80px]"
              {...register("securityDeposit")} 
            />
          </div>
          {errors.securityDeposit && <p className="text-xs text-destructive">{errors.securityDeposit.message as string}</p>}
        </div>

        <div className="space-y-2">
          <Label className="opacity-0 hidden sm:block">Status</Label>
          <div className="flex items-center space-x-3 h-10 px-1">
            <Switch 
              checked={isActive}
              onCheckedChange={(val) => setValue("isActive", val)}
            />
            <Label className="text-sm font-normal cursor-pointer">Offer Active</Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {(!isCreate || onCancel) && (
          <Button type="button" variant="ghost" size="sm" onClick={() => isCreate && onCancel ? onCancel() : setIsEditing(false)} disabled={isLoading}>
            <X className="h-4 w-4 mr-2" /> Cancel
          </Button>
        )}
        <Button type="submit" size="sm" className="bg-primary hover:bg-primary-hover" disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" /> {isCreate ? "Add Pricing" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
