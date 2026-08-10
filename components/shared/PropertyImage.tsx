"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils/shadcnUtils";

type AspectRatio = "16/10" | "4/3" | "1/1" | "21/9" | "3/4";

const aspectClasses: Record<AspectRatio, string> = {
  "16/10": "aspect-[16/10]",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
  "21/9": "aspect-[21/9]",
  "3/4": "aspect-[3/4]",
};

interface PropertyImageProps {
  src?: string | null;
  alt: string;
  fill?: boolean;
  sizes?: string;
  preload?: boolean;
  aspect?: AspectRatio;
  fit?: "cover" | "contain";
  className?: string;
  fallbackLabel?: string;
}

export function PropertyImage({
  src,
  alt,
  fill = true,
  sizes,
  preload = false,
  aspect,
  fit = "cover",
  className,
  fallbackLabel,
}: PropertyImageProps) {
  const [error, setError] = useState(false);

  const isUsableSrc =
    typeof src === "string" &&
    (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/"));

  const showImage = isUsableSrc && !error;

  if (!showImage) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "flex items-center justify-center gap-2 bg-muted text-muted-foreground overflow-hidden",
          fill && "absolute inset-0 size-full",
          aspect && aspectClasses[aspect],
          className
        )}
      >
        <svg
          className="size-6 shrink-0 opacity-70"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 16l4.586-4.586a2 2 0 0 1 2.828 0L15 16m-2-2l1.586-1.586a2 2 0 0 1 2.828 0L21 15M9 9h.01" />
        </svg>
        <span className="text-xs font-medium px-2 text-center line-clamp-2">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={preload ? "eager" : "lazy"}
      fetchPriority={preload ? "high" : "auto"}
      decoding="async"
      referrerPolicy="no-referrer"
      sizes={sizes}
      onError={() => setError(true)}
      className={cn(
        "object-cover",
        fit === "contain" && "object-contain",
        fill && "absolute inset-0 size-full",
        aspect && aspectClasses[aspect],
        className
      )}
    />
  );
}

export default PropertyImage;
