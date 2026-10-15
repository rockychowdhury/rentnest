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
    <section className="relative w-full min-h-[560px] flex items-center overflow-hidden py-16 sm:py-20">
      {/* Background Image with subtle zoom animation for interactivity */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/herosection.jpg"
          alt="Verified rental homes across Bangladesh"
          fill
          priority
          className="object-cover object-center transition-transform duration-[10000ms] ease-out hover:scale-105"
        />
      </div>
      
      {/* Overlay Scrim - Lighter in light mode to show the image's natural beauty, darker in dark mode */}
      <div className="absolute inset-0 bg-black/45 dark:bg-black/65 z-10 pointer-events-none transition-colors duration-500" />
      
      {/* Content — centered column with balanced rhythm */}
      <div className="relative z-20 w-full max-w-3xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
        <span className="inline-flex items-center px-4 py-1.5 mb-5 rounded-full bg-white/15 text-white text-xs font-semibold tracking-widest uppercase backdrop-blur-md border border-white/25">
          Find your next home in Bangladesh
        </span>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight text-balance leading-[1.05] drop-shadow-md">
          Rent with confidence, list with ease
        </h1>
        
        <p className="mt-4 text-base md:text-lg text-white/85 max-w-[560px] leading-relaxed text-balance">
          Verified listings across every division, district, and upazila — search by what actually matters to you.
        </p>
        
        {/* Search Bar Wrapper */}
        <div className="w-full mt-8 bg-black/40 backdrop-blur-xl p-2 rounded-2xl md:rounded-full shadow-2xl border border-white/20">
          <HeroSearchForm categories={categories || []} />
        </div>

        {/* Dynamic CTA Buttons based on Role */}
        <div className="mt-6">
          <HeroCTAButtons />
        </div>
      </div>

      {/* Visual Flow Indicator */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 hidden sm:flex flex-col items-center pointer-events-none opacity-70">
        <span className="text-white text-[10px] font-medium tracking-widest uppercase mb-1">Explore</span>
        <ChevronDown className="text-white size-4" />
      </div>
    </section>
  );
}
