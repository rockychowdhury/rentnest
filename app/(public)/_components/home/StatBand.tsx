import React from "react";

const stats = [
  { label: "Verified listings", value: "5,000+" },
  { label: "Divisions covered", value: "8" },
  { label: "Verified landlords", value: "1,200+" },
  { label: "Happy tenants", value: "10,000+" },
];

export function StatBand() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Note: Numbers are placeholders until real metrics are available */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x-0 md:divide-x divide-primary-foreground/20 text-center">
          
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center px-4">
              <span className="text-4xl md:text-5xl font-bold font-heading mb-2 tracking-tighter drop-shadow-sm">
                {stat.value}
              </span>
              <span className="text-sm md:text-base font-medium opacity-90 tracking-wide uppercase">
                {stat.label}
              </span>
            </div>
          ))}

        </div>
        
      </div>
    </section>
  );
}
