import { getProperties, PropertyItem } from "@/service/getProperties";

export async function getTenantFavorites(): Promise<{ success: boolean; data: PropertyItem[] }> {
  // Mocking favorites by fetching some properties from the existing getProperties service
  // In reality, this would hit a favorites endpoint that returns live availability
  const response = await getProperties({ limit: 4 });
  return {
    success: response.data.length > 0,
    data: response.data,
  };
}
