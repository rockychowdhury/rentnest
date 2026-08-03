import React from "react";
import Link from "next/link";
import { ArrowRight, Calendar, CheckCircle, TrendingUp, Building, ShieldCheck, Users, Home, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandlordToolsShowcase() {
  const callouts = [
    {
      icon: Calendar,
      text: "See exactly which leases are expiring — 30, 60, 90 days out",
      position: "-top-4 -left-4 sm:-left-6",
    },
    {
      icon: CheckCircle,
      text: "Approve or decline applications with one click",
      position: "top-1/2 -right-4 sm:-right-6 -translate-y-1/2",
    },
    {
      icon: TrendingUp,
      text: "Track rent collected vs expected, every month",
      position: "-bottom-4 -left-4 sm:-left-6",
    },
  ];

  return (
    <section className="py-20 bg-background border-t border-border/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            For Property Owners
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
            Run your rental business, not a spreadsheet
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Automate tenant screening, rent collection, and lease tracking with a dashboard built specifically for Bangladeshi landlords.
          </p>
        </div>

                <div className="relative max-w-4xl mx-auto my-8 px-4 sm:px-8">
                    <div className="w-full bg-card rounded-3xl border border-border p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                  <Building className="size-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-foreground text-sm sm:text-base">Landlord Overview</h3>
                  <p className="text-xs text-muted-foreground">Porto Properties Portfolio • Dhaka & Rajshahi</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <Sparkles className="size-3" />
                  95% Occupancy
                </span>
              </div>
            </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium">Total Rents Collected</span>
                <p className="text-xl font-heading font-bold text-primary">৳1,45,000</p>
                <span className="text-[10px] text-emerald-600 font-semibold">100% On-Time</span>
              </div>

              <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium">Active Leases</span>
                <p className="text-xl font-heading font-bold text-foreground">12 Units</p>
                <span className="text-[10px] text-muted-foreground">1 Expiring in 30 days</span>
              </div>

              <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium">Pending Rental Requests</span>
                <p className="text-xl font-heading font-bold text-amber-500">3 Applicants</p>
                <span className="text-[10px] text-muted-foreground">Verification pending</span>
              </div>
            </div>
          </div>

                    {callouts.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className={`hidden md:flex items-center gap-3 bg-card/95 backdrop-blur-md border border-border p-3.5 rounded-2xl shadow-xl max-w-xs z-20 absolute ${card.position}`}
              >
                <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
                  <Icon className="size-4" />
                </div>
                <p className="text-xs font-semibold text-foreground leading-snug">
                  {card.text}
                </p>
              </div>
            );
          })}
        </div>

                <div className="md:hidden grid grid-cols-1 gap-3">
          {callouts.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div key={idx} className="flex items-center gap-3 bg-card border border-border p-3.5 rounded-xl shadow-xs">
                <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Icon className="size-4" />
                </div>
                <p className="text-xs font-medium text-foreground">{card.text}</p>
              </div>
            );
          })}
        </div>

                <div className="text-center pt-4">
          <Link href="/register">
            <Button size="lg" className="font-semibold text-xs gap-2 shadow-md">
              <Building className="size-4" />
              List your first property
              <ArrowRight className="size-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default LandlordToolsShowcase;
