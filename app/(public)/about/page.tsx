import React from "react";
import Link from "next/link";
import { Building, Target, Heart, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeatureImagePlaceholder } from "@/app/(public)/_components/home/FeatureImagePlaceholder";

export const metadata = {
  title: "About Us | RentNest",
  description: "Learn about RentNest's mission to revolutionize the rental market in Bangladesh.",
};

export default function AboutPage() {
  return (
    <div className="w-full flex flex-col bg-background min-h-screen">
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-primary/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading text-foreground tracking-tight mb-6">
            Building trust in every <span className="text-primary">rented home.</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
            RentNest is on a mission to modernize the Bangladeshi rental market by replacing paper trails, hidden fees, and uncertainty with transparency, security, and digital convenience.
          </p>
        </div>
      </section>

      {/* Our Story / Mission */}
      <section className="py-20 lg:py-28">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
               <FeatureImagePlaceholder 
                label="Team photo or Dhaka city skyline" 
                aspect="4/3" 
                className="rounded-3xl shadow-xl border border-border"
              />
            </div>
            
            <div className="space-y-6">
              <h2 className="text-3xl font-bold font-heading">The problem we're solving</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Finding a place to live in Bangladesh shouldn't be a gamble. For decades, tenants have struggled with false listings, unclear utility policies (like sudden WASA or generator charges), and informal agreements. 
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Meanwhile, landlords have been stuck managing multi-unit buildings with paper ledgers, struggling to track occupancies, and dealing with unverified applications.
              </p>
              <p className="text-lg font-semibold text-foreground">
                We built RentNest to fix both sides of the equation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-muted/30 border-y border-border">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-heading mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">The principles that guide every feature we build.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
              <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Target className="size-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Transparency First</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                No hidden fees. Every listing clearly states utility rules, advance deposits, and rent structures upfront.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
              <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Building className="size-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Hyper-Local</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Built specifically for Bangladesh. From Bachelor Mess logic to Upazila-level searching, we understand local context.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
              <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="size-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Security & Trust</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Verified landlords, secure messaging, and digital leases mean you never have to hand over cash to a stranger.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
              <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Zap className="size-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Frictionless</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                From 1-click applications for tenants to automated occupancy tracking for landlords, we save everyone time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold font-heading mb-6">Join the RentNest community</h2>
          <p className="text-lg text-muted-foreground mb-10">
            Ready to experience a better way to rent or manage properties? 
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/properties">
              <Button size="lg" className="w-full sm:w-auto rounded-full px-8">
                Find a Home
              </Button>
            </Link>
            <Link href="/register/landlord">
              <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8">
                List a Property
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
}
