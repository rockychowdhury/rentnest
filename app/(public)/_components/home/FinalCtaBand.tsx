import React from "react";
import Link from "next/link";
import { Search, Building, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCtaBand() {
  return (
    <section className="py-20 bg-muted/40 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Panel 1: Tenants */}
          <div className="bg-card rounded-3xl border border-border p-8 sm:p-10 space-y-6 shadow-sm flex flex-col justify-between hover:border-primary/40 transition-colors">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                <Search className="size-3.5" />
                For Tenants
              </span>
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
                Ready to find your next home?
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Filter thousands of verified apartments, sublets, and messes across Bangladesh.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/properties">
                <Button size="lg" className="font-semibold text-xs gap-2">
                  Browse Properties
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Panel 2: Landlords */}
          <div className="bg-card rounded-3xl border border-border p-8 sm:p-10 space-y-6 shadow-sm flex flex-col justify-between hover:border-primary/40 transition-colors">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-secondary/30 text-foreground border border-secondary/50">
                <Building className="size-3.5" />
                For Landlords
              </span>
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
                Have a place to rent out?
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Reach verified tenants, automate rent collection, and manage your leases with ease.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="font-semibold text-xs gap-2">
                  List Your Property
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FinalCtaBand;
