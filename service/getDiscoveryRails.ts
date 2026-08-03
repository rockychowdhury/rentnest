import { getProperties, PropertyItem } from "./getProperties";

export interface DiscoveryRail {
  id: string;
  title: string;
  subtext?: string;
  seeMoreQuery: string;
  items: PropertyItem[];
}

export async function getDiscoveryRails(): Promise<DiscoveryRail[]> {
  const response = await getProperties({ limit: 50 });
  const allProperties = response.data || [];

  if (allProperties.length === 0) {
    return [];
  }

  // Set to ensure EVERY property appears in at most ONE section group (zero duplicate data!)
  const usedIds = new Set<string>();

  const getDistinctItems = (candidates: PropertyItem[], maxCount: number = 4): PropertyItem[] => {
    const items: PropertyItem[] = [];
    for (const item of candidates) {
      if (!usedIds.has(item.id)) {
        usedIds.add(item.id);
        items.push(item);
        if (items.length >= maxCount) break;
      }
    }
    return items;
  };

  // Rail 1: Featured & Verified Properties
  const featuredCandidates = allProperties.filter((p) => p.isFeatured);
  const featuredItems = getDistinctItems(
    featuredCandidates.length > 0 ? featuredCandidates : allProperties,
    4
  );

  // Rail 2: Budget-Friendly Rents (Sorted by price asc)
  const budgetCandidates = [...allProperties].sort((a, b) => a.minPrice - b.minPrice);
  const budgetItems = getDistinctItems(budgetCandidates, 4);

  // Rail 3: Quick Move-in Ready (Available units)
  const availableCandidates = allProperties.filter((p) => p.availableNow);
  const availableItems = getDistinctItems(
    availableCandidates.length > 0 ? availableCandidates : allProperties,
    4
  );

  // Rail 4: Newly Added Listings (Sorted by date desc)
  const newestCandidates = [...allProperties].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const newestItems = getDistinctItems(newestCandidates, 4);

  // Rail 5: Explore More Rentals (Remaining distinct listings)
  const exploreItems = getDistinctItems(allProperties, 4);

  const rawRails: DiscoveryRail[] = [
    {
      id: "featured-listings",
      title: "Featured & Verified Properties",
      subtext: "Hand-picked, verified listings across top locations",
      seeMoreQuery: "isFeatured=true",
      items: featuredItems,
    },
    {
      id: "budget-picks",
      title: "Budget-Friendly Rents",
      subtext: "Affordable spaces sorted from low to high rent",
      seeMoreQuery: "sort=price_asc",
      items: budgetItems,
    },
    {
      id: "quick-move-in",
      title: "Quick Move-in Ready",
      subtext: "Properties with available units ready for immediate lease",
      seeMoreQuery: "availableNow=true",
      items: availableItems,
    },
    {
      id: "new-listings",
      title: "Newly Added Listings",
      subtext: "Fresh properties posted recently",
      seeMoreQuery: "sort=newest",
      items: newestItems,
    },
    {
      id: "explore-more",
      title: "Explore More Rentals",
      subtext: "Discover additional spaces available across cities",
      seeMoreQuery: "",
      items: exploreItems,
    },
  ];

  // Return only section groups that have unique items
  return rawRails.filter((r) => r.items.length > 0);
}
