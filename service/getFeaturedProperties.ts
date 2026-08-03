import { getProperties, PropertyItem } from "./getProperties";

export async function getFeaturedProperties(): Promise<PropertyItem[]> {
  try {
    const res = await getProperties({ isFeatured: true, limit: 10 });
    return res.data || [];
  } catch (error) {
    console.error("Failed to fetch featured properties:", error);
    return [];
  }
}
