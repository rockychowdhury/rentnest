"use client";

import { useEffect, useState, use } from "react";
import { Property } from "@/types";
import { getPropertyById } from "@/app/(dashboard)/_actions/propertiesActions";
import { AddressForm } from "@/app/(dashboard)/_components/properties/AddressForm";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { fetchApi } from "@/lib/api";

export default function PropertyAddressPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadProperty = async () => {
      setIsLoading(true);
      const res = await getPropertyById(params.id);
      if (res.success && res.data) {
        setProperty(res.data);
      } else {
        toast.error("Failed to load property");
      }
      setIsLoading(false);
    };
    loadProperty();
  }, [params.id]);

  const handleAddressSubmit = async (addressData: any) => {
    setIsSaving(true);
    try {
      const formattedAddress = {
        buildingNo: addressData.buildingNo,
        streetAddress: addressData.streetAddress,
        addressLine2: addressData.addressLine2,
        landmark: addressData.landmark,
        postalCode: addressData.postalCode,
        upazilaId: parseInt(addressData.upazilaId, 10),
        latitude: addressData.latitude !== undefined ? parseFloat(Number(addressData.latitude).toFixed(8)) : undefined,
        longitude: addressData.longitude !== undefined ? parseFloat(Number(addressData.longitude).toFixed(8)) : undefined
      };

      const { updateProperty } = await import("@/app/(dashboard)/_actions/propertiesActions");
      const result = await updateProperty(params.id, { address: formattedAddress } as any);
      
      if (result.success) {
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Skeleton className="h-[500px] w-full rounded-lg" />;
  }

  if (!property) return null;

  return (
    <div className="animate-in fade-in-50 duration-300">
      <AddressForm 
        initialData={{
          ...property.address,
          latitude: property.address?.latitude != null ? Number(property.address.latitude) : undefined,
          longitude: property.address?.longitude != null ? Number(property.address.longitude) : undefined,
          divisionId: property.address?.upazila?.district?.divisionId?.toString(),
          districtId: property.address?.upazila?.districtId?.toString(),
        }}
        onSubmit={handleAddressSubmit} 
        isLoading={isSaving}
      />
    </div>
  );
}
