import React from "react";
import { Zap, Droplets, BatteryCharging, MapPin } from "lucide-react";
import { cn } from "@/lib/utils/shadcnUtils";

const features = [
  {
    title: "Generator backup awareness",
    description: "Know before you move in whether backup power is included",
    icon: Zap,
    colorClass: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    glowClass: "bg-amber-500/20",
  },
  {
    title: "WASA water supply indicator",
    description: "Clear water-source info on every listing",
    icon: Droplets,
    colorClass: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    glowClass: "bg-blue-500/20",
    offset: true,
  },
  {
    title: "Load-shedding context",
    description: "Listings note typical outage patterns in the area",
    icon: BatteryCharging,
    colorClass: "text-destructive bg-destructive/10 border-destructive/20",
    glowClass: "bg-destructive/20",
  },
  {
    title: "Four-level location precision",
    description: "Search down to the Upazila, not just the city",
    icon: MapPin,
    colorClass: "text-primary bg-primary/10 border-primary/20",
    glowClass: "bg-primary/20",
    offset: true,
  }
];

export function FeatureRow() {
  return (
    <section className="py-24 bg-muted/20 border-y border-border/40 overflow-hidden relative">
      {/* Decorative background gradients */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
      
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
      
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold font-heading text-foreground tracking-tight drop-shadow-sm">
            Details that actually matter here
          </h2>
          <p className="mt-6 text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
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
                  "p-8 rounded-[2rem] bg-gradient-to-b from-card/80 to-card/20 backdrop-blur-3xl border border-border/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:shadow-2xl hover:-translate-y-2 hover:border-border/60 transition-all duration-500 relative group overflow-hidden",
                  feature.offset ? "lg:mt-12" : ""
                )}
              >
                {/* Subtle glowing orb that reveals on hover inside the card */}
                <div className={cn("absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 opacity-0 group-hover:opacity-25 transition-opacity duration-700 blur-[50px] rounded-full pointer-events-none", feature.glowClass)} />
                
                <div className={cn("relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border shadow-inner transition-transform group-hover:scale-110 group-hover:-rotate-3 duration-500", feature.colorClass)}>
                  <Icon className="size-6 drop-shadow-sm" />
                </div>
                
                <h3 className="relative z-10 text-xl font-bold text-foreground mb-3 leading-snug group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="relative z-10 text-muted-foreground text-sm font-medium leading-relaxed">
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
