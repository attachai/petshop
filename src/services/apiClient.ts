import { apiBaseUrl } from '../config/runtime';
import { clearAuthState } from './authStore';
import { getStoredAuthToken } from './authSession';

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  auth?: boolean;
  body?: BodyInit | Record<string, unknown> | null;
}

function normalizePath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}

function normalizeBody(body: ApiFetchOptions['body']): BodyInit | undefined {
  if (body == null) {
    return undefined;
  }

  if (
    typeof body === 'string' ||
    body instanceof Blob ||
    body instanceof FormData ||
    body instanceof URLSearchParams ||
    body instanceof ArrayBuffer
  ) {
    return body;
  }

  return JSON.stringify(body);
}

function resolveHeaders(headers: HeadersInit | undefined, body: ApiFetchOptions['body'], auth: boolean): Headers {
  const resolved = new Headers(headers);
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  if (body != null && !isFormData && !resolved.has('Content-Type')) {
    resolved.set('Content-Type', 'application/json');
  }

  if (auth) {
    const token = getStoredAuthToken();
    if (token) {
      resolved.set('Authorization', `Bearer ${token}`);
    }
  }

  return resolved;
}

async function parseResponse(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  if (!text) {
    return null;
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  return text;
}

function getErrorMessage(data: unknown, fallback: string): string {
  if (data && typeof data === 'object') {
    const maybeMessage =
      (data as { message?: unknown }).message ??
      (data as { error?: unknown }).error ??
      (data as { detail?: unknown }).detail;

    if (typeof maybeMessage === 'string' && maybeMessage.trim()) {
      return maybeMessage;
    }
  }

  return fallback;
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { auth = true, headers, body, ...init } = options;
  const response = await fetch(`${apiBaseUrl}${normalizePath(path)}`, {
    ...init,
    headers: resolveHeaders(headers, body, auth),
    body: normalizeBody(body),
  });

  const data = await parseResponse(response);

  if (response.status === 401) {
    clearAuthState();
  }

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(data, `Request failed with status ${response.status}`),
      response.status,
      data
    );
  }

  return data as T;
}
