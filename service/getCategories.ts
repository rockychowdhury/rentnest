import { API_BASE_URL } from "@/lib/api";

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

export async function getPublicCategories(): Promise<CategoryItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];
    const json = await res.json();
    return json.data || json || [];
  } catch (error) {
    console.error("Failed to fetch public categories:", error);
    return [];
  }
}
