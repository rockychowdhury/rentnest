import React from "react";
import { HeroSection } from "./_components/home/HeroSection";
import { CategoryBentoGrid } from "./_components/home/CategoryBentoGrid";
import { FeatureRow } from "./_components/home/FeatureRow";
import { FeaturedProperties } from "./_components/home/FeaturedProperties";
import { HowItWorks } from "./_components/home/HowItWorks";
import { LandlordTools } from "./_components/home/LandlordTools";
import { StatBand } from "./_components/home/StatBand";
import { Testimonials } from "./_components/home/Testimonials";
import { FinalCTA } from "./_components/home/FinalCTA";
import { getPublicCategories } from "@/service/getCategories";
import { getPublicAmenities } from "@/service/getAmenities";

export default async function HomePage() {
  const [categories, amenities] = await Promise.all([
    getPublicCategories(),
    getPublicAmenities(),
  ]);

  return (
    <div className="w-full flex flex-col">
      <HeroSection categories={categories} amenities={amenities} />
      <CategoryBentoGrid />
      <FeatureRow />
      <FeaturedProperties />
      <HowItWorks />
      <LandlordTools />
      <StatBand />
      <Testimonials />
      <FinalCTA />
    </div>
  );
}
