import { API_BASE_URL } from "@/lib/api";

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
  title: string;
  description: string;
  minPrice: number;
  maxPrice: number;
  primaryRentType: string;
  location: string;
  division: string;
  district: string;
  upazila: string;
  streetAddress?: string;
  categoryId: string;
  categoryName: string;
  categorySlug?: string;
  bedroomsMin: number;
  bedroomsMax: number;
  bathroomsMin: number;
  bathroomsMax: number;
  availableNow: boolean;
  availableUnits: number;
  totalUnits: number;
  isFeatured: boolean;
  rating?: number;
  reviewCount?: number;
  amenitiesList: { id: string; name: string }[];
  amenities: string[];
  coverImage: string;
  allImages: string[];
  placeholderLabel: string;
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

  if (params.isFeatured !== undefined) query.append("isFeatured", params.isFeatured.toString());
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
  if (params.sort) query.append("sort", params.sort);
  if (params.page !== undefined) query.append("page", params.page.toString());
  if (params.limit !== undefined) query.append("limit", params.limit.toString());
  
  if (params.amenities && params.amenities.length > 0) {
    query.append("amenities", params.amenities.join(","));
  }

  const url = `${API_BASE_URL}/properties?${query.toString()}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 5 },
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
      const upazila = p.address?.upazila?.name || "";
      const district = p.address?.upazila?.district?.name || "";
      const division = p.address?.upazila?.district?.division?.name || "";
      const streetAddress = p.address?.streetAddress || "";
      
      const locationParts = [streetAddress, upazila, district].filter(Boolean);
      const locationStr = locationParts.join(", ") || "Location not specified";

      const units = p.units || [];
      const images = p.images || [];
      const amenities = p.amenities || [];

      // Extract pricing & rent types
      let minPrice = 0;
      let maxPrice = 0;
      let primaryRentType = "MONTHLY";
      
      if (units.length > 0) {
        const allPrices: number[] = [];
        units.forEach((u: any) => {
          if (u.pricing && u.pricing.length > 0) {
            u.pricing.forEach((pr: any) => {
              if (pr.rentAmount) allPrices.push(Number(pr.rentAmount));
              if (pr.rentType) primaryRentType = pr.rentType;
            });
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

      // Available units
      const availableUnitsCount = units.filter((u: any) => u.status === 'AVAILABLE').length;

      // Extract amenities
      const amenitiesList = amenities.map((a: any) => ({
        id: a.amenity?.id || a.id || "",
        name: a.amenity?.name || a.name || "",
      })).filter((a: any) => Boolean(a.name));

      const amenityNames = amenitiesList.map((a: any) => a.name);

      // Extract Images
      const coverObj = images.find((i: any) => i.isCover) || images[0];
      const coverImage = coverObj?.url || "";
      const allImages = images.map((i: any) => i.url).filter(Boolean);

      // Landlord Info
      const landlord = p.landlord ? {
        fullName: p.landlord.profile?.fullName || p.landlord.email || "Landlord",
        avatarUrl: p.landlord.profile?.avatarUrl,
        email: p.landlord.email,
        phone: p.landlord.phone,
      } : undefined;

      return {
        id: p.id,
        title: p.title,
        description: p.description,
        minPrice,
        maxPrice,
        primaryRentType,
        location: locationStr,
        division,
        district,
        upazila,
        streetAddress,
        categoryId: p.category?.id || p.categoryId || "",
        categoryName: p.category?.name || "Property",
        categorySlug: p.category?.slug,
        bedroomsMin,
        bedroomsMax,
        bathroomsMin,
        bathroomsMax,
        availableNow: availableUnitsCount > 0,
        availableUnits: availableUnitsCount,
        totalUnits: p.totalUnits || units.length || 1,
        isFeatured: !!p.isFeatured,
        rating: p.rating || 0,
        reviewCount: p.reviewCount || 0,
        amenitiesList,
        amenities: amenityNames,
        coverImage,
        allImages,
        placeholderLabel: coverImage,
        landlord,
        units: units.map((u: any) => ({
          id: u.id,
          unitLabel: u.unitLabel,
          status: u.status,
          bedrooms: u.bedrooms,
          bathrooms: u.bathrooms,
          sizeSqft: u.sizeSqft,
          pricing: u.pricing,
        })),
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
