"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/shadcnUtils";
import { 
  Search, FileText, MessageSquare, PenTool, Home, CreditCard, Star,
  PlusCircle, ShieldCheck, Users, CheckSquare, TrendingUp, Wallet
} from "lucide-react";

const tenantSteps = [
  { id: 1, title: "Search & filter", desc: "Find exactly what you need", icon: Search },
  { id: 2, title: "Apply", desc: "Submit your profile digitally", icon: FileText },
  { id: 3, title: "Message the landlord", desc: "Direct communication", icon: MessageSquare },
  { id: 4, title: "Sign lease", desc: "Secure your new home", icon: PenTool },
  { id: 5, title: "Move in", desc: "Settle into your space", icon: Home },
  { id: 6, title: "Pay rent", desc: "With Quick Pay", icon: CreditCard },
  { id: 7, title: "Leave a review", desc: "Help the community", icon: Star },
];

const landlordSteps = [
  { id: 1, title: "Create your listing", desc: "Highlight your property", icon: PlusCircle },
  { id: 2, title: "Get verified", desc: "Build trust with tenants", icon: ShieldCheck },
  { id: 3, title: "Review applications", desc: "Screen potential renters", icon: Users },
  { id: 4, title: "Approve & sign lease", desc: "Finalize the agreement", icon: CheckSquare },
  { id: 5, title: "Collect rent", desc: "Automated digital payments", icon: Wallet },
  { id: 6, title: "Track your portfolio", desc: "Manage everything in one place", icon: TrendingUp },
];

export function HowItWorks() {
  const [activeTab, setActiveTab] = useState<"tenant" | "landlord">("tenant");
  const steps = activeTab === "tenant" ? tenantSteps : landlordSteps;
  
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const start = rect.top - windowHeight / 2;
      const height = rect.height;
      
      let p = -start / height;
      p = Math.max(0, Math.min(1, p));
      setProgress(p);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeTab]);

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-start">
          
          {/* Timeline */}
          <div className="relative order-2 lg:order-1 min-h-[700px]">
            <div ref={containerRef} className="relative py-4">
              
              {/* Background Track Line */}
              <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-1 bg-border/60 rounded-full -translate-x-1/2" />
              
              {/* Animated Fill Line */}
              <div 
                className="absolute left-6 sm:left-1/2 top-0 w-1 bg-primary rounded-full transition-all duration-300 ease-out -translate-x-1/2 z-0" 
                style={{ height: `${progress * 100}%` }}
              />

              <div className="space-y-12 sm:space-y-8 relative z-10">
                {steps.map((step, idx) => {
                  const isEven = idx % 2 === 0;
                  const StepIcon = step.icon;
                  
                  // Calculate active state based on scroll
                  const stepProgressThreshold = idx / Math.max(1, steps.length - 1);
                  const isActive = progress >= stepProgressThreshold - 0.05;

                  return (
                    <div key={step.id} className="relative flex items-center justify-between w-full">
                      
                      {/* Left Column (Empty on mobile, alternating on desktop) */}
                      <div className={cn("hidden sm:block w-[calc(50%-2rem)] text-right pr-6", isEven ? "opacity-100" : "opacity-0 invisible")}>
                        {isEven && (
                          <div className={cn("transition-all duration-500", isActive ? "opacity-100 translate-x-0" : "opacity-40 translate-x-4")}>
                            <h4 className={cn("text-lg font-bold transition-colors", isActive ? "text-foreground" : "text-muted-foreground")}>{step.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
                          </div>
                        )}
                      </div>
                      
                      {/* Center Node */}
                      <div 
                        className={cn(
                          "absolute left-6 sm:left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 size-12 rounded-2xl flex items-center justify-center z-10 transition-all duration-500",
                          isActive 
                            ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)] border-4 border-background scale-110" 
                            : "bg-card text-muted-foreground border-2 border-border/80 shadow-sm"
                        )}
                      >
                        <StepIcon className="size-5" />
                      </div>

                      {/* Right Column (Always visible on mobile, alternating on desktop) */}
                      <div className={cn("w-full pl-20 sm:pl-6 sm:w-[calc(50%-2rem)]", isEven ? "sm:opacity-0 sm:invisible" : "sm:opacity-100")}>
                        {(!isEven || true) && (
                          <div className={cn("transition-all duration-500", 
                            isEven ? "sm:hidden" : "",
                            isActive ? "opacity-100 translate-x-0" : "opacity-40 -translate-x-4"
                          )}>
                            <h4 className={cn("text-lg font-bold transition-colors", isActive ? "text-foreground" : "text-muted-foreground")}>{step.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Supporting Image */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end lg:sticky lg:top-28">
            <div className="w-full max-w-md shrink-0 relative rounded-[2rem] overflow-hidden shadow-2xl border border-border group aspect-[3/4]">
              <Image 
                src={activeTab === "tenant" ? "/assets/tenenat.png" : "/assets/landlord.png"}
                alt={activeTab === "tenant" ? "Tenant Dashboard" : "Landlord Dashboard"}
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 500px"
              />
              {/* Optional overlay in dark mode to blend better */}
              <div className="absolute inset-0 hidden dark:block bg-gray-900/20 mix-blend-multiply pointer-events-none transition-opacity duration-300" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
