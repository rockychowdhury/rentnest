"use client";

import React, { useEffect, useState, use } from "react";
import { PropertyImage } from "@/types";
import { getPropertyImages } from "@/app/(dashboard)/_actions/propertyImagesActions";
import { ImageGallery } from "@/app/(dashboard)/_components/properties/ImageGallery";
import { usePropertyContext } from "@/app/(dashboard)/_components/properties/PropertyProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function PropertyImagesPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const { property, setProperty } = usePropertyContext();
  const [images, setImages] = useState<PropertyImage[]>(property.images || []);
  const [isRefetching, setIsRefetching] = useState(false);

  const loadImages = async () => {
    setIsRefetching(true);
    const res = await getPropertyImages(params.id);
    if (res.success && res.data) {
      setImages(res.data);
      setProperty({ ...property, images: res.data });
    } else {
      toast.error("Failed to load property images");
    }
    setIsRefetching(false);
  };

  const hasFetched = React.useRef(false);

  useEffect(() => {
    if (!hasFetched.current && (!property.images || property.images.length === 0)) {
      hasFetched.current = true;
      loadImages();
    }
  }, [params.id]);

  if (!property) return null;

  return (
    <div className="animate-in fade-in-50 duration-300">
      <ImageGallery 
        propertyId={params.id} 
        images={images} 
        isRefetching={isRefetching}
        onImagesUpdated={() => loadImages()}
      />
    </div>
  );
}
