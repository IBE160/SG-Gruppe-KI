// apps/web/src/lib/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

async function apiRequest<T>(
  method: string,
  path: string,
  body?: any,
  token?: string
): Promise<ApiResponse<T>> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, config);
    const result = await response.json();

    if (!response.ok) {
      return { error: { message: result.detail || 'An unexpected error occurred', code: response.status.toString() } };
    }

    return { data: result.data };
  } catch (err) {
    console.error('API Request Error:', err);
    return { error: { message: 'Network error or unable to connect to API' } };
  }
}

export const api = {
  get: <T>(path: string, token?: string) => apiRequest<T>('GET', path, undefined, token),
  post: <T>(path: string, body: any, token?: string) => apiRequest<T>('POST', path, body, token),
  put: <T>(path: string, body: any, token?: string) => apiRequest<T>('PUT', path, body, token),
  delete: <T>(path: string, token?: string) => apiRequest<T>('DELETE', path, undefined, token),
};
