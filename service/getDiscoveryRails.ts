import { API_BASE_URL } from "@/lib/api";
import { PropertyItem, mapBackendPropertyToPropertyItem } from "./getProperties";
import { CACHE_TAG_PROPERTIES } from "./cache-tags";
import { headers } from "next/headers";

export interface DiscoveryRail {
  id: string;
  title: string;
  subtext?: string;
  seeMoreQuery: string;
  items: PropertyItem[];
}

interface SectionConfig {
  id: string;
  title: string;
  subtext?: string;
  endpoint: string;
  seeMoreQuery: string;
  params?: Record<string, string | number>;
}

// Helper to get dynamic configs based on user location
async function getSectionConfigs(): Promise<SectionConfig[]> {
  // Get IP address
  const headersList = await headers();
  const forwardedFor = headersList.get('x-forwarded-for');
  const realIp = headersList.get('x-real-ip');
  
  let ip = "127.0.0.1";
  if (forwardedFor) {
    ip = forwardedFor.split(',')[0].trim();
  } else if (realIp) {
    ip = realIp;
  }

  // Default to Dhaka if location can't be determined or is outside BD
  let nearbyTitle = "Properties in Dhaka";
  let nearbySubtext = "Explore rental options in the capital of Bangladesh.";
  let nearbyEndpoint = "/near?districtId=26";
  let nearbySeeMore = "districtId=26";

  try {
    // Only fetch IP data if it's not a local IP
    if (ip !== "127.0.0.1" && ip !== "::1") {
      const geoRes = await fetch(`http://ip-api.com/json/${ip}`, { 
        next: { revalidate: 3600 } 
      });
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        
        if (geoData.status === "success" && geoData.countryCode === "BD") {
          // Look up district ID dynamically from the backend
          try {
            const searchRes = await fetch(`${API_BASE_URL}/areas/search?q=${encodeURIComponent(geoData.city)}`);
            if (searchRes.ok) {
              const searchData = await searchRes.json();
              if (searchData.success && searchData.data && searchData.data.length > 0) {
                // Try to find an exact match on district name, fallback to the first result's district
                const exactMatch = searchData.data.find((a: any) => 
                  a.district?.name.toLowerCase() === geoData.city.toLowerCase()
                );
                const match = exactMatch || searchData.data[0];
                
                if (match && match.districtId) {
                  const districtId = match.districtId;
                  const districtName = match.district?.name || geoData.city;
                  
                  nearbyTitle = `Around You in ${districtName}`;
                  nearbySubtext = "Explore rental options near your current location.";
                  nearbyEndpoint = `/near?districtId=${districtId}`;
                  nearbySeeMore = `districtId=${districtId}`;
                }
              }
            }
          } catch (e) {
            console.error("Failed to fetch district from backend:", e);
          }
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch IP location:", error);
  }

  return [
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
      seeMoreQuery: "sortBy=popular&sortOrder=desc",
      params: { limit: 10 }
    },
    {
      id: "budget-friendly",
      title: "Easy on the Budget",
      subtext: "Comfortable places that keep your monthly rent low.",
      endpoint: "/budget-friendly",
      seeMoreQuery: "sortBy=rentAmount&sortOrder=asc",
      params: { limit: 10 }
    },
    {
      id: "bachelors",
      title: "Made for Bachelor Life",
      subtext: "Practical spaces that fit the way you live and work.",
      endpoint: "/category/862590e5-2ed3-468d-abe5-26387f5d3b40",
      seeMoreQuery: "categoryId=862590e5-2ed3-468d-abe5-26387f5d3b40",
      params: { limit: 10 }
    },
    {
      id: "apartments",
      title: "Made for Family Living",
      subtext: "Spacious and comfortable homes for families.",
      endpoint: "/category/21157b3b-81b7-477e-abc1-6fffd2fc72bb",
      seeMoreQuery: "categoryId=21157b3b-81b7-477e-abc1-6fffd2fc72bb",
      params: { limit: 10 }
    },
    {
      id: "nearby",
      title: nearbyTitle,
      subtext: nearbySubtext,
      endpoint: nearbyEndpoint,
      seeMoreQuery: nearbySeeMore,
      params: { limit: 10 }
    },
    {
      id: "quick-available",
      title: "Moving Soon? Start Here",
      subtext: "Properties with units becoming available within the next 10 days.",
      endpoint: "/quick-available",
      seeMoreQuery: "quickAvailable=true",
      params: { limit: 10 }
    },
    {
      id: "new-this-month",
      title: "Fresh on RentNest",
      subtext: "Newly listed properties worth discovering this month.",
      endpoint: "/new-this-month",
      seeMoreQuery: "timeFilter=this-month",
      params: { limit: 10 }
    },
    {
      id: "luxury",
      title: "Live a Little Larger",
      subtext: "Premium properties for a more elevated living experience.",
      endpoint: "/luxury",
      seeMoreQuery: "sortBy=rentAmount&sortOrder=desc",
      params: { limit: 10 }
    },
    {
      id: "flexible-rent",
      title: "Stay Your Way",
      subtext: "Flexible hourly and daily rentals for short stays and getaways.",
      endpoint: "/flexible-rent",
      seeMoreQuery: "flexibleRent=true",
      params: { limit: 10 }
    }
  ];
}

export async function fetchDiscoveryRail(config: SectionConfig): Promise<DiscoveryRail | null> {
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
  const configs = await getSectionConfigs();
  const promises = configs.map(config => fetchDiscoveryRail(config));
  const results = await Promise.all(promises);
  
  return results.filter((result): result is DiscoveryRail => result !== null);
}
