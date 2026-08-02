export const API_BASE_URL = process.env.BACKEND_API_URL || "https://rentnestapi.vercel.app/api";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";

interface FetchApiOptions extends Omit<RequestInit, "body"> {
  body?: any;
}

export async function fetchApi<T>(endpoint: string, options: FetchApiOptions = {}): Promise<T> {
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

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data as T;
  } catch (error: any) {
    throw new Error(error.message || "An unexpected error occurred");
  }
}
