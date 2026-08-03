"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Address, Division, District, Upazila } from "@/types";
import { getDivisions, getDistricts, getUpazilas } from "@/app/(dashboard)/_actions/addressActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin, Navigation } from "lucide-react";
import { toast } from "sonner";

const preprocessOptionalNumber = z.preprocess((val) => {
  if (val === "" || val == null) return undefined;
  return Number(val);
}, z.number().optional());

const addressSchema = z.object({
  divisionId: z.coerce.string().min(1, "Division is required"),
  districtId: z.coerce.string().min(1, "District is required"),
  upazilaId: z.coerce.string().min(1, "Upazila is required"),
  buildingNo: z.string().optional(),
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
  };
  onSubmit: (data: AddressFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function AddressForm({ initialData, onSubmit, isLoading = false }: AddressFormProps) {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [upazilas, setUpazilas] = useState<Upazila[]>([]);
  
  const [loadingDivisions, setLoadingDivisions] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingUpazilas, setLoadingUpazilas] = useState(false);

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
      upazilaId: initialData?.upazilaId?.toString() || "",
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
    async function loadUpazilas() {
      if (!selectedDistrict) {
        setUpazilas([]);
        return;
      }
      setLoadingUpazilas(true);
      const res = await getUpazilas(selectedDistrict);
      if (res.success) setUpazilas(res.data);
      setLoadingUpazilas(false);
    }
    loadUpazilas();
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
      toast.success("Address saved successfully");
    } catch (error) {
      toast.error("Failed to save address");
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
              <Select 
                value={selectedDivision} 
                onValueChange={(val) => {
                  setValue("divisionId", val as string);
                  setValue("districtId", "");
                  setValue("upazilaId", "");
                }}
                disabled={loadingDivisions}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Division">
                    {selectedDivision ? divisions.find(d => d.id.toString() === selectedDivision)?.name : "Select Division"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {divisions.map((div) => (
                    <SelectItem key={div.id} value={div.id.toString()}>{div.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.divisionId && <p className="text-sm text-destructive">{errors.divisionId.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label>District</Label>
              <Select 
                value={selectedDistrict} 
                onValueChange={(val) => {
                  setValue("districtId", val as string);
                  setValue("upazilaId", "");
                }}
                disabled={!selectedDivision || loadingDistricts}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select District">
                    {selectedDistrict ? districts.find(d => d.id.toString() === selectedDistrict)?.name : "Select District"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {districts.map((dist) => (
                    <SelectItem key={dist.id} value={dist.id.toString()}>{dist.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.districtId && <p className="text-sm text-destructive">{errors.districtId.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label>Upazila</Label>
              <Select 
                value={watch("upazilaId")} 
                onValueChange={(val) => setValue("upazilaId", val as string)}
                disabled={!selectedDistrict || loadingUpazilas}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Upazila">
                    {watch("upazilaId") ? upazilas.find(u => u.id.toString() === watch("upazilaId"))?.name : "Select Upazila"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {upazilas.map((upa) => (
                    <SelectItem key={upa.id} value={upa.id.toString()}>{upa.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.upazilaId && <p className="text-sm text-destructive">{errors.upazilaId.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Street Address</Label>
              <Input {...register("streetAddress")} placeholder="123 Main St" />
              {errors.streetAddress && <p className="text-sm text-destructive">{errors.streetAddress.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Building / Flat Number (Optional)</Label>
              <Input {...register("buildingNo")} placeholder="Apt 4B" />
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
              {errors.postalCode && <p className="text-sm text-destructive">{errors.postalCode.message}</p>}
            </div>
          </div>

          <div className="space-y-2 border rounded-md p-4 bg-muted/50">
            <div className="flex items-center justify-between mb-2">
              <Label className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Map Pin (Optional)</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleGetLocation}>
                <Navigation className="h-4 w-4 mr-2" />
                Get Current Location
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Providing latitude and longitude helps tenants find your property on the map.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Latitude</Label>
                <Input type="number" step="0.00000001" {...register("latitude")} placeholder="23.8103" />
                {errors.latitude && <p className="text-sm text-destructive">{errors.latitude.message as string}</p>}
              </div>
              <div className="space-y-2">
                <Label>Longitude</Label>
                <Input type="number" step="0.00000001" {...register("longitude")} placeholder="90.4125" />
                {errors.longitude && <p className="text-sm text-destructive">{errors.longitude.message as string}</p>}
              </div>
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
