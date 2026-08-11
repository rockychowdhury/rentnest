import React from "react";
import Link from "next/link";
import { FeatureImagePlaceholder } from "./FeatureImagePlaceholder";
import { ArrowUpRight } from "lucide-react";

export function CategoryBentoGrid() {
  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground tracking-tight mb-3">
              Whatever kind of place you&apos;re after
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              From shared living to luxury apartments, find the right fit for your lifestyle.
            </p>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 md:gap-6 auto-rows-[250px] md:h-[600px]">
          
          {/* Large Tile 1: Family Apartment */}
          <Link 
            href="/properties?categoryId=family-apartment" 
            className="group relative md:col-span-2 md:row-span-2 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <FeatureImagePlaceholder 
              label="Family Apartment example photo" 
              aspect="4/3" 
              className="rounded-none border-none group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full p-8 flex items-end justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary-foreground transition-colors">Family Apartment</h3>
                <p className="text-white/80 font-medium">Spacious living for you and your loved ones</p>
              </div>
              <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                <ArrowUpRight className="size-5" />
              </div>
            </div>
          </Link>

          {/* Large Tile 2: Bachelor Mess */}
          <Link 
            href="/properties?categoryId=bachelor-mess" 
            className="group relative md:col-span-2 md:row-span-1 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <FeatureImagePlaceholder 
              label="Bachelor Mess example photo" 
              aspect="21/9" 
              className="rounded-none border-none group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full p-6 flex items-end justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Bachelor Mess</h3>
                <p className="text-white/80 text-sm font-medium">Shared living, simple terms</p>
              </div>
              <div className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <ArrowUpRight className="size-4" />
              </div>
            </div>
          </Link>

          {/* Small Tile 1: Sublet */}
          <Link 
            href="/properties?categoryId=sublet" 
            className="group relative md:col-span-1 md:row-span-1 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-secondary/20 border border-secondary/30 flex flex-col justify-between p-6"
          >
            <div className="w-12 h-12 bg-secondary/30 text-secondary-foreground rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-secondary-foreground transition-colors">Sublet</h3>
              <p className="text-muted-foreground text-sm font-medium">Flexible short-term options</p>
            </div>
          </Link>

          {/* Small Tile 2: Commercial */}
          <Link 
            href="/properties?categoryId=commercial" 
            className="group relative md:col-span-1 md:row-span-1 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-accent/20 border border-accent/30 flex flex-col justify-between p-6"
          >
             <div className="w-12 h-12 bg-accent/30 text-accent-foreground rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-accent-foreground transition-colors">Commercial</h3>
              <p className="text-muted-foreground text-sm font-medium">Office spaces and shops</p>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}
