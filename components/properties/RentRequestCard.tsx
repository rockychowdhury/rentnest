"use client";

import React, { useState, useEffect } from "react";
import { User, Property, PropertyUnit, Pricing } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils/shadcnUtils";
import { createRentalRequest } from "@/app/(dashboard)/_actions/rentRequestActions";
import { getPricingsByUnit } from "@/app/(dashboard)/_actions/pricingActions";
import { rentalRequestSchema } from "@/lib/validators/forms.validator";
import { toast } from "sonner";
import { Loader2, ShieldCheck, Clock, Zap, Calendar as CalendarIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface RentRequestCardProps {
  property: Property;
  user: User | null;
}

export function RentRequestCard({ property, user }: RentRequestCardProps) {
  const router = useRouter();
  const availableUnits = property.units?.filter((u) => u.status === "AVAILABLE") || [];

  const [selectedUnitId, setSelectedUnitId] = useState<string>("");
  const [selectedPricingId, setSelectedPricingId] = useState<string>("");
  const [activePricings, setActivePricings] = useState<Pricing[]>([]);
  const [isLoadingPricing, setIsLoadingPricing] = useState(false);
  
  const [moveInDate, setMoveInDate] = useState<Date | undefined>(undefined);
  const [duration, setDuration] = useState<string>("12");
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch pricings when unit changes
  useEffect(() => {
    if (!selectedUnitId) {
      setActivePricings([]);
      setSelectedPricingId("");
      return;
    }

    const fetchPricing = async () => {
      setIsLoadingPricing(true);
      const res = await getPricingsByUnit(selectedUnitId);
      if (res.success && res.data) {
        const active = res.data.filter((p) => p.isActive);
        setActivePricings(active);
        // Auto-select if there's only one pricing
        if (active.length === 1) {
          setSelectedPricingId(active[0].id);
        } else {
          setSelectedPricingId("");
        }
      }
      setIsLoadingPricing(false);
    };

    fetchPricing();
  }, [selectedUnitId]);

  const selectedUnit = availableUnits.find((u) => u.id === selectedUnitId);
  const selectedPricing = activePricings.find(p => p.id === selectedPricingId);
  const durationUnit = selectedPricing 
    ? (selectedPricing.rentType === 'YEARLY' ? 'Years' 
       : selectedPricing.rentType === 'MONTHLY' ? 'Months' 
       : selectedPricing.rentType === 'WEEKLY' ? 'Weeks' 
       : selectedPricing.rentType === 'DAILY' ? 'Days' 
       : selectedPricing.rentType === 'HOURLY' ? 'Hours' : 'Duration')
    : 'Duration';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const rawPayload = {
      propertyUnitId: selectedUnitId,
      pricingId: selectedPricingId,
      moveInDate: moveInDate ? moveInDate.toISOString() : "",
      duration: Number(duration),
      message,
    };

    const validation = rentalRequestSchema.safeParse(rawPayload);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Validation failed";
      toast.error(firstError);
      return;
    }

    setIsSubmitting(true);
    const res = await createRentalRequest(validation.data);
    setIsSubmitting(false);

    if (res.success) {
      toast.success("Rent request submitted successfully!");
      router.push("/tenant-dashboard/applications");
    } else {
      toast.error(res.error || "Failed to submit rent request.");
    }
  };

  // Unauthenticated View - Branding CTA
  if (!user) {
    return (
      <Card className="sticky top-24 border-primary/20 shadow-xl overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent z-0" />
        <CardHeader className="relative z-10 text-center pb-2">
          <CardTitle className="text-2xl font-heading font-bold text-foreground">
            Interested in this property?
          </CardTitle>
          <CardDescription className="text-sm">
            Join RentNest to securely contact the landlord and send a verified rent request.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 space-y-6 pt-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <ShieldCheck className="size-5 text-primary shrink-0" />
              <span>Verified landlords and 100% secure platform</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Zap className="size-5 text-primary shrink-0" />
              <span>Instant notifications when approved</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Clock className="size-5 text-primary shrink-0" />
              <span>Faster application processing</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 pt-2">
            <Link href="/login" className="w-full">
              <Button className="w-full h-11 text-base font-semibold shadow-md group-hover:shadow-lg transition-all" size="lg">
                Log in to request
              </Button>
            </Link>
            <p className="text-xs text-center text-muted-foreground">
              Don't have an account? <Link href="/register" className="text-primary font-semibold hover:underline">Sign up for free</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If authenticated but not a TENANT (e.g., LANDLORD or ADMIN viewing the page)
  if (user.role !== "TENANT") {
    return (
      <Card className="sticky top-24 border-border shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-heading">Rent Request</CardTitle>
          <CardDescription>
            You are logged in as a {user.role.toLowerCase()}. Only tenants can submit rent requests.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Tenant View - Rent Request Form
  return (
    <Card className="sticky top-24 border-primary/20 shadow-xl">
      <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
        <CardTitle className="text-xl font-heading font-bold">Request to Rent</CardTitle>
        <CardDescription>
          Submit a request to the landlord. You won't be charged yet.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {availableUnits.length === 0 ? (
          <div className="text-center py-6 space-y-2">
            <p className="font-semibold text-foreground">No units available</p>
            <p className="text-sm text-muted-foreground">Check back later or contact the landlord.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Unit Selection */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Select Unit <span className="text-destructive">*</span></Label>
                <Select 
                  value={selectedUnitId} 
                  onValueChange={(val) => {
                    setSelectedUnitId(val || "");
                  }}
                >
                  <SelectTrigger className="w-full h-11 [&>span]:truncate">
                    <SelectValue placeholder="Choose a unit">
                      {selectedUnit ? (
                        <span className="truncate pr-2">
                          {selectedUnit.unitLabel} ({selectedUnit.bedrooms} Bed, {selectedUnit.bathrooms} Bath)
                        </span>
                      ) : null}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {availableUnits.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.unitLabel} ({u.bedrooms} Bed, {u.bathrooms} Bath)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Pricing Selection */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Select Rent Type <span className="text-destructive">*</span></Label>
                <Select value={selectedPricingId} onValueChange={(val) => setSelectedPricingId(val || "")} disabled={!selectedUnitId || isLoadingPricing || activePricings.length === 0}>
                  <SelectTrigger className="w-full h-11 [&>span]:truncate">
                    {isLoadingPricing ? (
                      <span className="flex items-center text-muted-foreground truncate pr-2"><Loader2 className="size-4 animate-spin mr-2"/> Loading...</span>
                    ) : (
                      <SelectValue placeholder="Choose pricing">
                        {selectedPricing ? (
                          <span className="truncate pr-2">
                            {selectedPricing.currency} {selectedPricing.rentAmount.toLocaleString()} / {selectedPricing.rentType.toLowerCase()}
                          </span>
                        ) : null}
                      </SelectValue>
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {activePricings.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.currency} {p.rentAmount.toLocaleString()} / {p.rentType.toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Move-in Date & Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Move-in Date <span className="text-destructive">*</span></Label>
                <Popover>
                  <PopoverTrigger
                    className={cn(
                      "inline-flex items-center rounded-md border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground w-full h-11 px-4 py-2 justify-start text-left font-normal text-sm transition-colors",
                      !moveInDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 size-4" />
                    {moveInDate ? format(moveInDate, "PPP") : <span>Pick a date</span>}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={moveInDate}
                      onSelect={setMoveInDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Duration ({durationUnit}) <span className="text-destructive">*</span></Label>
                <Input 
                  type="number" 
                  min={1} 
                  required 
                  value={duration} 
                  onChange={(e) => setDuration(e.target.value)}
                  className="h-11"
                />
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Message (Optional)</Label>
              <Textarea 
                placeholder="Hi, I'm interested in..." 
                className="resize-none h-24"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-11 text-base font-semibold shadow-md mt-2" 
              disabled={isSubmitting || !selectedUnitId || !selectedPricingId}
            >
              {isSubmitting ? (
                <Loader2 className="size-5 animate-spin mr-2" />
              ) : null}
              Send Request
            </Button>
            
            <p className="text-[10px] text-center text-muted-foreground mt-2">
              By clicking "Send Request", you agree to our Terms of Service.
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
