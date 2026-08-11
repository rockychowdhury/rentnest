import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PropertyCard } from "./PropertyCard";
import { DiscoveryRail } from "@/service/getDiscoveryRails";

interface PropertyRailProps {
  rail: DiscoveryRail;
}

export function PropertyRail({ rail }: PropertyRailProps) {
  if (!rail.items || rail.items.length === 0) return null;

  return (
    <section 
      className="space-y-4"
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 400px" }}
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground">
            {rail.title}
          </h2>
          {rail.subtext && (
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {rail.subtext}
            </p>
          )}
        </div>

        <Link
          href={`/properties?${rail.seeMoreQuery}`}
          className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 group shrink-0"
        >
          See more
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Horizontal Scroll-Snap Row with Smooth Scroll Hardware Acceleration */}
      <div 
        className="flex gap-5 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory transform-gpu"
        style={{ contain: "layout paint" }}
      >
        {rail.items.map((item) => (
          <PropertyCard key={item.id} property={item} layout="rail" />
        ))}
      </div>
    </section>
  );
}

export default PropertyRail;
