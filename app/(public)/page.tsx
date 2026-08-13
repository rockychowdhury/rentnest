import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { HeroSection } from "./_components/home/HeroSection";
import { CategoryBentoGrid } from "./_components/home/CategoryBentoGrid";
import { FeatureRow } from "./_components/home/FeatureRow";
import { FeaturedProperties } from "./_components/home/FeaturedProperties";
import { LandlordTools } from "./_components/home/LandlordTools";
import { StatBand } from "./_components/home/StatBand";
import { DecisionShowcase } from "./_components/home/DecisionShowcase";
import { HomeContact } from "./_components/home/HomeContact";
import { FinalCTA } from "./_components/home/FinalCTA";
import { getPublicCategories } from "@/service/getCategories";
import { getPublicAmenities } from "@/service/getAmenities";

// Dynamically import heavy client components that are below the fold
const HowItWorks = dynamic(() => import("./_components/home/HowItWorks").then(mod => mod.HowItWorks));
const HomeFAQ = dynamic(() => import("./_components/home/HomeFAQ").then(mod => mod.HomeFAQ));

async function HeroSectionWithData() {
  const [categories, amenities] = await Promise.all([
    getPublicCategories(),
    getPublicAmenities(),
  ]);
  return <HeroSection categories={categories} amenities={amenities} />;
}

export default function HomePage() {
  return (
    <div className="w-full flex flex-col">
      <Suspense fallback={<div className="w-full min-h-[600px] h-screen bg-muted animate-pulse" />}>
        <HeroSectionWithData />
      </Suspense>
      <CategoryBentoGrid />
      <FeatureRow />
      <FeaturedProperties />
      <HowItWorks />
      <LandlordTools />
      <StatBand />
      <DecisionShowcase />
      <HomeFAQ />
      <HomeContact />
      <FinalCTA />
    </div>
  );
}
