"use client";

import React, { useState } from "react";
import { PropertyImage } from "@/components/shared/PropertyImage";
import { PropertyImage as PropertyImageType } from "@/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Grid, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/shadcnUtils";

interface PropertyDetailsGalleryProps {
  images: PropertyImageType[];
}

function renderGalleryImage(url: string, alt: string, priority = false) {
  return (
    <PropertyImage
      src={url}
      alt={alt}
      preload={priority}
      sizes="(max-width: 768px) 100vw, 50vw"
      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 transform-gpu"
    />
  );
}

export function PropertyDetailsGallery({ images }: PropertyDetailsGalleryProps) {
  const [showAll, setShowAll] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden bg-muted">
        <PropertyImage alt="No images available" fallbackLabel="No Images Available" />
      </div>
    );
  }

  const coverImage = images.find((i) => i.isCover) || images[0];
  const otherImages = images.filter((i) => i.id !== coverImage.id).slice(0, 4); // Show up to 4 more

  return (
    <>
      <div className="relative w-full rounded-2xl overflow-hidden group">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[300px] md:h-[450px]">
          {/* Main Cover Image */}
          <div
            className={cn(
              "relative overflow-hidden cursor-pointer bg-muted/40",
              otherImages.length > 0 ? "col-span-1 md:col-span-2" : "col-span-1 md:col-span-4"
            )}
            onClick={() => setShowAll(true)}
          >
            {renderGalleryImage(coverImage.url, "Cover Image", true)}
          </div>

          {/* Grid of smaller images */}
          {otherImages.length > 0 && (
            <div className="hidden md:grid col-span-2 grid-cols-2 grid-rows-2 gap-2">
              {otherImages.map((img, idx) => (
                <div
                  key={img.id || idx}
                  className="relative overflow-hidden cursor-pointer bg-muted/40"
                  onClick={() => setShowAll(true)}
                >
                  {renderGalleryImage(img.url, `Property photo ${idx + 2}`)}
                </div>
              ))}
            </div>
          )}
        </div>

        {images.length > 5 && (
          <Button
            variant="secondary"
            className="absolute bottom-4 right-4 gap-2 bg-background/90 hover:bg-background backdrop-blur-sm shadow-md"
            onClick={() => setShowAll(true)}
          >
            <Grid className="size-4" />
            Show all {images.length} photos
          </Button>
        )}
      </div>

      {/* Fullscreen Gallery Dialog */}
      <Dialog open={showAll} onOpenChange={setShowAll}>
        <DialogContent className="max-w-[95vw] h-[95vh] p-0 overflow-hidden bg-black/95 border-none">
          <div className="absolute top-4 right-4 z-50">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-full"
              onClick={() => setShowAll(false)}
            >
              <X className="size-6" />
            </Button>
          </div>

          <div className="w-full h-full overflow-y-auto p-4 md:p-20 space-y-4">
            <div className="max-w-4xl mx-auto space-y-4">
              {images.map((img, idx) => (
                <div key={img.id || idx} className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted/10">
                  <PropertyImage
                    src={img.url}
                    alt={img.caption || `Gallery photo ${idx + 1}`}
                    fit="contain"
                    sizes="90vw"
                    fallbackLabel={img.caption || `Photo ${idx + 1}`}
                  />
                  {img.caption && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-1.5 rounded-full text-sm backdrop-blur-md">
                      {img.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PropertyDetailsGallery;
