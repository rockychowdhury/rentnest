"use client";

import React, { useState, useEffect, useRef } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle2, ShieldCheck, Zap, Key, CreditCard, Sparkles,
  Search, FileText, MessageSquare, PenTool, Home, Star,
  PlusCircle, Users, CheckSquare, TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils/shadcnUtils";

export function HowItWorksTimeline() {
  const [roleTab, setRoleTab] = useState<"tenant" | "landlord">("tenant");
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how much of the container is scrolled past the center of the viewport
      const start = rect.top - windowHeight / 2;
      // We subtract a little bit from height so it completes slightly before scrolling entirely past
      const height = rect.height;
      
      let p = -start / height;
      p = Math.max(0, Math.min(1, p));
      setProgress(p);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Trigger once on mount
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [roleTab]);

  const tenantSteps = [
    { title: "Search & Filter", desc: "Filter by location, price, WASA water source, and generator backup status.", icon: Search },
    { title: "Apply Online", desc: "Submit your tenant background profile directly through the platform.", icon: FileText },
    { title: "Message Landlord", desc: "Chat securely to arrange property viewings or negotiate terms.", icon: MessageSquare },
    { title: "Sign Digital Lease", desc: "Review transparent rental terms and e-sign your agreement.", icon: PenTool },
    { title: "Move In", desc: "Handover keys with documented move-in condition inventory.", icon: Home },
    { title: "Seamless Monthly Rent", desc: "Pay monthly rent hassle-free with instant digital confirmation.", icon: CreditCard },
    { title: "Leave a Review", desc: "Share authentic feedback about your stay to help future tenants.", icon: Star },
  ];

  const landlordSteps = [
    { title: "Create Your Listing", desc: "Add property details, unit photos, and local utility specs.", icon: PlusCircle },
    { title: "Get Verified", desc: "Verify ownership to build tenant trust and boost ranking.", icon: ShieldCheck },
    { title: "Review Applications", desc: "View tenant backgrounds, employment details, and rental history.", icon: Users },
    { title: "Approve & Sign Lease", desc: "Send digitized agreements for fast, legal signature.", icon: CheckSquare },
    { title: "Automate Rent Tracking", desc: "Monitor monthly payments directly into your dashboard.", icon: CreditCard },
    { title: "Manage Portfolio", desc: "Track occupancy rates, expiring leases, and unit availability.", icon: TrendingUp },
  ];

  const steps = roleTab === "tenant" ? tenantSteps : landlordSteps;

  return (
    <section className="py-24 bg-muted/20 border-t border-border/50">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="flex flex-col items-center text-center space-y-5 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">
            Step-by-Step Guide
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground tracking-tight">
            How RentNest works
          </h2>

          <Tabs
            defaultValue="tenant"
            onValueChange={(val) => setRoleTab(val as "tenant" | "landlord")}
            className="w-full max-w-xs pt-4"
          >
            <TabsList className="grid grid-cols-2 w-full bg-muted/60 p-1.5 rounded-2xl h-auto">
              <TabsTrigger value="tenant" className="text-sm font-semibold py-2 rounded-xl">For Tenants</TabsTrigger>
              <TabsTrigger value="landlord" className="text-sm font-semibold py-2 rounded-xl">For Landlords</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start pt-8">
          
          {/* Timeline Container Wrapper with Min Height to prevent Layout Shift */}
          <div className="lg:col-span-2 min-h-[900px] md:min-h-[1100px]">
            <div ref={containerRef} className="relative py-8">
              
              {/* Background Track Line */}
              <div className="absolute top-0 bottom-0 left-6 md:left-1/2 w-1 -ml-[2px] bg-border/60 rounded-full" />
              
              {/* Animated Fill Line */}
              <div 
                className="absolute top-0 left-6 md:left-1/2 w-1 -ml-[2px] bg-primary rounded-full transition-all duration-300 ease-out z-0" 
                style={{ height: `${progress * 100}%` }}
              />

              {/* The Steps */}
              <div className="space-y-12">
                {steps.map((step, idx) => {
                  const isEven = idx % 2 === 0;
                  const StepIcon = step.icon;
                  
                  // Calculate when this specific step should be "active"
                  const stepProgressThreshold = idx / Math.max(1, steps.length - 1);
                  const isActive = progress >= stepProgressThreshold - 0.05;

                  return (
                    <div key={step.title} className="relative w-full">
                      
                      {/* Central Timeline Node */}
                      <div 
                        className={cn(
                          "absolute top-1/2 left-6 md:left-1/2 -translate-x-1/2 -translate-y-1/2 size-12 rounded-2xl flex items-center justify-center z-10 transition-all duration-500",
                          isActive 
                            ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)] border-4 border-background scale-110" 
                            : "bg-card text-muted-foreground border-2 border-border/80 shadow-sm"
                        )}
                      >
                        <StepIcon className="size-5" />
                      </div>

                      {/* Content Card Container (handles left/right alignment) */}
                      <div className={cn(
                        "w-full pl-20 md:pl-0 flex relative z-10",
                        isEven ? "md:justify-start" : "md:justify-end"
                      )}>
                        <div className="w-full md:w-[calc(50%-3.5rem)]">
                          <div 
                            className={cn(
                              "bg-card rounded-3xl border p-6 space-y-3 transition-all duration-500 text-left",
                              isActive 
                                ? "border-primary/40 shadow-lg shadow-primary/5 -translate-y-1" 
                                : "border-border/60 shadow-sm opacity-60"
                            )}
                          >
                            <h3 className={cn(
                              "text-lg font-heading font-bold transition-colors",
                              isActive ? "text-foreground" : "text-muted-foreground"
                            )}>
                              {step.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sticky Side Card */}
          <div className="lg:col-span-1 sticky top-28 space-y-4">
            <div className="bg-gradient-to-br from-card to-muted/40 rounded-[2rem] border border-border/60 p-8 space-y-8 shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-4 border-b border-border/60 pb-6">
                <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-inner">
                  <ShieldCheck className="size-6" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-foreground text-base">
                    {roleTab === "tenant" ? "Tenant Protection" : "Landlord Automation"}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {roleTab === "tenant" ? "Verified properties & digital leases" : "Automated screening & rent tracking"}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-background/80 border border-border/50 shadow-sm">
                  <Zap className="size-5 text-amber-500 shrink-0" />
                  <span className="font-semibold text-foreground/90">100% Utility Transparency</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-background/80 border border-border/50 shadow-sm">
                  <Key className="size-5 text-primary shrink-0" />
                  <span className="font-semibold text-foreground/90">Digitized Lease Agreements</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-background/80 border border-border/50 shadow-sm">
                  <CreditCard className="size-5 text-emerald-500 shrink-0" />
                  <span className="font-semibold text-foreground/90">Instant Payment Confirmation</span>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 text-center space-y-2">
                <span className="text-sm font-bold text-primary flex items-center justify-center gap-1.5">
                  <Sparkles className="size-4" />
                  Zero Hidden Fees
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
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
