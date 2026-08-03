"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FeatureImagePlaceholder } from "@/components/shared/FeatureImagePlaceholder";

interface OptimizedPropertyImageProps {
  src?: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  aspect?: "16/10" | "4/3" | "1/1" | "21/9" | "3/4";
}

export function OptimizedPropertyImage({
  src,
  alt,
  className = "w-full h-full object-cover",
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority = false,
  aspect = "4/3",
}: OptimizedPropertyImageProps) {
  const [error, setError] = useState(false);

  const isValidUrl = Boolean(
    src &&
      typeof src === "string" &&
      (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/"))
  );

  if (error || !isValidUrl) {
    return (
      <FeatureImagePlaceholder
        label={alt}
        aspect={aspect}
        className="w-full h-full object-cover"
      />
    );
  }

  return (
    <Image
      src={src!}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      onError={() => setError(true)}
      className={className}
    />
  );
}

export default OptimizedPropertyImage;
