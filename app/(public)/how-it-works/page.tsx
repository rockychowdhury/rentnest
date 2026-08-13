import React from "react";
import Link from "next/link";
import { Search, MapPin, Building, ShieldCheck, CheckCircle2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "How It Works | RentNest",
  description: "Learn how RentNest makes finding and managing properties in Bangladesh seamless and secure.",
};

export default function HowItWorksPage() {
  return (
    <div className="w-full flex flex-col bg-background">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-primary/5 border-b border-border">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading text-foreground tracking-tight mb-6">
            Renting, <span className="text-primary">simplified.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            Whether you&apos;re looking for a bachelor mess in Dhaka or listing a family apartment in Chattogram, RentNest provides a seamless, transparent, and secure process from search to signature.
          </p>
        </div>
      </section>

      {/* For Tenants Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-heading mb-4">How it works for Tenants</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Find your next home in just a few clicks. No hidden fees, no unreliable listings.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Step 1 */}
            <div className="relative p-8 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="size-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Search className="size-7 text-primary" />
              </div>
              <div className="absolute top-8 right-8 text-6xl font-black text-muted/30">1</div>
              <h3 className="text-xl font-bold mb-3">Search & Filter</h3>
              <p className="text-muted-foreground leading-relaxed">
                Browse thousands of verified listings across Bangladesh. Filter by division, district, upazila, property type (mess, sublet, apartment), and amenities like generator backup.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-8 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="size-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="size-7 text-primary" />
              </div>
              <div className="absolute top-8 right-8 text-6xl font-black text-muted/30">2</div>
              <h3 className="text-xl font-bold mb-3">Connect Securely</h3>
              <p className="text-muted-foreground leading-relaxed">
                Found the perfect place? Contact the verified landlord directly through our platform. Ask questions, schedule a visit, and submit your application with a single click.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-8 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="size-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Home className="size-7 text-primary" />
              </div>
              <div className="absolute top-8 right-8 text-6xl font-black text-muted/30">3</div>
              <h3 className="text-xl font-bold mb-3">Move In & Manage</h3>
              <p className="text-muted-foreground leading-relaxed">
                Sign your lease digitally and move in. Use your Tenant Dashboard to track your lease, save favorite properties, and get notified about your rent status.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/properties">
              <Button size="lg" className="rounded-full px-8 shadow-sm">
                Start Searching Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <hr className="border-border" />

      {/* For Landlords Section */}
      <section className="py-20 lg:py-28 bg-muted/20">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-heading mb-4">How it works for Landlords</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Manage your properties efficiently. Reach thousands of verified tenants instantly.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Step 1 */}
            <div className="relative p-8 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="size-14 bg-secondary/15 rounded-2xl flex items-center justify-center mb-6">
                <Building className="size-7 text-secondary" />
              </div>
              <div className="absolute top-8 right-8 text-6xl font-black text-muted/30">1</div>
              <h3 className="text-xl font-bold mb-3">List Your Property</h3>
              <p className="text-muted-foreground leading-relaxed">
                Create detailed listings with photos, utility policies, and specific unit details. Our platform supports complex buildings, bachelor messes, and simple flats alike.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-8 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="size-14 bg-secondary/15 rounded-2xl flex items-center justify-center mb-6">
                <CheckCircle2 className="size-7 text-secondary" />
              </div>
              <div className="absolute top-8 right-8 text-6xl font-black text-muted/30">2</div>
              <h3 className="text-xl font-bold mb-3">Screen & Approve</h3>
              <p className="text-muted-foreground leading-relaxed">
                Receive applications from interested tenants. Review their profiles, accept or decline with a single click, and keep your property occupancy rate high.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-8 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="size-14 bg-secondary/15 rounded-2xl flex items-center justify-center mb-6">
                <MapPin className="size-7 text-secondary" />
              </div>
              <div className="absolute top-8 right-8 text-6xl font-black text-muted/30">3</div>
              <h3 className="text-xl font-bold mb-3">Track Portfolio</h3>
              <p className="text-muted-foreground leading-relaxed">
                Use the Landlord Dashboard to track which leases are expiring in 30, 60, or 90 days. Get a bird&apos;s-eye view of your entire rental business in one place.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/register/landlord">
              <Button size="lg" variant="secondary" className="rounded-full px-8 shadow-sm">
                List Your Property
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
