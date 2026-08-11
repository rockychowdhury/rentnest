"use client";

import React, { useState } from "react";
import { FeatureImagePlaceholder } from "./FeatureImagePlaceholder";
import { cn } from "@/lib/utils/shadcnUtils";

const tenantSteps = [
  { id: 1, title: "Search & filter", desc: "Find exactly what you need" },
  { id: 2, title: "Apply", desc: "Submit your profile digitally" },
  { id: 3, title: "Message the landlord", desc: "Direct communication" },
  { id: 4, title: "Sign lease", desc: "Secure your new home" },
  { id: 5, title: "Move in", desc: "Settle into your space" },
  { id: 6, title: "Pay rent", desc: "With Quick Pay" },
  { id: 7, title: "Leave a review", desc: "Help the community" },
];

const landlordSteps = [
  { id: 1, title: "Create your listing", desc: "Highlight your property" },
  { id: 2, title: "Get verified", desc: "Build trust with tenants" },
  { id: 3, title: "Review applications", desc: "Screen potential renters" },
  { id: 4, title: "Approve & sign lease", desc: "Finalize the agreement" },
  { id: 5, title: "Collect rent", desc: "Automated digital payments" },
  { id: 6, title: "Track your portfolio", desc: "Manage everything in one place" },
];

export function HowItWorks() {
  const [activeTab, setActiveTab] = useState<"tenant" | "landlord">("tenant");
  const steps = activeTab === "tenant" ? tenantSteps : landlordSteps;

  return (
    <section className="py-24 bg-muted/20 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground tracking-tight mb-8">
            How RentNest works
          </h2>
          
          {/* Toggle */}
          <div className="inline-flex p-1.5 bg-muted/50 rounded-full border border-border backdrop-blur-sm">
            <button
              onClick={() => setActiveTab("tenant")}
              className={cn(
                "px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300",
                activeTab === "tenant" 
                  ? "bg-background shadow-md text-primary scale-100" 
                  : "text-muted-foreground hover:text-foreground scale-95 opacity-80"
              )}
            >
              For Tenants
            </button>
            <button
              onClick={() => setActiveTab("landlord")}
              className={cn(
                "px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300",
                activeTab === "landlord" 
                  ? "bg-background shadow-md text-primary scale-100" 
                  : "text-muted-foreground hover:text-foreground scale-95 opacity-80"
              )}
            >
              For Landlords
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* Timeline */}
          <div className="relative order-2 lg:order-1">
            {/* Center Line for Desktop (Hidden on mobile) */}
            <div className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />
            
            {/* Left Line for Mobile */}
            <div className="sm:hidden absolute left-4 top-0 bottom-0 w-px bg-border" />

            <div className="space-y-8 sm:space-y-0 relative">
              {steps.map((step, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <div key={step.id} className="relative flex items-center justify-between w-full sm:mb-8 last:mb-0">
                    
                    {/* Left Column (Empty on mobile, alternating on desktop) */}
                    <div className={cn("hidden sm:block w-5/12 text-right pr-8", isEven ? "opacity-100" : "opacity-0 invisible")}>
                      {isEven && (
                        <div>
                          <h4 className="text-lg font-bold text-foreground">{step.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Center Node */}
                    <div className="absolute left-4 sm:left-1/2 size-8 rounded-full bg-background border-2 border-primary text-primary flex items-center justify-center font-bold text-sm -translate-x-1/2 z-10 shadow-sm shadow-primary/20">
                      {step.id}
                    </div>

                    {/* Right Column (Always visible on mobile, alternating on desktop) */}
                    <div className={cn("w-full pl-12 sm:pl-8 sm:w-5/12", isEven ? "sm:opacity-0 sm:invisible" : "sm:opacity-100")}>
                      {(!isEven || true) && (
                        <div className={cn(isEven ? "sm:hidden" : "")}>
                          <h4 className="text-lg font-bold text-foreground">{step.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Supporting Image */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="w-full max-w-sm shrink-0">
              {activeTab === "tenant" ? (
                <FeatureImagePlaceholder 
                  label="Tenant dashboard: active lease + quick pay card" 
                  aspect="3/4" 
                />
              ) : (
                <FeatureImagePlaceholder 
                  label="Landlord dashboard: property list + application queue" 
                  aspect="3/4" 
                />
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
