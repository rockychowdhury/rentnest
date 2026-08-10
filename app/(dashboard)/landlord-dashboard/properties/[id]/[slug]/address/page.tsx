"use client";

import { useEffect, useState, use } from "react";
import { Property } from "@/types";
import { updateProperty } from "@/app/(dashboard)/_actions/propertiesActions";
import { AddressForm } from "@/app/(dashboard)/_components/properties/AddressForm";
import { usePropertyContext } from "@/app/(dashboard)/_components/properties/PropertyProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { fetchApi } from "@/lib/api";

export default function PropertyAddressPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const { property, setProperty } = usePropertyContext();
  const [isSaving, setIsSaving] = useState(false);

  const handleAddressSubmit = async (addressData: any) => {
    setIsSaving(true);
    try {
      const formattedAddress = {
        buildingNo: addressData.buildingNo,
        streetAddress: addressData.streetAddress,
        addressLine2: addressData.addressLine2,
        landmark: addressData.landmark,
        postalCode: addressData.postalCode,
        areaId: parseInt(addressData.areaId, 10),
        latitude: addressData.latitude !== undefined ? parseFloat(Number(addressData.latitude).toFixed(8)) : undefined,
        longitude: addressData.longitude !== undefined ? parseFloat(Number(addressData.longitude).toFixed(8)) : undefined
      };

      const result = await updateProperty(params.id, { address: formattedAddress } as any);
      
      if (result.success && result.data) {
        toast.success("Address saved successfully");
        setProperty(result.data);
      } else {
        throw new Error(result.error || "Unknown error");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to save address");
    } finally {
      setIsSaving(false);
    }
  };

  if (!property) return null;

  return (
    <div className="animate-in fade-in-50 duration-300">
      <AddressForm 
        initialData={{
          ...property.address,
          latitude: property.address?.latitude != null ? Number(property.address.latitude) : undefined,
          longitude: property.address?.longitude != null ? Number(property.address.longitude) : undefined,
          divisionId: property.address?.area?.district?.divisionId?.toString(),
          districtId: property.address?.area?.districtId?.toString(),
        }}
        onSubmit={handleAddressSubmit} 
        isLoading={isSaving}
      />
    </div>
  );
}
