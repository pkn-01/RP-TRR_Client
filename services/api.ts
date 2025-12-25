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
  // Parse response body if possible
  const contentType = res.headers.get("content-type");
  let parsedData: any = null;
  let rawText: string | null = null;
  if (contentType && contentType.includes("application/json")) {
    try {
      parsedData = await res.json();
    } catch (e) {
      parsedData = null;
    }
  } else {
    try {
      rawText = await res.text();
      parsedData = rawText ? JSON.parse(rawText) : null;
    } catch (e) {
      // not JSON
      parsedData = rawText;
    }
  }

  // Backward-compatibility:
  // - For GET requests (default/no options) return parsed data directly (existing behavior)
  // - For non-GET requests return a Response-like object so callers can check `response.ok` and call `response.json()`
  if (method === "GET") {
    if (!res.ok) {
      // preserve previous behavior for GET: throw on non-OK
      const msg = parsedData?.message || `${res.status} ${res.statusText}`;
      throw new Error(msg);
    }
    console.log(`[apiFetch] Success response:`, parsedData);
    return parsedData;
  }

  // If this is a protected API call and there's no token, return 401-like response
  const isApiPath = url.startsWith('/api');
  const isPublicEndpoint = url.includes('line-oa');
  if (isApiPath && !isPublicEndpoint && !token) {
    const unauth = {
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      headers: new Headers(),
      json: async () => ({ message: 'คุณต้องเข้าสู่ระบบก่อนทำรายการ' }),
      text: async () => JSON.stringify({ message: 'คุณต้องเข้าสู่ระบบก่อนทำรายการ' }),
      data: { message: 'คุณต้องเข้าสู่ระบบก่อนทำรายการ' },
    } as const;
    console.warn('[apiFetch] Missing auth token for protected API:', url);
    return unauth;
  }

  // For POST/PUT/DELETE etc: return an object that mimics the fetch Response API
  const responseLike = {
    ok: res.ok,
    status: res.status,
    statusText: res.statusText,
    headers: res.headers,
    json: async () => parsedData,
    text: async () => (rawText !== null ? rawText : JSON.stringify(parsedData)),
    data: parsedData,
  } as const;

  if (!res.ok) {
    console.error(`[apiFetch] Error response:`, parsedData);
  } else {
    console.log(`[apiFetch] Success response:`, parsedData);
  }

  return responseLike;
}
