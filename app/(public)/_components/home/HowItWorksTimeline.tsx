"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, ShieldCheck, Zap, Key, CreditCard, Sparkles } from "lucide-react";

export function HowItWorksTimeline() {
  const [roleTab, setRoleTab] = useState<"tenant" | "landlord">("tenant");

  const tenantSteps = [
    { title: "Search & Filter", desc: "Filter by location, price, WASA water source, and generator backup status." },
    { title: "Apply Online", desc: "Submit your tenant background profile directly through the platform." },
    { title: "Message Landlord", desc: "Chat securely to arrange property viewings or negotiate terms." },
    { title: "Sign Digital Lease", desc: "Review transparent rental terms and e-sign your agreement." },
    { title: "Move In", desc: "Handover keys with documented move-in condition inventory." },
    { title: "Seamless Monthly Rent", desc: "Pay monthly rent hassle-free with instant digital confirmation." },
    { title: "Leave a Review", desc: "Share authentic feedback about your stay to help future tenants." },
  ];

  const landlordSteps = [
    { title: "Create Your Listing", desc: "Add property details, unit photos, and local utility specs." },
    { title: "Get Verified", desc: "Verify ownership to build tenant trust and boost ranking." },
    { title: "Review Applications", desc: "View tenant backgrounds, employment details, and rental history." },
    { title: "Approve & Sign Lease", desc: "Send digitized agreements for fast, legal signature." },
    { title: "Automate Rent Tracking", desc: "Monitor monthly payments directly into your dashboard." },
    { title: "Manage Portfolio", desc: "Track occupancy rates, expiring leases, and unit availability." },
  ];

  const steps = roleTab === "tenant" ? tenantSteps : landlordSteps;

  return (
    <section className="py-20 bg-muted/20 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="flex flex-col items-center text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            Step-by-Step Guide
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
            How RentNest works
          </h2>

          <Tabs
            defaultValue="tenant"
            onValueChange={(val) => setRoleTab(val as "tenant" | "landlord")}
            className="w-full max-w-xs pt-2"
          >
            <TabsList className="grid grid-cols-2 w-full bg-muted/60 p-1">
              <TabsTrigger value="tenant" className="text-xs font-semibold">For Tenants</TabsTrigger>
              <TabsTrigger value="landlord" className="text-xs font-semibold">For Landlords</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start pt-6">
                    <div className="lg:col-span-2 relative space-y-8 before:absolute before:inset-0 before:left-4 md:before:left-1/2 before:w-0.5 before:-ml-px before:bg-border/80">
            {steps.map((step, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={step.title}
                  className={`relative flex items-center gap-6 ${
                    isEven ? "md:flex-row-reverse" : "md:flex-row"
                  }`}
                >
                                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 size-8 rounded-full bg-primary text-primary-foreground font-heading font-bold text-xs flex items-center justify-center shadow-md z-10 border-4 border-background">
                    {idx + 1}
                  </div>

                                    <div className="w-full md:w-[calc(50%-2rem)] pl-12 md:pl-0">
                    <div className="bg-card rounded-2xl border border-border/80 p-5 space-y-2 shadow-xs hover:border-primary/40 transition-all hover:shadow-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-primary shrink-0" />
                        <h3 className="text-sm font-heading font-bold text-foreground">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

                    <div className="lg:col-span-1 sticky top-24 space-y-4">
            <div className="bg-gradient-to-br from-card to-muted/40 rounded-3xl border border-border/80 p-6 space-y-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-3 border-b border-border/60 pb-4">
                <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-foreground text-sm">
                    {roleTab === "tenant" ? "Tenant Protection" : "Landlord Automation"}
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    {roleTab === "tenant" ? "Verified properties & digital leases" : "Automated screening & rent tracking"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-background/80 border border-border/50">
                  <Zap className="size-4 text-amber-500 shrink-0" />
                  <span className="font-medium">100% Utility Transparency</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-background/80 border border-border/50">
                  <Key className="size-4 text-primary shrink-0" />
                  <span className="font-medium">Digitized Lease Agreements</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-background/80 border border-border/50">
                  <CreditCard className="size-4 text-emerald-500 shrink-0" />
                  <span className="font-medium">Instant Payment Confirmation</span>
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 text-center space-y-1">
                <span className="text-xs font-bold text-primary flex items-center justify-center gap-1">
                  <Sparkles className="size-3.5" />
                  Zero Hidden Fees
                </span>
                <p className="text-[11px] text-muted-foreground">
                  Direct communication between landlord and tenant.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksTimeline;
