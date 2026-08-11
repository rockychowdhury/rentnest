"use client";

import React, { Suspense } from "react";
import { FeatureImagePlaceholder } from "./FeatureImagePlaceholder";
import { PropertyFilterBar } from "@/components/properties/PropertyFilterBar";
import { Building, MapPin, Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils/shadcnUtils";

import { CategoryItem } from "@/service/getCategories";
import { AmenityItem } from "@/service/getAmenities";

const quickFilters = [
  { label: "Bachelor Mess", slug: "bachelor-mess", icon: Zap },
  { label: "Family Apartment", slug: "family-apartment", icon: Building },
  { label: "Sublet", slug: "sublet", icon: Zap },
  { label: "Near Me", slug: "near-me", icon: MapPin },
];

export function HeroSection({ categories, amenities }: { categories?: CategoryItem[], amenities?: AmenityItem[] }) {
  return (
    <section className="relative w-full h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image Placeholder */}
      <div className="absolute inset-0 z-0">
        <FeatureImagePlaceholder 
          label="Hero background: wide shot of a Bangladeshi apartment building or rooftop, warm/lived-in feel" 
          aspect="21/9"
          className="rounded-none border-none"
        />
      </div>
      
      {/* Overlay Scrim */}
      <div className="absolute inset-0 bg-black/50 z-10" />
      
      {/* Content */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-4 flex flex-col items-center text-center">
        <span className="px-4 py-1.5 mb-6 rounded-full bg-white/20 text-white text-xs font-bold tracking-wider uppercase backdrop-blur-md border border-white/30">
          Find your next home in Bangladesh
        </span>
        
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-md">
          Rent with confidence, <br className="hidden md:block" /> list with ease
        </h1>
        
        <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl drop-shadow max-w-[600px]">
          Verified listings across every division, district, and upazila — search by what actually matters to you.
        </p>
        
        {/* Search Bar Wrapper */}
        <div className="w-full max-w-4xl bg-background/95 backdrop-blur-xl p-4 md:p-2 rounded-2xl md:rounded-full shadow-2xl border border-white/20 mb-6">
          <Suspense fallback={<div className="h-12 w-full animate-pulse bg-muted rounded-full" />}>
            {/* We use a thin wrapper over PropertyFilterBar to make it look decent in hero. 
                In a real app we might pass a 'variant' prop to strip its borders/backgrounds. */}
            <div className="[&>div]:bg-transparent [&>div]:border-none [&>div]:shadow-none [&>div]:sticky-none [&>div]:static [&>div]:p-0 hero-search-override">
              <PropertyFilterBar categories={categories} amenities={amenities} />
            </div>
          </Suspense>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {quickFilters.map((filter) => {
            const Icon = filter.icon;
            return (
              <Link 
                key={filter.slug} 
                href={filter.slug === 'near-me' ? '/properties?sort=nearest' : `/properties?categoryId=${filter.slug}`}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-colors backdrop-blur-md border border-white/20"
              >
                <Icon className="size-4" />
                {filter.label}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  );
}
