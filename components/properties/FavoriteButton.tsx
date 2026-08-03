"use client";

import React, { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils/shadcnUtils";

interface FavoriteButtonProps {
  propertyId?: string;
  initialSaved?: boolean;
  className?: string;
}

export function FavoriteButton({
  propertyId,
  initialSaved = false,
  className,
}: FavoriteButtonProps) {
  const [isSaved, setIsSaved] = useState(initialSaved);

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved((prev) => !prev);
  };

  return (
    <button
      type="button"
      onClick={toggleSave}
      aria-label={isSaved ? "Remove from saved" : "Save property"}
      className={cn(
        "size-8 rounded-full bg-background/60 hover:bg-background backdrop-blur-md flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-105 active:scale-95",
        className
      )}
    >
      <Heart
        className={cn(
          "size-4 transition-colors duration-200",
          isSaved ? "text-primary fill-primary" : "text-foreground"
        )}
      />
    </button>
  );
}

export default FavoriteButton;
