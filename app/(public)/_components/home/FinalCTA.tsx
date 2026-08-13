import React from "react";
import Link from "next/link";
import { Search, Building } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="bg-background py-4 sm:py-12">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden border border-border shadow-lg">
          
          {/* Panel 1: Tenants */}
          <div className="bg-card p-10 md:p-16 flex flex-col items-center justify-center text-center relative group overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6 border border-primary/20 relative z-10">
              <Search className="size-8" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-foreground mb-4 relative z-10">
              Ready to find your next home?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-sm relative z-10">
              Browse thousands of verified listings across Bangladesh and find a place that fits your lifestyle perfectly.
            </p>
            <Link 
              href="/properties" 
              className="inline-flex items-center justify-center rounded-full text-sm font-semibold bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg transition-all px-8 py-3.5 relative z-10"
            >
              Browse Properties
            </Link>
          </div>

          {/* Panel 2: Landlords */}
          <div className="bg-muted p-10 md:p-16 flex flex-col items-center justify-center text-center relative group overflow-hidden border-t md:border-t-0 md:border-l border-border">
            <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="size-16 rounded-full bg-background text-secondary-foreground flex items-center justify-center mb-6 border border-border shadow-sm relative z-10">
              <Building className="size-8 text-foreground" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-foreground mb-4 relative z-10">
              Have a place to rent out?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-sm relative z-10">
              List your property, screen tenants, and manage your rentals all in one place with our landlord tools.
            </p>
            <Link 
              href="/register/landlord" 
              className="inline-flex items-center justify-center rounded-full text-sm font-semibold bg-background border border-border text-foreground shadow-sm hover:bg-card hover:shadow-md transition-all px-8 py-3.5 relative z-10"
            >
              List Your Property
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
