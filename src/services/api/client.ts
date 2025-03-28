import { REQUEST_CONFIG } from '../../config/api';

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse(response: Response) {
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw new ApiError(
      data.message || response.statusText,
      response.status,
      data.code
    );
  }

  return data;
}

async function makeRequest(
  url: string,
  options: RequestInit = {},
  retries = REQUEST_CONFIG.RETRY_ATTEMPTS
): Promise<any> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...REQUEST_CONFIG.DEFAULT_HEADERS,
        ...options.headers
      }
    });

    return await handleResponse(response);
  } catch (error) {
    if (retries > 0 && shouldRetry(error)) {
      await new Promise(resolve => setTimeout(resolve, REQUEST_CONFIG.RETRY_DELAY));
      return makeRequest(url, options, retries - 1);
    }
    throw error;
  }
}

function shouldRetry(error: any): boolean {
  // Retry on network errors and 5xx server errors
  if (!error.status) return true;
  return error.status >= 500 && error.status < 600;
}

export const apiClient = {
  get: (url: string, options?: RequestInit) => 
    makeRequest(url, { ...options, method: 'GET' }),
  
  post: (url: string, data?: any, options?: RequestInit) =>
    makeRequest(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    }),
  
  put: (url: string, data?: any, options?: RequestInit) =>
    makeRequest(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  
  delete: (url: string, options?: RequestInit) =>
    makeRequest(url, { ...options, method: 'DELETE' })
};