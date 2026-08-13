"use client";

import React from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { HeroSearchForm } from "./HeroSearchForm";
import { HeroCTAButtons } from "./HeroCTAButtons";

import { CategoryItem } from "@/service/getCategories";
import { AmenityItem } from "@/service/getAmenities";

export function HeroSection({ categories, amenities }: { categories?: CategoryItem[], amenities?: AmenityItem[] }) {
  return (
    <section className="relative w-full min-h-[550px] h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with subtle zoom animation for interactivity */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/herosection.jpg"
          alt="RentNest hero background"
          fill
          priority
          className="object-cover object-center transition-transform duration-[10000ms] ease-out hover:scale-105"
        />
      </div>
      
      {/* Overlay Scrim - Lighter in light mode to show the image's natural beauty, darker in dark mode */}
      <div className="absolute inset-0 bg-black/10 dark:bg-black/60 z-10 pointer-events-none transition-colors duration-500" />
      
      {/* Content */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-4 flex flex-col items-center text-center mt-8">
        <span className="px-4 py-1.5 mb-6 rounded-full bg-white/20 text-white text-xs font-bold tracking-wider uppercase backdrop-blur-md border border-white/30 shadow-sm">
          Find your next home in Bangladesh
        </span>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-md">
          Rent with confidence, <br className="hidden md:block" /> list with ease
        </h1>
        
        <p className="text-base md:text-lg text-white/90 mb-10 max-w-2xl drop-shadow max-w-[600px]">
          Verified listings across every division, district, and upazila — search by what actually matters to you.
        </p>
        
        {/* Search Bar Wrapper */}
        <div className="w-full max-w-3xl mx-auto bg-black/40 backdrop-blur-xl p-2 rounded-2xl md:rounded-full shadow-2xl border border-white/20 mb-8">
          <HeroSearchForm categories={categories || []} />
        </div>

        {/* Dynamic CTA Buttons based on Role */}
        <HeroCTAButtons />
      </div>

      {/* Visual Flow Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center animate-bounce pointer-events-none opacity-80">
        <span className="text-white text-[10px] font-medium tracking-widest uppercase mb-1 drop-shadow-md">Explore</span>
        <ChevronDown className="text-white size-4 drop-shadow-md" />
      </div>
    </section>
  );
}
