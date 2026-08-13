import React from "react";
import Link from "next/link";
import { ShieldCheck, BarChart3, Users, Zap, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeatureImagePlaceholder } from "@/app/(public)/_components/home/FeatureImagePlaceholder";

export const metadata = {
  title: "For Landlords | RentNest",
  description: "Run your rental business, not a spreadsheet. Join RentNest to manage properties effortlessly.",
};

export default function ForLandlordsPage() {
  return (
    <div className="w-full flex flex-col bg-background">
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-primary/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6">
              <Zap className="size-4" /> Built for Bangladesh
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading text-foreground tracking-tight mb-6">
              Run your rental business, <span className="text-primary">not a spreadsheet.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-lg">
              Manage your properties, review tenant applications, and track expiring leases all in one place. Stop relying on paper logs and WhatsApp messages.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register/landlord">
                <Button size="lg" className="w-full sm:w-auto rounded-full px-8 shadow-sm">
                  List Your First Property
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 shadow-sm">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <FeatureImagePlaceholder 
              label="Landlord dashboard overview: occupancy rate, expiring leases, pending applications" 
              aspect="4/3" 
              className="rounded-2xl shadow-2xl border border-border bg-card"
            />
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-heading mb-4">Everything you need to manage your portfolio</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">From single apartments to multi-unit buildings, RentNest adapts to your needs.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
              <BarChart3 className="size-10 text-primary mb-5" />
              <h3 className="text-xl font-bold mb-3">Occupancy Tracking</h3>
              <p className="text-muted-foreground leading-relaxed">
                See exactly which leases are expiring—30, 60, or 90 days out. Know your occupancy rate across all properties at a glance.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
              <Users className="size-10 text-primary mb-5" />
              <h3 className="text-xl font-bold mb-3">Application Queue</h3>
              <p className="text-muted-foreground leading-relaxed">
                Receive and review tenant applications in a clean queue. View their profiles, verified status, and approve or decline with a single click.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
              <ShieldCheck className="size-10 text-primary mb-5" />
              <h3 className="text-xl font-bold mb-3">Secure & Verified</h3>
              <p className="text-muted-foreground leading-relaxed">
                Rest easy knowing you are interacting with verified tenants. Keep your property address exact, or obscure it until a lease is signed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ / Trust Section */}
      <section className="py-24 bg-muted/30 border-t border-border">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold font-heading mb-8">Ready to modernize your rentals?</h2>
          <ul className="space-y-4 mb-10 max-w-lg mx-auto text-left">
            <li className="flex items-start gap-3">
              <CheckCircle className="size-5 text-primary shrink-0 mt-0.5" />
              <span className="text-muted-foreground">Free to list your first 5 properties.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="size-5 text-primary shrink-0 mt-0.5" />
              <span className="text-muted-foreground">Detailed unit categorization (Bachelors, Families, Commercial).</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="size-5 text-primary shrink-0 mt-0.5" />
              <span className="text-muted-foreground">Localized utility policies (WASA, Generator, Gas rules).</span>
            </li>
          </ul>
          
          <Link href="/register/landlord">
            <Button size="lg" className="rounded-full px-10 h-14 text-base shadow-sm">
              Create Your Landlord Account
            </Button>
          </Link>
        </div>
      </section>
      
    </div>
  );
}
