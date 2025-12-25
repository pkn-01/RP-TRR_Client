const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const API_BASE_URL = API_URL;

interface FetchOptions extends RequestInit {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

export async function apiFetch(url: string, options?: string | FetchOptions | "GET" | "POST" | "PUT" | "DELETE", body?: any) {
  const token = localStorage.getItem("token");

  // Support both old style: apiFetch(url, method, body) and new style: apiFetch(url, options)
  let method = "GET";
  let requestBody: any = undefined;
  let headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  if (typeof options === "string") {
    // Old style: apiFetch(url, method, body)
    method = options;
    // If body is FormData, don't stringify it
    if (body instanceof FormData) {
      requestBody = body;
    } else {
      requestBody = body ? JSON.stringify(body) : undefined;
    }
  } else if (typeof options === "object" && options !== null) {
    // New style: apiFetch(url, { method, body, headers, ... })
    method = options.method || "GET";
    headers = {
      ...headers,
      ...options.headers,
    };
    // Handle body - can be string or object
    if (options.body) {
      // If body is FormData, don't stringify it
      if (options.body instanceof FormData) {
        requestBody = options.body;
      } else {
        requestBody = typeof options.body === "string" ? options.body : options.body;
      }
      // If body is FormData, don't set Content-Type - let browser set it with boundary
      if (requestBody instanceof FormData) {
        delete headers["Content-Type"];
      }
    }
  }

  const res = await fetch(API_URL + url, {
    method,
    headers,
    body: requestBody,
  });

  console.log(`[apiFetch] ${method} ${url} → Status: ${res.status}`);

  // Handle error responses
  if (!res.ok) {
    try {
      const error = await res.json();
      console.error(`[apiFetch] Error response:`, error);
      throw new Error(error.message || `API Error: ${res.status}`);
    } catch (parseError) {
      // If response isn't JSON, use status text
      console.error(`[apiFetch] Parse error:`, parseError);
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }
  }

  // Handle successful responses
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const data = await res.json();
    console.log(`[apiFetch] Success response:`, data);
    return data;
  }

  // If no content-type or not JSON, return null (for 204 No Content, etc.)
  const text = await res.text();
  const result = text ? JSON.parse(text) : null;
  console.log(`[apiFetch] Text response:`, result);
  return result;
}
