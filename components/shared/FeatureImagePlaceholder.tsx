import React from "react";
import { cn } from "@/lib/utils/shadcnUtils";

interface FeatureImagePlaceholderProps {
  label: string;
  aspect?: "16/10" | "4/3" | "1/1" | "21/9" | "3/4";
  className?: string;
}

const aspectClasses: Record<NonNullable<FeatureImagePlaceholderProps["aspect"]>, string> = {
  "16/10": "aspect-[16/10]",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
  "21/9": "aspect-[21/9]",
  "3/4": "aspect-[3/4]",
};

export function FeatureImagePlaceholder({
  label,
  aspect = "16/10",
  className,
}: FeatureImagePlaceholderProps) {
  return (
    <div
      className={cn(
        "relative w-full rounded-2xl border-2 border-dashed border-border bg-muted/40 p-6 flex flex-col items-center justify-center text-center transition-colors hover:bg-muted/60 select-none overflow-hidden",
        aspectClasses[aspect],
        className
      )}
    >
      <div className="flex flex-col items-center justify-center gap-2 max-w-md px-4">
        <div className="size-10 rounded-full bg-muted flex items-center justify-center border border-border/60 text-muted-foreground shadow-xs">
          <svg
            className="size-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="text-xs sm:text-sm font-medium text-muted-foreground leading-relaxed">
          {label}
        </p>
      </div>
    </div>
  );
}

export default FeatureImagePlaceholder;
