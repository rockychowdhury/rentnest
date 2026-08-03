"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, MapPin, Building, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function HeroSection() {
  const router = useRouter();
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [category, setCategory] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (division) params.set("division", division);
    if (district) params.set("district", district);
    if (upazila) params.set("upazila", upazila);
    if (category) params.set("categoryId", category);

    const queryStr = params.toString();
    router.push(queryStr ? `/properties?${queryStr}` : "/properties");
  };

  const quickFilters = [
    { label: "Featured Properties", query: "isFeatured=true" },
    { label: "Vacant / Immediate Move-in", query: "availableNow=true" },
    { label: "Dhaka Rentals", query: "division=Dhaka" },
    { label: "Chattogram Rents", query: "division=Chattogram" },
  ];

  return (
    <section className="relative w-full overflow-hidden py-20 lg:py-28 bg-background border-b border-border/40">
            <div className="absolute inset-0 z-0 select-none overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&q=80"
          alt="RentNest Hero Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-25 dark:opacity-15 transform-gpu scale-105 filter blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
      </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="space-y-4 max-w-3xl mx-auto">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 backdrop-blur-md shadow-xs animate-in fade-in slide-in-from-top-4 duration-500">
            <Sparkles className="size-3.5" />
            Seamless Rental Platform across Bangladesh
          </span>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-foreground leading-[1.15]">
            Rent with confidence, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/90 to-amber-500">
              list with ease
            </span>
          </h1>

                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto font-normal">
            Discover verified apartments, sublets, bachelor messes, and commercial spaces across every division, district, and upazila.
          </p>
        </div>

                <form
          onSubmit={handleSearch}
          className="bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl shadow-[0_12px_40px_rgb(0,0,0,0.08)] p-4 md:p-6 space-y-4 max-w-4xl mx-auto transition-all"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <Select value={division} onValueChange={(val) => setDivision(val || "")}>
              <SelectTrigger className="w-full h-11 text-xs bg-muted/30 border-border/60">
                <MapPin className="size-3.5 mr-2 text-primary shrink-0" />
                <SelectValue placeholder="Division" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dhaka">Dhaka</SelectItem>
                <SelectItem value="Chattogram">Chattogram</SelectItem>
                <SelectItem value="Rajshahi">Rajshahi</SelectItem>
                <SelectItem value="Khulna">Khulna</SelectItem>
                <SelectItem value="Sylhet">Sylhet</SelectItem>
                <SelectItem value="Barishal">Barishal</SelectItem>
                <SelectItem value="Rangpur">Rangpur</SelectItem>
                <SelectItem value="Mymensingh">Mymensingh</SelectItem>
              </SelectContent>
            </Select>

                        <Select value={district} onValueChange={(val) => setDistrict(val || "")}>
              <SelectTrigger className="w-full h-11 text-xs bg-muted/30 border-border/60">
                <SelectValue placeholder="District" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dhaka">Dhaka District</SelectItem>
                <SelectItem value="Chattogram">Chattogram District</SelectItem>
                <SelectItem value="Barishal">Barishal District</SelectItem>
                <SelectItem value="Rajshahi">Rajshahi District</SelectItem>
                <SelectItem value="Sylhet">Sylhet District</SelectItem>
                <SelectItem value="Khulna">Khulna District</SelectItem>
              </SelectContent>
            </Select>

                        <Select value={upazila} onValueChange={(val) => setUpazila(val || "")}>
              <SelectTrigger className="w-full h-11 text-xs bg-muted/30 border-border/60">
                <SelectValue placeholder="Upazila / Thana" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dhamrai">Dhamrai</SelectItem>
                <SelectItem value="Savar">Savar</SelectItem>
                <SelectItem value="Barisal Sadar">Barisal Sadar</SelectItem>
                <SelectItem value="Mohanpur">Mohanpur</SelectItem>
                <SelectItem value="Sylhet Sadar">Sylhet Sadar</SelectItem>
                <SelectItem value="Phultala">Phultala</SelectItem>
              </SelectContent>
            </Select>

                        <Select value={category} onValueChange={(val) => setCategory(val || "")}>
              <SelectTrigger className="w-full h-11 text-xs bg-muted/30 border-border/60">
                <Building className="size-3.5 mr-2 text-primary shrink-0" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="d19e8935-9efa-4d3b-a052-0f930e00235c">Apartment/Flat</SelectItem>
                <SelectItem value="85b49b30-1c37-4daa-8245-b1b0826a01e9">Bachelor Mess</SelectItem>
                <SelectItem value="f437dd80-ce39-4852-ac2b-5a35aed044ca">Sublet</SelectItem>
                <SelectItem value="a30209dc-051b-4cf7-a5e7-702382a1a89e">Studio</SelectItem>
                <SelectItem value="cf03e6d4-f3d2-4593-a63e-c5f407a1e888">Shop/Retail</SelectItem>
                <SelectItem value="34081e1e-0001-48bb-88d2-528d21ec573c">Office Space</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" size="lg" className="w-full h-11 font-semibold text-xs gap-2 shadow-md">
            <Search className="size-4" />
            Search Properties
          </Button>
        </form>

                <div className="flex items-center justify-center gap-2 flex-wrap text-xs pt-2">
          <span className="text-muted-foreground font-medium">Quick search:</span>
          {quickFilters.map((chip) => (
            <button
              key={chip.query}
              onClick={() => router.push(`/properties?${chip.query}`)}
              className="px-3.5 py-1.5 rounded-full bg-muted/70 hover:bg-primary/10 hover:text-primary hover:border-primary/30 text-foreground border border-border/60 transition-all font-medium backdrop-blur-xs"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
