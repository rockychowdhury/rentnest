import { API_BASE_URL } from "@/lib/api";
import { CACHE_TAG_PROPERTIES } from "./cache-tags";

export interface PropertyUnitSummary {
  id: string;
  unitLabel: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  sizeSqft?: number;
  pricing?: {
    id: string;
    rentType: string;
    rentAmount: number;
    securityDeposit?: number;
  }[];
}

export interface PropertyItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  minPrice: number;
  maxPrice: number;
  primaryRentType: string;
  location: string;
  division: string;
  district: string;
  area: string;
  streetAddress?: string;
  categoryId: string;
  categoryName: string;
  categorySlug?: string;
  bedroomsMin: number;
  bedroomsMax: number;
  bathroomsMin: number;
  bathroomsMax: number;
  sizeSqft?: number;
  availableNow: boolean;
  availableUnits: number;
  totalUnits: number;
  isFeatured: boolean;
  rating?: number;
  reviewCount?: number;
  amenitiesList: { id: string; name: string }[];
  amenities: string[];
  coverImage: string;
  landlord?: {
    fullName?: string;
    avatarUrl?: string;
    email?: string;
    phone?: string;
  };
  units: PropertyUnitSummary[];
  createdAt: string;
  popularityScore: number;
}

export interface GetPropertiesQueryParams {
  searchTerm?: string;
  areaId?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  bedrooms?: number;
  bathrooms?: number;
  rentType?: string;
  isFeatured?: boolean;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc";
  page?: number;
  limit?: number;
}

export interface GetPropertiesResponse {
  data: PropertyItem[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getProperties(params: GetPropertiesQueryParams = {}): Promise<GetPropertiesResponse> {
  const query = new URLSearchParams();


  // Deployed backend has a Zod validation bug with boolean query params, 
  // so we filter isFeatured on the client side instead of sending it.
  if (params.searchTerm) query.append("searchTerm", params.searchTerm);
  if (params.areaId) query.append("areaId", params.areaId);
  if (params.categoryId) query.append("categoryId", params.categoryId);
  if (params.minPrice !== undefined) query.append("minPrice", params.minPrice.toString());
  if (params.maxPrice !== undefined) query.append("maxPrice", params.maxPrice.toString());
  if (params.bedrooms !== undefined) query.append("bedrooms", params.bedrooms.toString());
  if (params.bathrooms !== undefined) query.append("bathrooms", params.bathrooms.toString());
  if (params.rentType) query.append("rentType", params.rentType);

  
  if (params.sort) {
    query.append("sort", params.sort);
    if (params.sort === "newest") {
      query.append("sortBy", "createdAt");
      query.append("sortOrder", "desc");
    } else if (params.sort === "oldest") {
      query.append("sortBy", "createdAt");
      query.append("sortOrder", "asc");
    }
  }

  if (params.page !== undefined) query.append("page", params.page.toString());
  if (params.limit !== undefined) query.append("limit", params.limit.toString());
  
  if (params.amenities && params.amenities.length > 0) {
    query.append("amenities", params.amenities.join(","));
  }

  const url = `${API_BASE_URL}/properties?${query.toString()}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 300, tags: [CACHE_TAG_PROPERTIES] },
    });

    if (!res.ok) {
      console.error(`Failed to fetch properties: ${res.status}`);
      return { data: [], total: 0, page: 1, totalPages: 1 };
    }

    const responseData = await res.json();
    
    if (!responseData.success) {
      return { data: [], total: 0, page: 1, totalPages: 1 };
    }

    const backendProperties = responseData.data || [];
    const meta = responseData.meta || { total: 0, page: 1, limit: 10 };

    const mappedData: PropertyItem[] = backendProperties.map((p: any) => {
      const area = p.address?.area || "";
      const district = p.address?.district || "";
      const division = p.address?.division || "";
      const streetAddress = p.address?.streetAddress || "";
      
      const locationParts = [streetAddress, area, district].filter(Boolean);
      const locationStr = locationParts.join(", ") || "Location not specified";

      const cheapUnit = p.cheapUnit || {};
      const expensiveUnit = p.expensiveUnit || cheapUnit;

      const minPrice = cheapUnit.pricing?.rentAmount ? Number(cheapUnit.pricing.rentAmount) : 0;
      const maxPrice = expensiveUnit.pricing?.rentAmount ? Number(expensiveUnit.pricing.rentAmount) : minPrice;
      const primaryRentType = cheapUnit.pricing?.rentType || "MONTHLY";

      const bedroomsMin = cheapUnit.beds || 0;
      const bedroomsMax = expensiveUnit.beds || bedroomsMin;
      
      const bathroomsMin = cheapUnit.bath || 0;
      const bathroomsMax = expensiveUnit.bath || bathroomsMin;

      const sizeSqft = cheapUnit.size || undefined;

      const coverImage = p.image?.url || "";

      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        description: "", // Not provided in compact JSON
        minPrice,
        maxPrice,
        primaryRentType,
        location: locationStr,
        division,
        district,
        area,
        streetAddress,
        categoryId: p.category?.id || "",
        categoryName: p.category?.name || "Property",
        categorySlug: "",
        bedroomsMin,
        bedroomsMax,
        bathroomsMin,
        bathroomsMax,
        sizeSqft,
        availableNow: true, // Fallback
        availableUnits: 1, // Fallback
        totalUnits: 1, // Fallback
        isFeatured: !!p.isFeatured,
        rating: 0,
        reviewCount: 0,
        amenitiesList: [],
        amenities: [],
        coverImage,
        landlord: undefined,
        units: [], // Simplified payload doesn't have all units
        createdAt: new Date().toISOString(), // Fallback for sorting if missing
        popularityScore: p.isFeatured ? 100 : 50,
      };
    });

    // Perform guaranteed client-side filtering for Bedrooms, Bathrooms, and Price Range
    let filteredData = mappedData;

    if (params.isFeatured !== undefined) {
      filteredData = filteredData.filter((p) => p.isFeatured === params.isFeatured);
    }

    if (params.bedrooms !== undefined && !isNaN(Number(params.bedrooms))) {
      const minBeds = Number(params.bedrooms);
      filteredData = filteredData.filter(
        (p) => p.bedroomsMax >= minBeds || (p.units && p.units.some((u) => u.bedrooms >= minBeds))
      );
    }

    if (params.bathrooms !== undefined && !isNaN(Number(params.bathrooms))) {
      const minBaths = Number(params.bathrooms);
      filteredData = filteredData.filter(
        (p) => p.bathroomsMax >= minBaths || (p.units && p.units.some((u) => u.bathrooms >= minBaths))
      );
    }

    if (params.minPrice !== undefined && !isNaN(Number(params.minPrice))) {
      const minP = Number(params.minPrice);
      filteredData = filteredData.filter((p) => (p.maxPrice || p.minPrice) >= minP);
    }

    if (params.maxPrice !== undefined && !isNaN(Number(params.maxPrice))) {
      const maxP = Number(params.maxPrice);
      filteredData = filteredData.filter((p) => p.minPrice <= maxP);
    }

    if (params.categoryId) {
      filteredData = filteredData.filter((p) => p.categoryId === params.categoryId);
    }

    if (params.searchTerm) {
      const term = params.searchTerm.toLowerCase();
      filteredData = filteredData.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.location.toLowerCase().includes(term)
      );
    }



    if (params.amenities && params.amenities.length > 0) {
      filteredData = filteredData.filter((p) => {
        // Since compact JSON might not send full amenities list, this is best-effort.
        // If property has amenities array of IDs/names, check them.
        if (!p.amenities || p.amenities.length === 0) return true; // Can't filter client-side if data missing
        return params.amenities!.every((reqAmenity) => 
          p.amenities.some((a) => a === reqAmenity) || 
          p.amenitiesList.some((al) => al.id === reqAmenity || al.name === reqAmenity)
        );
      });
    }

    // Perform guaranteed sorting on filteredData
    if (params.sort === "oldest") {
      filteredData.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (params.sort === "price_asc") {
      filteredData.sort((a, b) => a.minPrice - b.minPrice);
    } else if (params.sort === "price_desc") {
      filteredData.sort((a, b) => b.minPrice - a.minPrice);
    } else if (params.sort === "newest") {
      filteredData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const limit = meta.limit || 10;
    const totalCount = filteredData.length;
    const totalPages = Math.ceil(totalCount / limit) || 1;

    return {
      data: filteredData,
      total: totalCount,
      page: meta.page || 1,
      totalPages: totalPages,
    };
  } catch (error) {
    console.error("Error fetching properties:", error);
    return { data: [], total: 0, page: 1, totalPages: 1 };
  }
}
