// ===== UTILITY FUNCTIONS =====

/**
 * Lấy base URL từ environment
 */
function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL || '';
}

/**
 * Kết hợp base URL và endpoint một cách an toàn, tránh double slashes
 */
function buildUrl(baseUrl: string, endpoint: string): string {
  // Remove trailing slashes from baseUrl
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '');
  
  // Ensure endpoint starts with a slash
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  return `${normalizedBaseUrl}${normalizedEndpoint}`;
}

/**
 * Tạo headers cơ bản
 */
function createBaseHeaders(options?: RequestInit): HeadersInit {
  const headers: HeadersInit = {
    ...(options?.headers as Record<string, string>),
  };

  // Chỉ set Content-Type nếu không phải FormData
  // FormData cần browser tự động set Content-Type với boundary
  if (!(options?.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
}

/**
 * Tạo headers có authentication
 * Với httpOnly cookies, không cần thêm Authorization header
 */
function createAuthHeaders(options?: RequestInit): HeadersInit {
  // Cookies được tự động gửi với credentials: "include"
  return createBaseHeaders(options);
}

/**
 * Custom error class để lưu trữ status code
 */
class FetchError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'FetchError';
  }
}

/**
 * Thực hiện fetch request cơ bản
 */
async function performFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const baseUrl = getBaseUrl();
  const url = buildUrl(baseUrl, endpoint);

  const response = await fetch(url, {
    ...options,
    credentials: 'include',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new FetchError(response.status, `Fetch failed: ${response.status} ${errorText}`);
  }

  return (await response.json()) as T;
}

/**
 * Fetch client cho refresh token - không có retry logic để tránh infinite loop
 * Chỉ dùng internal trong retryRefreshToken
 */
async function refreshTokenFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const headers = createAuthHeaders(options);
  return performFetch<T>(endpoint, { ...options, headers });
}

/**
 * Retry logic cho refresh token (tối đa 3 lần)
 */
async function retryRefreshToken(): Promise<boolean> {
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempting to refresh token (attempt ${attempt}/${maxRetries})`);

      // Sử dụng refreshTokenFetch thay vì AuthService.refreshToken để tránh circular dependency
      await refreshTokenFetch<any>('/auth/refresh', {
        method: 'POST',
      });
      console.log('Token refreshed successfully');
      return true;
    } catch (error) {
      console.error(`Refresh token attempt ${attempt} failed:`, error);

      if (attempt < maxRetries) {
        // Delay trước khi retry (exponential backoff)
        const delay = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s
        console.log(`Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        console.error('Max retries reached, refresh token failed');
        return false;
      }
    }
  }

  return false;
}

/**
 * Redirect to sign-in page
 */
function redirectToSignIn() {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    window.location.href = '/sign-in';
  }
}

/**
 * Xử lý lỗi authentication và retry
 */
async function handleAuthError<T>(endpoint: string, options?: RequestInit): Promise<T> {
  console.log('Authentication error detected, attempting to refresh token...');

  const refreshSuccess = await retryRefreshToken();

  if (refreshSuccess) {
    // Thử lại request với token mới
    const headers = createAuthHeaders(options);
    const baseUrl = getBaseUrl();
    const url = buildUrl(baseUrl, endpoint);

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      // Nếu vẫn là 401 sau khi refresh, redirect to sign-in
      if (response.status === 401) {
        console.error('Still unauthorized after token refresh, redirecting to sign-in');
        redirectToSignIn();
        const errorText = await response.text();
        throw new FetchError(response.status, `Fetch failed: ${response.status} ${errorText}`);
      }
      const errorText = await response.text();
      throw new FetchError(response.status, `Fetch failed: ${response.status} ${errorText}`);
    }

    return (await response.json()) as T;
  } else {
    // After 3 retries failed, redirect to sign-in
    console.error('Unable to refresh token after 3 attempts, redirecting to sign-in');
    redirectToSignIn();
    throw new Error('Authentication failed: Unable to refresh token');
  }
}

// ===== MAIN EXPORT FUNCTIONS =====

/**
 * Fetch client cơ bản - không có authentication và retry logic
 * Dùng cho các API public không cần đăng nhập
 */
export async function publicFetchClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const headers = createBaseHeaders(options);
  return performFetch<T>(endpoint, { ...options, headers });
}

/**
 * Fetch client có authentication - có retry logic khi gặp lỗi 401/403
 * Dùng cho các API cần đăng nhập
 */
export async function fetchClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const headers = createAuthHeaders(options);

  try {
    return await performFetch<T>(endpoint, { ...options, headers });
  } catch (error: any) {
    // Không retry cho refresh token endpoint để tránh infinite loop
    if (endpoint === '/auth/refresh') {
      throw error;
    }

    // Kiểm tra nếu là lỗi authentication (401 hoặc 403)
    if (error instanceof FetchError && (error.status === 401 || error.status === 403)) {
      return handleAuthError<T>(endpoint, { ...options, headers });
    }
    // Fallback: check error message for backward compatibility
    if (error.message && (error.message.includes('401') || error.message.includes('403'))) {
      return handleAuthError<T>(endpoint, { ...options, headers });
    }
    throw error;
  }
}
