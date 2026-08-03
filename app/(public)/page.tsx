import React from "react";
import { HeroSection } from "./_components/home/HeroSection";
import { BrowseCategoryBento } from "./_components/home/BrowseCategoryBento";
import { BuiltForBangladesh } from "./_components/home/BuiltForBangladesh";
import { FeaturedProperties } from "./_components/home/FeaturedProperties";
import { HowItWorksTimeline } from "./_components/home/HowItWorksTimeline";
import { LandlordToolsShowcase } from "./_components/home/LandlordToolsShowcase";
import { StatBand } from "./_components/home/StatBand";
import { TestimonialsSection } from "./_components/home/TestimonialsSection";
import { FinalCtaBand } from "./_components/home/FinalCtaBand";

export default function HomePage() {
  return (
    <div className="w-full flex flex-col">
      <HeroSection />
      <BrowseCategoryBento />
      <BuiltForBangladesh />
      <FeaturedProperties />
      <HowItWorksTimeline />
      <LandlordToolsShowcase />
      <StatBand />
      <TestimonialsSection />
      <FinalCtaBand />
    </div>
  );
}
