export type AuthProvider = 'local' | 'go-api';

const rawProvider = ((import.meta.env.VITE_AUTH_PROVIDER as string | undefined) || 'local')
  .trim()
  .toLowerCase();

const rawApiBaseUrl = ((import.meta.env.VITE_API_BASE_URL as string | undefined) || 'http://localhost:8080')
  .trim();

export const authProvider: AuthProvider = rawProvider === 'go-api' ? 'go-api' : 'local';
export const isGoApiProvider = authProvider === 'go-api';
export const isLocalProvider = !isGoApiProvider;
export const apiBaseUrl = rawApiBaseUrl.replace(/\/+$/, '');
