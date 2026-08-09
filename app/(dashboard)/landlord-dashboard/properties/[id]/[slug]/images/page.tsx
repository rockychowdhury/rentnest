"use client";

import { useEffect, useState, use } from "react";
import { PropertyImage } from "@/types";
import { getPropertyImages } from "@/app/(dashboard)/_actions/propertyImagesActions";
import { ImageGallery } from "@/app/(dashboard)/_components/properties/ImageGallery";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function PropertyImagesPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const [images, setImages] = useState<PropertyImage[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);

  const loadImages = async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefetching(true);
    const res = await getPropertyImages(params.id);
    if (res.success && res.data) {
      setImages(res.data);
    } else if (!silent) {
      toast.error("Failed to load property images");
    }
    if (!silent) setIsLoading(false);
    else setIsRefetching(false);
  };

  useEffect(() => {
    loadImages();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="aspect-square w-full rounded-md" />)}
        </div>
      </div>
    );
  }

  if (!images) return null;

  return (
    <div className="animate-in fade-in-50 duration-300">
      <ImageGallery 
        propertyId={params.id} 
        images={images} 
        isRefetching={isRefetching}
        onImagesUpdated={() => loadImages(true)}
      />
    </div>
  );
}
