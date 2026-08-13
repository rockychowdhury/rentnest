"use client";

import React from "react";
import Image from "next/image";
import { HeroSearchForm } from "./HeroSearchForm";
import { HeroCTAButtons } from "./HeroCTAButtons";

import { CategoryItem } from "@/service/getCategories";
import { AmenityItem } from "@/service/getAmenities";

export function HeroSection({ categories, amenities }: { categories?: CategoryItem[], amenities?: AmenityItem[] }) {
  return (
    <section className="relative w-full min-h-[600px] h-[90vh] flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/herosection.jpg"
          alt="RentNest hero background"
          fill
          priority
          className="object-cover object-center"
        />
      </div>
      
      {/* Overlay Scrim */}
      <div className="absolute inset-0 bg-black/50 z-10" />
      
      {/* Content */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-4 flex flex-col items-center text-center mt-16">
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
        <div className="w-full max-w-3xl mx-auto bg-black/40 backdrop-blur-xl p-2 rounded-2xl md:rounded-full shadow-2xl border border-white/20 mb-10">
          <HeroSearchForm categories={categories || []} />
        </div>

        {/* Dynamic CTA Buttons based on Role */}
        <HeroCTAButtons />
      </div>
    </section>
  );
}
