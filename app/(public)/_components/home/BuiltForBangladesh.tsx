import React from "react";
import { Zap, Droplets, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils/shadcnUtils";

export function BuiltForBangladesh() {
  const features = [
    {
      icon: Zap,
      title: "Generator Backup Awareness",
      desc: "Know before you move in whether backup power is included for lifts and lights.",
    },
    {
      icon: Droplets,
      title: "WASA Water Indicator",
      desc: "Clear water-source info (WASA, deep tube-well, line pressure) on every listing.",
    },
    {
      icon: Clock,
      title: "Load-Shedding Context",
      desc: "Listings note typical outage patterns and backup capabilities in the area.",
    },
    {
      icon: MapPin,
      title: "Four-Level Precision",
      desc: "Search down to the Upazila and Thana level, not just the general city.",
    },
  ];

  return (
    <section className="py-20 bg-muted/30 border-t border-border/50">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            Built for Bangladesh
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
            Details that actually matter here
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Standard rental portals miss local nuances. We highlight the practical factors that impact daily life.
          </p>
        </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {features.map((item, idx) => {
            const Icon = item.icon;
            const isOffset = idx % 2 !== 0;

            return (
              <div
                key={item.title}
                className={cn(
                  "bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm transition-all hover:shadow-md hover:border-primary/40",
                  isOffset ? "lg:-translate-y-4" : ""
                )}
              >
                <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                  <Icon className="size-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-heading font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default BuiltForBangladesh;
