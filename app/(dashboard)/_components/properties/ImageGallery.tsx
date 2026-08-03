"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { PropertyImage } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, X, Star, Image as ImageIcon, Loader2 } from "lucide-react";
import { deletePropertyImage, uploadPropertyImage, getImgbbApiKey, updatePropertyImage } from "@/app/(dashboard)/_actions/propertyImagesActions";
import { toast } from "sonner";

function CaptionInput({ image, onUpdate, disabled }: { image: PropertyImage, onUpdate: (id: string, caption: string) => void, disabled: boolean }) {
  const [value, setValue] = useState(image.caption || "");
  
  useEffect(() => {
    setValue(image.caption || "");
  }, [image.caption]);

  return (
    <div className="p-2 border-t bg-card group-hover:bg-muted/30 transition-colors">
      <Input 
        placeholder="Add a caption..." 
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="h-8 text-xs focus-visible:ring-1"
        onBlur={() => {
          if (value !== (image.caption || "")) {
            onUpdate(image.id, value);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.currentTarget.blur();
          }
        }}
        disabled={disabled}
      />
    </div>
  );
}

interface ImageGalleryProps {
  propertyId: string;
  images: PropertyImage[];
  onImagesUpdated: () => void;
}

export function ImageGallery({ propertyId, images, onImagesUpdated }: ImageGalleryProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const apiKey = await getImgbbApiKey();
      if (!apiKey) throw new Error("ImgBB API key not configured");

      const imgbbFormData = new FormData();
      imgbbFormData.append("image", file);

      const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: imgbbFormData,
      });

      const imgbbData = await imgbbRes.json();
      if (!imgbbData.success) {
        throw new Error(imgbbData.error?.message || "Failed to upload to ImgBB");
      }

      const url = imgbbData.data.url;
      const deleteUrl = imgbbData.data.delete_url || url;

      const res = await uploadPropertyImage(propertyId, url, deleteUrl, images.length === 0);
      if (res.success) {
        toast.success("Image uploaded");
        onImagesUpdated();
      } else {
        toast.error(res.error || "Failed to upload image");
      }
    } catch (error) {
      toast.error("An error occurred during upload");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (image: PropertyImage) => {
    setDeletingId(image.id);
    try {
      // 1. Delete from backend
      const res = await deletePropertyImage(image.id);
      if (res.success) {
        toast.success("Image deleted");
        onImagesUpdated();
      } else {
        toast.error(res.error || "Failed to delete image");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetCover = async (imageId: string) => {
    setUpdatingId(imageId);
    const res = await updatePropertyImage(imageId, { isCover: true });
    if (res.success) {
      toast.success("Cover image set successfully.");
      onImagesUpdated();
    } else {
      toast.error(res.error || "Failed to set cover image");
    }
    setUpdatingId(null);
  };

  const handleUpdateCaption = async (imageId: string, caption: string) => {
    setUpdatingId(imageId);
    const res = await updatePropertyImage(imageId, { caption });
    if (res.success) {
      toast.success("Caption updated");
      onImagesUpdated();
    } else {
      toast.error(res.error || "Failed to update caption");
    }
    setUpdatingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Property Images</h3>
          <p className="text-sm text-muted-foreground">Manage the photos for your listing. The cover image will be displayed first.</p>
        </div>
        <div>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleUpload}
            disabled={isUploading}
          />
          <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            Upload Image
          </Button>
        </div>
      </div>

      {images.length === 0 ? (
        <div 
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors group"
        >
          <ImageIcon className="h-10 w-10 text-muted-foreground mb-4 group-hover:text-primary transition-colors" />
          <p className="font-medium group-hover:text-primary transition-colors">No images uploaded yet</p>
          <p className="text-sm text-muted-foreground mb-4 text-center max-w-sm">
            Upload high-quality photos of your property. Properties with more photos generally receive more inquiries.
          </p>
          <Button variant="outline" disabled={isUploading} className="pointer-events-none">
            Select a file
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <Card key={img.id} className={`overflow-hidden relative group ${img.isCover ? 'ring-2 ring-primary shadow-md' : ''}`}>
              <div className="aspect-square relative bg-muted overflow-hidden">
                <Image 
                  src={img.url} 
                  alt={img.caption || "Property image"} 
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {img.isCover && (
                  <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded font-medium flex items-center gap-1 shadow-sm">
                    <Star className="h-3 w-3 fill-current" /> Cover
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-[2px]">
                  {!img.isCover && (
                    <Button size="sm" variant="secondary" className="h-8 text-xs cursor-pointer hover:bg-white hover:text-black transition-colors" onClick={() => handleSetCover(img.id)} disabled={updatingId === img.id}>
                      Set Cover
                    </Button>
                  )}
                  <Button 
                    size="icon" 
                    variant="destructive" 
                    className="h-8 w-8 cursor-pointer hover:bg-red-600 transition-colors" 
                    onClick={() => handleDelete(img)}
                    disabled={deletingId === img.id}
                  >
                    {deletingId === img.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <CaptionInput 
                image={img} 
                onUpdate={handleUpdateCaption} 
                disabled={updatingId === img.id} 
              />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

