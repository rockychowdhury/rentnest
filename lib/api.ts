import { ApiResponse } from "@/types";

export const API_BASE_URL = process.env.BACKEND_API_URL || "https://rentnestapi.vercel.app/api";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";

interface FetchApiOptions extends Omit<RequestInit, "body"> {
  body?: any;
}

export async function fetchApi<T = ApiResponse<any>>(endpoint: string, options: FetchApiOptions = {}): Promise<T> {
  const { body, headers, ...customConfig } = options;
  
  const config: RequestInit = {
    method: customConfig.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...customConfig,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    // If response is not ok or API explicitly returned success: false
    if (!response.ok || data.success === false) {
      const errorMsg = data.message || `Request failed with status ${response.status}`;
      // Extract detailed validation errors if the backend provides them
      const detailedError = data.errorSources?.length 
        ? `${errorMsg}: ${data.errorSources.map((e: any) => e.message).join(', ')}` 
        : errorMsg;
      
      throw new Error(detailedError);
    }

    return data as T;
  } catch (error: any) {
    // If it's a network error or an error we explicitly threw above, re-throw it.
    // This allows the caller's try/catch block to properly handle the error and pass the message to the UI.
    throw error;
  }
}
