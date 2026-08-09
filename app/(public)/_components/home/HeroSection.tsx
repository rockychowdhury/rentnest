"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, MapPin, Building, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getDivisions, getDistricts, getAreas } from "@/app/(dashboard)/_actions/addressActions";
import { getCategories } from "@/app/(dashboard)/_actions/propertiesActions";
import { Division, District, Area, Category } from "@/types";

export function HeroSection() {
  const router = useRouter();
  
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [loadingDivisions, setLoadingDivisions] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [divisionId, setDivisionId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [areaId, setAreaId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    const fetchInitialData = async () => {
      const [divRes, catRes] = await Promise.all([
        getDivisions(),
        getCategories()
      ]);
      
      if (divRes.success) setDivisions(divRes.data);
      if (catRes.success) setCategories(catRes.data);
      
      setLoadingDivisions(false);
      setLoadingCategories(false);
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!divisionId) {
      setDistricts([]);
      setDistrictId("");
      setAreas([]);
      setAreaId("");
      return;
    }
    
    const fetchDistricts = async () => {
      setLoadingDistricts(true);
      const res = await getDistricts(divisionId);
      if (res.success) setDistricts(res.data);
      setDistrictId("");
      setAreas([]);
      setAreaId("");
      setLoadingDistricts(false);
    };
    
    fetchDistricts();
  }, [divisionId]);

  useEffect(() => {
    if (!districtId) {
      setAreas([]);
      setAreaId("");
      return;
    }
    
    const fetchAreas = async () => {
      setLoadingAreas(true);
      const res = await getAreas(districtId);
      if (res.success) setAreas(res.data);
      setAreaId("");
      setLoadingAreas(false);
    };
    
    fetchAreas();
  }, [districtId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    const divisionName = divisions.find(d => d.id === divisionId)?.name;
    const districtName = districts.find(d => d.id === districtId)?.name;
    const areaName = areas.find(u => u.id.toString() === areaId)?.name;
    
    if (divisionName) params.set("division", divisionName);
    if (districtName) params.set("district", districtName);
    if (areaName) params.set("area", areaName);
    if (categoryId) params.set("categoryId", categoryId);

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
            Discover verified apartments, sublets, bachelor messes, and commercial spaces across every division, district, and area.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl shadow-[0_12px_40px_rgb(0,0,0,0.08)] p-4 md:p-6 space-y-4 max-w-4xl mx-auto transition-all"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Select value={divisionId} onValueChange={(val) => setDivisionId(val || "")} disabled={loadingDivisions}>
              <SelectTrigger className="w-full h-11 text-xs bg-muted/30 border-border/60">
                <MapPin className="size-3.5 mr-2 text-primary shrink-0" />
                <SelectValue placeholder={loadingDivisions ? "Loading Divisions..." : "Division"}>
                  {divisionId ? divisions.find(d => d.id === divisionId)?.name : null}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {divisions.map((div) => (
                  <SelectItem key={div.id} value={div.id}>{div.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={districtId} onValueChange={(val) => setDistrictId(val || "")} disabled={!divisionId || loadingDistricts}>
              <SelectTrigger className="w-full h-11 text-xs bg-muted/30 border-border/60">
                <SelectValue placeholder={loadingDistricts ? "Loading Districts..." : "District"}>
                  {districtId ? districts.find(d => d.id === districtId)?.name : null}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {districts.map((dist) => (
                  <SelectItem key={dist.id} value={dist.id}>{dist.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={areaId} onValueChange={(val) => setAreaId(val || "")} disabled={!districtId || loadingAreas}>
              <SelectTrigger className="w-full h-11 text-xs bg-muted/30 border-border/60">
                <SelectValue placeholder={loadingAreas ? "Loading Areas..." : "Area"}>
                  {areaId ? areas.find(u => u.id.toString() === areaId)?.name : null}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {areas.map((up) => (
                  <SelectItem key={up.id} value={up.id.toString()}>{up.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categoryId} onValueChange={(val) => setCategoryId(val || "")} disabled={loadingCategories}>
              <SelectTrigger className="w-full h-11 text-xs bg-muted/30 border-border/60">
                <Building className="size-3.5 mr-2 text-primary shrink-0" />
                <SelectValue placeholder={loadingCategories ? "Loading Categories..." : "All Categories"}>
                  {categoryId ? categories.find(c => c.id === categoryId)?.name : null}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
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
