"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Address, Division, District, Area } from "@/types";
import { getDivisions, getDistricts, getAreas } from "@/app/(dashboard)/_actions/addressActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin, Navigation, CheckCircle2, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils/shadcnUtils";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

const LocationPickerMap = dynamic(
  () => import('./LocationPickerMap'),
  { 
    ssr: false, 
    loading: () => <Skeleton className="h-[400px] w-full rounded-md" /> 
  }
);

const preprocessOptionalNumber = z.preprocess((val) => {
  if (val === "" || val == null) return undefined;
  return Number(val);
}, z.number().optional());

const addressSchema = z.object({
  divisionId: z.coerce.string().min(1, "Division is required"),
  districtId: z.coerce.string().min(1, "District is required"),
  areaId: z.coerce.number().int().positive("Area is required"),
  buildingNo: z.string().min(1, "Building number/name is required"),
  streetAddress: z.string().min(1, "Street Address is required"),
  addressLine2: z.string().optional(),
  landmark: z.string().optional(),
  postalCode: z.string().min(1, "Postal Code is required"),
  latitude: preprocessOptionalNumber,
  longitude: preprocessOptionalNumber,
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressFormProps {
  initialData?: Partial<Address> & {
    divisionId?: string;
    districtId?: string;
    areaId?: number;
  };
  onSubmit: (data: AddressFormValues) => Promise<void>;
  isLoading?: boolean;
}

interface SearchableSelectProps {
  value?: string | number;
  options: { id: string | number; name: string }[];
  placeholder: string;
  searchPlaceholder: string;
  emptyMessage: string;
  disabled?: boolean;
  onSelect: (value: string | number) => void;
}

function SearchableSelect({
  value,
  options,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  disabled,
  onSelect,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.id.toString() === value?.toString());

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between font-normal",
              !value && "text-muted-foreground"
            )}
          />
        }
      >
        <span className="truncate">{selectedOption ? selectedOption.name : placeholder}</span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.name}
                  onSelect={() => {
                    onSelect(option.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value?.toString() === option.id.toString() ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function AddressForm({ initialData, onSubmit, isLoading = false }: AddressFormProps) {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  
  const [loadingDivisions, setLoadingDivisions] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  
  const [mapOpen, setMapOpen] = useState(false);
  const [tempLat, setTempLat] = useState<number | undefined>(undefined);
  const [tempLng, setTempLng] = useState<number | undefined>(undefined);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema) as any,
    defaultValues: {
      divisionId: initialData?.divisionId?.toString() || "",
      districtId: initialData?.districtId?.toString() || "",
      areaId: initialData?.areaId || undefined,
      buildingNo: initialData?.buildingNo || "",
      streetAddress: initialData?.streetAddress || "",
      addressLine2: initialData?.addressLine2 || "",
      landmark: initialData?.landmark || "",
      postalCode: initialData?.postalCode || "",
      latitude: initialData?.latitude != null ? Number(initialData.latitude) : undefined,
      longitude: initialData?.longitude != null ? Number(initialData.longitude) : undefined,
    },
  });

  const selectedDivision = watch("divisionId");
  const selectedDistrict = watch("districtId");

  useEffect(() => {
    async function loadDivisions() {
      setLoadingDivisions(true);
      const res = await getDivisions();
      if (res.success) setDivisions(res.data);
      setLoadingDivisions(false);
    }
    loadDivisions();
  }, []);

  useEffect(() => {
    async function loadDistricts() {
      if (!selectedDivision) {
        setDistricts([]);
        return;
      }
      setLoadingDistricts(true);
      const res = await getDistricts(selectedDivision);
      if (res.success) setDistricts(res.data);
      setLoadingDistricts(false);
    }
    loadDistricts();
  }, [selectedDivision]);

  useEffect(() => {
    async function loadAreas() {
      if (!selectedDistrict) {
        setAreas([]);
        return;
      }
      setLoadingAreas(true);
      const res = await getAreas(selectedDistrict);
      if (res.success) setAreas(res.data);
      setLoadingAreas(false);
    }
    loadAreas();
  }, [selectedDistrict]);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue("latitude", parseFloat(position.coords.latitude.toFixed(8)), { shouldValidate: true });
          setValue("longitude", parseFloat(position.coords.longitude.toFixed(8)), { shouldValidate: true });
          toast.success("Location updated successfully!");
        },
        (error) => {
          toast.error("Failed to get location: " + error.message);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  const handleFormSubmit = async (data: AddressFormValues) => {
    try {
      await onSubmit(data);
      // toast.success("Address saved successfully"); // Handled in parent
    } catch (error: any) {
      // Error toast is also handled in parent, or we can use error.message
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Address</CardTitle>
        <CardDescription>Manage the physical location of your property.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Division</Label>
              <SearchableSelect
                value={selectedDivision}
                options={divisions}
                placeholder="Select Division"
                searchPlaceholder="Search division..."
                emptyMessage="No division found."
                disabled={loadingDivisions}
                onSelect={(val) => {
                  setValue("divisionId", val.toString());
                  setValue("districtId", "");
                  setValue("areaId", 0);
                }}
              />
              <div className="min-h-[20px]">
                {errors.divisionId && <p className="text-sm text-destructive">{errors.divisionId.message}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>District</Label>
              <SearchableSelect
                value={selectedDistrict}
                options={districts}
                placeholder="Select District"
                searchPlaceholder="Search district..."
                emptyMessage="No district found."
                disabled={!selectedDivision || loadingDistricts}
                onSelect={(val) => {
                  setValue("districtId", val.toString());
                  setValue("areaId", 0);
                }}
              />
              <div className="min-h-[20px]">
                {errors.districtId && <p className="text-sm text-destructive">{errors.districtId.message}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Area</Label>
              <SearchableSelect
                value={watch("areaId")}
                options={areas}
                placeholder="Select Area"
                searchPlaceholder="Search area..."
                emptyMessage="No area found."
                disabled={!selectedDistrict || loadingAreas}
                onSelect={(val) => setValue("areaId", Number(val))}
              />
              <div className="min-h-[20px]">
                {errors.areaId && <p className="text-sm text-destructive">{errors.areaId.message}</p>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Street Address</Label>
              <Input {...register("streetAddress")} placeholder="123 Main St" />
              <div className="min-h-[20px]">
                {errors.streetAddress && <p className="text-sm text-destructive">{errors.streetAddress.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Building / Flat Number</Label>
              <Input {...register("buildingNo")} placeholder="Apt 4B" />
              <div className="min-h-[20px]">
                {errors.buildingNo && <p className="text-sm text-destructive">{errors.buildingNo.message}</p>}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Address Line 2 (Optional)</Label>
              <Input {...register("addressLine2")} placeholder="Block C, Section 10" />
            </div>
            <div className="space-y-2">
              <Label>Landmark (Optional)</Label>
              <Input {...register("landmark")} placeholder="Near Central Park" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Postal Code</Label>
              <Input {...register("postalCode")} placeholder="1200" />
              <div className="min-h-[20px]">
                {errors.postalCode && <p className="text-sm text-destructive">{errors.postalCode.message}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-4 border rounded-md p-4 bg-muted/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <Label className="flex items-center gap-2 text-base"><MapPin className="h-4 w-4 text-primary" /> Pinpoint Location</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Visually select your exact building on the map.
                </p>
                {(watch("latitude") && watch("longitude")) && (
                  <p className="text-sm font-medium text-emerald-600 mt-2 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Location Selected: {watch("latitude")}, {watch("longitude")}
                  </p>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                <Button type="button" variant="outline" size="sm" onClick={handleGetLocation}>
                  <Navigation className="h-4 w-4 mr-2" />
                  Auto-Detect
                </Button>
                
                <Dialog open={mapOpen} onOpenChange={setMapOpen}>
                  <DialogTrigger 
                    render={
                      <Button 
                        type="button" 
                        variant="default" 
                        size="sm"
                        onClick={() => {
                          setTempLat(watch("latitude"));
                          setTempLng(watch("longitude"));
                        }}
                      />
                    }
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Open Map
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[700px] h-[600px] flex flex-col p-4">
                    <DialogHeader>
                      <DialogTitle>Pinpoint on Map</DialogTitle>
                      <DialogDescription>
                        Search for an area or building, or drag the marker to your exact location.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 rounded-md overflow-hidden min-h-[300px]">
                      {mapOpen && (
                        <LocationPickerMap 
                          initialLat={tempLat} 
                          initialLng={tempLng} 
                          onLocationChange={(lat, lng) => {
                            setTempLat(lat);
                            setTempLng(lng);
                          }}
                        />
                      )}
                    </div>
                    <DialogFooter className="mt-4">
                      <Button type="button" variant="outline" onClick={() => setMapOpen(false)}>Cancel</Button>
                      <Button 
                        type="button" 
                        onClick={() => {
                          if (tempLat !== undefined && tempLng !== undefined) {
                            setValue("latitude", parseFloat(tempLat.toFixed(8)), { shouldValidate: true });
                            setValue("longitude", parseFloat(tempLng.toFixed(8)), { shouldValidate: true });
                            setMapOpen(false);
                          } else {
                            toast.error("Please select a location on the map first");
                          }
                        }}
                      >
                        Confirm Location
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            {/* Hidden inputs to keep react-hook-form bindings active but UI clean */}
            <div className="hidden">
              <Input type="number" step="0.00000001" {...register("latitude")} />
              <Input type="number" step="0.00000001" {...register("longitude")} />
            </div>
            <div className="min-h-[28px]">
              {(errors.latitude || errors.longitude) && (
                <p className="text-sm text-destructive mt-2">Please select a valid location on the map.</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary-hover">
            {isLoading ? "Saving..." : "Save Address"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
