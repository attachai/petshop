import { AppUser } from '../types';

export const AUTH_USER_STORAGE_KEY = 'pet_auth_user';
export const AUTH_TOKEN_STORAGE_KEY = 'pet_auth_token';
export const SESSION_USERS_STORAGE_KEY = 'pet_registered_users';

function canUseLocalStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function readStorageItem(key: string): string | null {
  try {
    if (!canUseLocalStorage()) {
      return null;
    }

    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorageItem(key: string, value: string): void {
  try {
    if (!canUseLocalStorage()) {
      return;
    }

    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage write errors and keep the app usable.
  }
}

export function removeStorageItem(key: string): void {
  try {
    if (!canUseLocalStorage()) {
      return;
    }

    window.localStorage.removeItem(key);
  } catch {
    // Ignore storage removal errors and keep the app usable.
  }
}

export function readStorageJson<T>(key: string, fallback: T): T {
  const raw = readStorageItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStorageJson(key: string, value: unknown): void {
  writeStorageItem(key, JSON.stringify(value));
}

export function getStoredAuthUser(): AppUser | null {
  return readStorageJson<AppUser | null>(AUTH_USER_STORAGE_KEY, null);
}

export function setStoredAuthUser(user: AppUser): void {
  writeStorageJson(AUTH_USER_STORAGE_KEY, user);
}

export function clearStoredAuthUser(): void {
  removeStorageItem(AUTH_USER_STORAGE_KEY);
}

export function getStoredAuthToken(): string {
  return readStorageItem(AUTH_TOKEN_STORAGE_KEY) || '';
}

export function setStoredAuthToken(token: string): void {
  writeStorageItem(AUTH_TOKEN_STORAGE_KEY, token);
}

export function clearStoredAuthToken(): void {
  removeStorageItem(AUTH_TOKEN_STORAGE_KEY);
}

export function clearPersistedAuth(): void {
  clearStoredAuthUser();
  clearStoredAuthToken();
}

export function getSessionUsers<T>(): T[] {
  return readStorageJson<T[]>(SESSION_USERS_STORAGE_KEY, []);
}

export function setSessionUsers(users: unknown[]): void {
  writeStorageJson(SESSION_USERS_STORAGE_KEY, users);
}
