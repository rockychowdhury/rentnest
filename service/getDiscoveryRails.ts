import { API_BASE_URL } from "@/lib/api";
import { PropertyItem, mapBackendPropertyToPropertyItem } from "./getProperties";
import { CACHE_TAG_PROPERTIES } from "./cache-tags";

export interface DiscoveryRail {
  id: string;
  title: string;
  subtext?: string;
  seeMoreQuery: string;
  items: PropertyItem[];
}

const SECTION_CONFIGS = [
  {
    id: "featured",
    title: "Featured Properties",
    subtext: "A handpicked selection of properties worth exploring.",
    endpoint: "/featured",
    seeMoreQuery: "isFeatured=true"
  },
  {
    id: "popular",
    title: "Popular Right Now",
    subtext: "See the properties tenants are checking out most.",
    endpoint: "/popular",
    seeMoreQuery: "sort=popular",
    params: { limit: 10 }
  },
  {
    id: "budget-friendly",
    title: "Easy on the Budget",
    subtext: "Comfortable places that keep your monthly rent low.",
    endpoint: "/budget-friendly",
    seeMoreQuery: "sort=price_asc",
    params: { limit: 10 }
  },
  {
    id: "bachelors",
    title: "Made for Bachelor Life",
    subtext: "Practical spaces that fit the way you live and work.",
    endpoint: "/bachelors",
    seeMoreQuery: "",
    params: { limit: 10 }
  },
  {
    id: "apartments",
    title: "Made for Family Living",
    subtext: "Spacious and comfortable homes for families.",
    endpoint: "/apartments",
    seeMoreQuery: "",
    params: { limit: 10 }
  },
  {
    id: "nearby",
    title: "Around You",
    subtext: "Explore rental options near your current location.",
    endpoint: "/dhaka",
    seeMoreQuery: "districtId=26",
    params: { limit: 10 }
  },
  {
    id: "quick-available",
    title: "Moving Soon? Start Here",
    subtext: "Properties with units becoming available within the next 10 days.",
    endpoint: "/quick-available",
    seeMoreQuery: "",
    params: { limit: 10 }
  },
  {
    id: "new-this-month",
    title: "Fresh on RentNest",
    subtext: "Newly listed properties worth discovering this month.",
    endpoint: "/new-this-month",
    seeMoreQuery: "sort=newest",
    params: { limit: 10 }
  },
  {
    id: "luxury",
    title: "Live a Little Larger",
    subtext: "Premium properties for a more elevated living experience.",
    endpoint: "/luxury",
    seeMoreQuery: "sort=price_desc",
    params: { limit: 10 }
  },
  {
    id: "flexible-rent",
    title: "Stay Your Way",
    subtext: "Flexible hourly and daily rentals for short stays and getaways.",
    endpoint: "/flexible-rent",
    seeMoreQuery: "rentType=DAILY",
    params: { limit: 10 }
  },
  {
    id: "random",
    title: "Something You Might Like",
    subtext: "A fresh mix of properties picked just for discovery.",
    endpoint: "",
    seeMoreQuery: "",
    params: { limit: 10 }
  }
];

export async function fetchDiscoveryRail(config: typeof SECTION_CONFIGS[0]): Promise<DiscoveryRail | null> {
  const url = new URL(`${API_BASE_URL}/properties${config.endpoint}`);
  
  if (config.params) {
    Object.entries(config.params).forEach(([key, value]) => {
      url.searchParams.append(key, value.toString());
    });
  }

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 300, tags: [CACHE_TAG_PROPERTIES, `discovery-${config.id}`] }
    });
    
    if (!res.ok) return null;
    
    const responseData = await res.json();
    if (!responseData.success) return null;
    
    const backendProperties = Array.isArray(responseData.data) 
      ? responseData.data 
      : [];
      
    const properties = backendProperties.map(mapBackendPropertyToPropertyItem);
    
    if (properties.length === 0) {
      return null;
    }

    return {
      id: config.id,
      title: config.title,
      subtext: config.subtext,
      seeMoreQuery: config.seeMoreQuery,
      items: properties
    };
  } catch (error) {
    console.error(`Failed to fetch discovery section ${config.id}:`, error);
    return null;
  }
}

export async function getDiscoveryRails(): Promise<DiscoveryRail[]> {
  const promises = SECTION_CONFIGS.map(config => fetchDiscoveryRail(config));
  const results = await Promise.all(promises);
  
  return results.filter((result): result is DiscoveryRail => result !== null);
}
