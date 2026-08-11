"use server";

import { getProperties, GetPropertiesQueryParams } from "@/service/getProperties";

export async function fetchMoreProperties(params: GetPropertiesQueryParams) {
  return await getProperties(params);
}
