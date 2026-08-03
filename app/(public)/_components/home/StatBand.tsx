import React from "react";

export function StatBand() {
  const stats = [
    { value: "1,200+", label: "Verified Listings", note: "Across 8 divisions" },
    { value: "64", label: "Districts Covered", note: "Full country reach" },
    { value: "450+", label: "Verified Landlords", note: "Identity verified" },
    { value: "3,500+", label: "Happy Tenants", note: "Transparent rentals" },
  ];

  return (
    <section className="py-14 bg-muted/40 border-y border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="space-y-1">
              <div className="text-3xl sm:text-4xl font-heading font-extrabold text-primary tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-foreground">
                {stat.label}
              </div>
              <div className="text-[11px] text-muted-foreground font-medium">
                {stat.note}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatBand;
