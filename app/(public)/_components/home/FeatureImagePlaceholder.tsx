import React from "react";
import { cn } from "@/lib/utils/shadcnUtils";
import { ImageIcon } from "lucide-react";

interface FeatureImagePlaceholderProps {
  label: string;
  aspect: "21/9" | "16/10" | "4/3" | "1/1" | "3/4" | string;
  className?: string;
}

export function FeatureImagePlaceholder({
  label,
  aspect,
  className,
}: FeatureImagePlaceholderProps) {
  // Mapping standard aspect strings to Tailwind aspect classes or styles
  const aspectClass = {
    "21/9": "aspect-[21/9]",
    "16/10": "aspect-[16/10]",
    "4/3": "aspect-[4/3]",
    "1/1": "aspect-square",
    "3/4": "aspect-[3/4]",
  }[aspect] || `aspect-[${aspect}]`;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-6 text-center w-full h-full rounded-2xl overflow-hidden",
        "bg-primary/20 border-2 border-dashed border-primary/50 text-primary-foreground",
        "shadow-inner backdrop-blur-sm relative",
        aspectClass,
        className
      )}
      style={{ backgroundColor: "var(--primary)" }} // Ensuring a strong primary purple/brand color
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/60 z-0" />
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="p-3 bg-white/20 rounded-full backdrop-blur-md">
          <ImageIcon className="size-8 text-white" />
        </div>
        <p className="text-sm font-semibold tracking-wide text-white drop-shadow-md px-4">
          {label}
        </p>
        <p className="text-xs font-medium text-white/70 tracking-wider">
          {aspect}
        </p>
      </div>
    </div>
  );
}
