"use client";

import React, { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils/shadcnUtils";
import { useSavedProperties } from "@/hooks/useSavedProperties";
import { useUserRole } from "@/hooks/useUserRole";
import { PropertyItem } from "@/service/getProperties";
import { toast } from "sonner";

interface FavoriteButtonProps {
  property: PropertyItem;
  className?: string;
}

export function FavoriteButton({
  property,
  className,
}: FavoriteButtonProps) {
  const { isSaved, toggleSave } = useSavedProperties();
  const { role, loading: roleLoading } = useUserRole();
  const saved = isSaved(property.id);
  const [loading, setLoading] = useState(false);

  // Hide the button completely if the user is not a TENANT or not authenticated.
  // While loading, we hide it to prevent UI flashing for non-tenants.
  if (roleLoading || role !== "TENANT") {
    return null;
  }

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (loading) return;
    setLoading(true);
    try {
      if (role !== "TENANT") {
        toast.error("Only tenants can save properties.");
        return;
      }
      toggleSave(property);
      toast.success(saved ? "Removed from saved properties." : "Property saved successfully!");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      aria-label={saved ? "Remove from saved" : "Save property"}
      className={cn(
        "size-8 rounded-full bg-background/60 hover:bg-background backdrop-blur-md flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-105 active:scale-95 disabled:opacity-50",
        className
      )}
    >
      <Heart
        className={cn(
          "size-4 transition-colors duration-200",
          saved ? "text-primary fill-primary" : "text-foreground"
        )}
      />
    </button>
  );
}

export default FavoriteButton;
