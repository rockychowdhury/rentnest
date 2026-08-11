import React from "react";
import Link from "next/link";
import { FeatureImagePlaceholder } from "./FeatureImagePlaceholder";
import { Clock, CheckCircle2, TrendingUp, Building } from "lucide-react";

export function LandlordTools() {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground tracking-tight mb-4">
            Run your rental business, not a spreadsheet
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Our landlord dashboard gives you complete visibility over your properties, applications, and revenue in real-time.
          </p>
          <Link 
            href="/register/landlord" 
            className="inline-flex items-center justify-center rounded-full text-sm font-semibold bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl transition-all px-6 py-3 h-auto"
          >
            <Building className="size-4 mr-2" />
            List your first property
          </Link>
        </div>

        {/* Visual Showcase */}
        <div className="relative max-w-5xl mx-auto mt-16 md:mt-24">
          
          {/* Main Anchor Image */}
          <div className="relative z-0 rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl border border-border">
            <FeatureImagePlaceholder 
              label="Landlord dashboard overview: occupancy rate, expiring leases, pending applications" 
              aspect="16/10" 
            />
          </div>

          {/* Callout 1 (Top Left) */}
          <div className="absolute -left-4 md:-left-12 top-10 md:top-20 z-10 bg-card border border-border rounded-2xl p-4 shadow-xl flex items-start gap-4 max-w-xs animate-in slide-in-from-left-8 duration-1000 hidden sm:flex">
            <div className="size-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <Clock className="size-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Lease Tracking</p>
              <p className="text-xs text-muted-foreground mt-0.5">See exactly which leases are expiring — 30, 60, 90 days out.</p>
            </div>
          </div>

          {/* Callout 2 (Bottom Right) */}
          <div className="absolute -right-4 md:-right-8 bottom-10 md:bottom-20 z-10 bg-card border border-border rounded-2xl p-4 shadow-xl flex items-start gap-4 max-w-[280px] animate-in slide-in-from-right-8 duration-1000 hidden sm:flex">
            <div className="size-10 rounded-full bg-success/10 text-success flex items-center justify-center shrink-0">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">One-Click Approvals</p>
              <p className="text-xs text-muted-foreground mt-0.5">Approve or decline tenant applications instantly.</p>
            </div>
          </div>

          {/* Callout 3 (Top Right - Mobile mostly hidden, or positioned differently) */}
          <div className="absolute left-10 md:left-auto md:right-10 -top-8 z-10 bg-card border border-border rounded-2xl p-4 shadow-xl flex items-start gap-4 max-w-[260px] animate-in slide-in-from-top-8 duration-1000">
            <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <TrendingUp className="size-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Revenue Insights</p>
              <p className="text-xs text-muted-foreground mt-0.5">Track rent collected vs expected, every single month.</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
