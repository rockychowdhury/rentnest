import { API_BASE_URL } from "@/lib/api";

export interface PropertyItem {
  id: string;
  title: string;
  description: string;
  minPrice: number;
  maxPrice: number;
  location: string;
  division: string;
  district: string;
  upazila: string;
  categorySlug: string;
  categoryName: string;
  bedroomsMin: number;
  bedroomsMax: number;
  bathroomsMin: number;
  bathroomsMax: number;
  rentType: "MONTHLY" | "DAILY";
  availableNow: boolean;
  availableUnits: number;
  totalUnits: number;
  isFeatured: boolean;
  rating?: number;
  reviewCount?: number;
  amenities: string[];
  placeholderLabel: string;
  createdAt: string;
  popularityScore: number;
}

export interface GetPropertiesQueryParams {
  searchTerm?: string;
  location?: string;
  division?: string;
  district?: string;
  upazila?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  bedrooms?: number;
  bathrooms?: number;
  rentType?: string;
  availableNow?: boolean;
  isFeatured?: boolean;
  sort?: "newest" | "price_asc" | "price_desc" | "rating" | "popular";
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

  if (params.searchTerm) query.append("searchTerm", params.searchTerm);
  if (params.location) query.append("location", params.location);
  if (params.division) query.append("division", params.division);
  if (params.district) query.append("district", params.district);
  if (params.upazila) query.append("upazila", params.upazila);
  if (params.categoryId) query.append("categoryId", params.categoryId);
  if (params.minPrice !== undefined) query.append("minPrice", params.minPrice.toString());
  if (params.maxPrice !== undefined) query.append("maxPrice", params.maxPrice.toString());
  if (params.bedrooms !== undefined) query.append("bedrooms", params.bedrooms.toString());
  if (params.bathrooms !== undefined) query.append("bathrooms", params.bathrooms.toString());
  if (params.rentType) query.append("rentType", params.rentType);
  if (params.availableNow !== undefined) query.append("availableNow", params.availableNow.toString());
  if (params.isFeatured !== undefined) query.append("isFeatured", params.isFeatured.toString());
  if (params.sort) query.append("sort", params.sort);
  if (params.page !== undefined) query.append("page", params.page.toString());
  if (params.limit !== undefined) query.append("limit", params.limit.toString());
  
  if (params.amenities && params.amenities.length > 0) {
    query.append("amenities", params.amenities.join(","));
  }

  const url = `${API_BASE_URL}/properties?${query.toString()}`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
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
      // Safely extract location data based on the provided address schema
      const upazila = p.address?.upazila?.name || "";
      const district = p.address?.upazila?.district?.name || "";
      const division = p.address?.upazila?.district?.division?.name || "";
      
      const locationParts = [p.address?.streetAddress, upazila, district].filter(Boolean);
      const locationStr = locationParts.join(", ") || "Location not specified";

      // These relations might or might not be populated in the list endpoint.
      // If they are missing, we fall back to sensible defaults.
      const units = p.units || [];
      const images = p.images || [];
      const amenities = p.amenities || [];

      // Extract pricing
      let minPrice = 0;
      let maxPrice = 0;
      
      if (units.length > 0) {
        const allPrices: number[] = [];
        units.forEach((u: any) => {
          if (u.pricing && u.pricing.length > 0) {
            u.pricing.forEach((pr: any) => allPrices.push(Number(pr.rentAmount)));
          }
        });
        
        if (allPrices.length > 0) {
          minPrice = Math.min(...allPrices);
          maxPrice = Math.max(...allPrices);
        }
      }

      // Extract beds/baths
      let bedroomsMin = 0;
      let bedroomsMax = 0;
      let bathroomsMin = 0;
      let bathroomsMax = 0;

      if (units.length > 0) {
        const beds = units.map((u: any) => u.bedrooms || 0);
        const baths = units.map((u: any) => u.bathrooms || 0);
        bedroomsMin = Math.min(...beds);
        bedroomsMax = Math.max(...beds);
        bathroomsMin = Math.min(...baths);
        bathroomsMax = Math.max(...baths);
      }

      // Extract available units
      const availableUnitsCount = units.filter((u: any) => u.status === 'AVAILABLE').length;

      // Extract amenities (expecting { amenity: { name: '...' } })
      const amenityNames = amenities.map((a: any) => a.amenity?.name).filter(Boolean);

      return {
        id: p.id,
        title: p.title,
        description: p.description,
        minPrice,
        maxPrice,
        location: locationStr,
        division,
        district,
        upazila,
        categorySlug: p.category?.id || "unknown", // Using ID as fallback
        categoryName: p.category?.name || "Unknown",
        bedroomsMin,
        bedroomsMax,
        bathroomsMin,
        bathroomsMax,
        rentType: "MONTHLY", // Defaulting to MONTHLY as safe fallback
        availableNow: availableUnitsCount > 0,
        availableUnits: availableUnitsCount,
        totalUnits: p.totalUnits || 1,
        isFeatured: !!p.isFeatured,
        rating: 0,
        reviewCount: 0,
        amenities: amenityNames,
        placeholderLabel: images.length > 0 ? (images.find((i: any) => i.isCover)?.url || images[0].url) : "", 
        createdAt: p.createdAt,
        popularityScore: p.isFeatured ? 100 : 50,
      };
    });

    const limit = meta.limit || 10;
    const totalPages = Math.ceil(meta.total / limit) || 1;

    return {
      data: mappedData,
      total: meta.total || 0,
      page: meta.page || 1,
      totalPages: totalPages,
    };
  } catch (error) {
    console.error("Error fetching properties:", error);
    return { data: [], total: 0, page: 1, totalPages: 1 };
  }
}
