import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Home, Users, Key, Building2, BedDouble } from "lucide-react";
import { cn } from "@/lib/utils/shadcnUtils";

export function BrowseCategoryBento() {
  const categories = [
    {
      title: "Family Apartment",
      desc: "Full privacy, 2–4 bedrooms with kitchen, attached baths & balcony.",
      query: "categoryId=d19e8935-9efa-4d3b-a052-0f930e00235c",
      size: "large",
      icon: Home,
      imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    },
    {
      title: "Bachelor Mess",
      desc: "Shared living, individual seat rents, student & professional setups.",
      query: "categoryId=85b49b30-1c37-4daa-8245-b1b0826a01e9",
      size: "large",
      icon: Users,
      imageUrl: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80",
    },
    {
      title: "Sublet Room",
      desc: "Single room in an active household with shared facilities.",
      query: "categoryId=f437dd80-ce39-4852-ac2b-5a35aed044ca",
      size: "small",
      icon: Key,
      imageUrl: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80",
    },
    {
      title: "Commercial Space",
      desc: "Offices, shops, and retail storefronts for your business.",
      query: "categoryId=cf03e6d4-f3d2-4593-a63e-c5f407a1e888",
      size: "small",
      icon: Building2,
      imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    },
    {
      title: "Studio Unit",
      desc: "Compact, modern single-room space for independent living.",
      query: "categoryId=a30209dc-051b-4cf7-a5e7-702382a1a89e",
      size: "small",
      icon: BedDouble,
      imageUrl: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80",
    },
  ];

  return (
    <section className="py-20 bg-background border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Explore Categories
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mt-1">
              Whatever kind of place you're after
            </h2>
          </div>
          <Link
            href="/properties"
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 group"
          >
            View all properties
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

                <div className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-5 overflow-x-auto pb-4 md:pb-0 scrollbar-none snap-x snap-mandatory">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isLarge = cat.size === "large";

            return (
              <Link
                key={cat.title}
                href={`/properties?${cat.query}`}
                className={cn(
                  "group relative rounded-3xl border border-border/80 bg-card overflow-hidden p-6 flex flex-col justify-between transition-all duration-300 transform-gpu hover:border-primary/50 hover:shadow-xl snap-start shrink-0 min-w-[280px] md:min-w-0",
                  isLarge
                    ? "md:col-span-2 md:row-span-2 min-h-[320px]"
                    : "md:col-span-1 min-h-[180px]"
                )}
              >
                                <div className="absolute inset-0 z-0 overflow-hidden">
                  <Image
                    src={cat.imageUrl}
                    alt={cat.title}
                    fill
                    sizes={isLarge ? "(max-width: 768px) 100vw, 50vw" : "33vw"}
                    className="object-cover object-center opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-500 transform-gpu"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/75 to-transparent" />
                </div>

                <div className="relative z-10 space-y-3">
                  <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 transition-transform group-hover:scale-110 shadow-xs backdrop-blur-xs">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-heading font-bold text-foreground group-hover:text-primary transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1 line-clamp-2">
                      {cat.desc}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 pt-4 flex items-center gap-1.5 text-xs font-semibold text-primary transition-all duration-300 group-hover:translate-x-1">
                  <span>Browse listings</span>
                  <ArrowRight className="size-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default BrowseCategoryBento;
