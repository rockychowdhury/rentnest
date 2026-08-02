import { getProperties, PropertyItem } from "./getProperties";

export interface DiscoveryRail {
  id: string;
  title: string;
  subtext?: string;
  seeMoreQuery: string;
  items: PropertyItem[];
}

export async function getDiscoveryRails(): Promise<DiscoveryRail[]> {
  const [
    allProps,
    featured,
    newest,
    budget,
    highlyRated,
    generatorBackup,
    availableNow,
  ] = await Promise.all([
    getProperties({ limit: 10 }),
    getProperties({ isFeatured: true, limit: 6 }),
    getProperties({ sort: "newest", limit: 6 }),
    getProperties({ maxPrice: 15000, sort: "price_asc", limit: 6 }),
    getProperties({ sort: "rating", limit: 6 }),
    getProperties({ amenities: ["42b8a12d-4cc2-4c53-806b-e8112135f38d"], limit: 6 }),
    getProperties({ availableNow: true, limit: 6 }),
  ]);

  const rails: DiscoveryRail[] = [
    {
      id: "popular-near-you",
      title: "Popular Near You in Dhaka",
      subtext: "Listings surfaced based on current division & location trends",
      seeMoreQuery: "location=dhaka",
      items: allProps.data,
    },
    {
      id: "featured-listings",
      title: "Featured Listings",
      subtext: "Hand-picked verified properties across top areas",
      seeMoreQuery: "isFeatured=true",
      items: featured.data,
    },
    {
      id: "new-this-week",
      title: "New This Week",
      subtext: "Fresh properties listed in the last 7 days",
      seeMoreQuery: "sort=newest",
      items: newest.data,
    },
    {
      id: "budget-picks",
      title: "Budget Picks (Under ৳15,000)",
      subtext: "Affordable family flats, sublets, and bachelor seat rents",
      seeMoreQuery: "maxPrice=15000&sort=price_asc",
      items: budget.data,
    },
    {
      id: "highly-rated",
      title: "Highly Rated Properties",
      subtext: "Properties with top tenant review scores and verified responsive landlords",
      seeMoreQuery: "sort=rating",
      items: highlyRated.data,
    },
    {
      id: "generator-backup",
      title: "24/7 Generator Backup",
      subtext: "Properties with guaranteed power backup for lifts and main apartment circuits",
      seeMoreQuery: "amenities=42b8a12d-4cc2-4c53-806b-e8112135f38d",
      items: generatorBackup.data,
    },
    {
      id: "quick-move-in",
      title: "Quick Move-in Ready",
      subtext: "Available units ready for immediate lease signature and handover",
      seeMoreQuery: "availableNow=true",
      items: availableNow.data,
    },
  ];

  // Filter out any empty rail dynamically
  return rails.filter((r) => r.items.length > 0);
}
