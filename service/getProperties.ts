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
  districtId?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  bedrooms?: number;
  bathrooms?: number;
  rentType?: string;
  flexibleRent?: boolean;
  isFeatured?: boolean;
  timeFilter?: string;
  quickAvailable?: boolean;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}

export interface GetPropertiesResponse {
  data: PropertyItem[];
  total: number;
  page: number;
  totalPages: number;
}

export function mapBackendPropertyToPropertyItem(p: any): PropertyItem {
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
}

export async function getProperties(params: GetPropertiesQueryParams = {}): Promise<GetPropertiesResponse> {
  const query = new URLSearchParams();

  if (params.searchTerm) query.append("searchTerm", params.searchTerm);
  if (params.areaId) query.append("areaId", params.areaId);
  if (params.districtId) query.append("districtId", params.districtId);
  if (params.categoryId) query.append("categoryId", params.categoryId);
  if (params.minPrice !== undefined) query.append("minPrice", params.minPrice.toString());
  if (params.maxPrice !== undefined) query.append("maxPrice", params.maxPrice.toString());
  if (params.bedrooms !== undefined) query.append("bedrooms", params.bedrooms.toString());
  if (params.bathrooms !== undefined) query.append("bathrooms", params.bathrooms.toString());
  if (params.rentType) query.append("rentType", params.rentType);
  if (params.flexibleRent !== undefined) query.append("flexibleRent", params.flexibleRent.toString());
  if (params.isFeatured !== undefined) query.append("isFeatured", params.isFeatured.toString());
  if (params.timeFilter) query.append("timeFilter", params.timeFilter);
  if (params.quickAvailable !== undefined) query.append("quickAvailable", params.quickAvailable.toString());

  if (params.sortBy) query.append("sortBy", params.sortBy);
  if (params.sortOrder) query.append("sortOrder", params.sortOrder);

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

    const mappedData: PropertyItem[] = backendProperties.map(mapBackendPropertyToPropertyItem);

    const limit = meta.limit || 10;
    const totalCount = meta.total !== undefined ? meta.total : mappedData.length;
    const totalPages = Math.ceil(totalCount / limit) || 1;

    return {
      data: mappedData,
      total: totalCount,
      page: meta.page || 1,
      totalPages: totalPages,
    };
  } catch (error) {
    console.error("Error fetching properties:", error);
    return { data: [], total: 0, page: 1, totalPages: 1 };
  }
}
