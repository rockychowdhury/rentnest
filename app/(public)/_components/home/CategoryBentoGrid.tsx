import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export function CategoryBentoGrid() {
  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        
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
            <Image
              src="/assets/aprtment.jpg"
              alt="Family Apartment"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
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
            <Image
              src="/assets/bachelor.jpg"
              alt="Bachelor Mess"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
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
            className="group relative md:col-span-1 md:row-span-1 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <Image
              src="/assets/sublet.jpg"
              alt="Sublet"
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full p-6">
              <h3 className="text-lg font-bold text-white mb-1">Sublet</h3>
              <p className="text-white/80 text-sm font-medium">Flexible short-term options</p>
            </div>
          </Link>

          {/* Small Tile 2: Commercial */}
          <Link 
            href="/properties?categoryId=commercial" 
            className="group relative md:col-span-1 md:row-span-1 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <Image
              src="/assets/commercial.jpg"
              alt="Commercial"
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full p-6">
              <h3 className="text-lg font-bold text-white mb-1">Commercial</h3>
              <p className="text-white/80 text-sm font-medium">Office spaces and shops</p>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}
