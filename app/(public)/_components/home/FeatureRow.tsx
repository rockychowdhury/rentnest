import React from "react";
import { Zap, Droplets, BatteryCharging, MapPin } from "lucide-react";
import { cn } from "@/lib/utils/shadcnUtils";

const features = [
  {
    title: "Generator backup awareness",
    description: "Know before you move in whether backup power is included",
    icon: Zap,
    colorClass: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  },
  {
    title: "WASA water supply indicator",
    description: "Clear water-source info on every listing",
    icon: Droplets,
    colorClass: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    offset: true,
  },
  {
    title: "Load-shedding context",
    description: "Listings note typical outage patterns in the area",
    icon: BatteryCharging,
    colorClass: "text-destructive bg-destructive/10 border-destructive/20",
  },
  {
    title: "Four-level location precision",
    description: "Search down to the Upazila, not just the city",
    icon: MapPin,
    colorClass: "text-primary bg-primary/10 border-primary/20",
    offset: true,
  }
];

export function FeatureRow() {
  return (
    <section className="py-20 bg-muted/30 border-y border-border/50 overflow-hidden relative">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground tracking-tight">
            Details that actually matter here
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
            Built specifically for renting in Bangladesh. We focus on the things you actually need to know before signing a lease.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div 
                key={idx} 
                className={cn(
                  "p-8 rounded-3xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow relative group",
                  feature.offset ? "lg:mt-12" : ""
                )}
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border transition-transform group-hover:scale-110 duration-300", feature.colorClass)}>
                  <Icon className="size-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3 leading-snug">{feature.title}</h3>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  );
}
