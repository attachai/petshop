import { USERS } from '../data';
import { AppUser } from '../types';
import { authProvider, isGoApiProvider } from '../config/runtime';
import { apiFetch } from './apiClient';
import { clearAuthState, setAuthUser } from './authStore';
import {
  getSessionUsers,
  setSessionUsers,
  setStoredAuthToken,
  writeStorageJson,
} from './authSession';

const PROFILE_KEY = (uid: string) => `mock_profile_${uid}`;

type LocalRegisteredUser = {
  uid: string;
  email: string;
  password: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  photoURL?: string;
  phoneNumber?: string;
  role: 'admin' | 'customer';
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : null;
}

function readString(record: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return '';
}

function readOptionalString(record: Record<string, unknown>, ...keys: string[]): string | undefined {
  const value = readString(record, ...keys);
  return value || undefined;
}

function normalizeAppUser(raw: unknown): AppUser {
  const record = asRecord(raw);
  if (!record) {
    throw new Error('Invalid auth response: missing user payload');
  }

  const uid = readString(record, 'uid', 'id', 'userId', 'user_id');
  const email = readString(record, 'email');
  const firstName = readOptionalString(record, 'firstName', 'first_name');
  const lastName = readOptionalString(record, 'lastName', 'last_name');
  const displayName =
    readString(record, 'displayName', 'display_name', 'name') ||
    `${firstName || ''} ${lastName || ''}`.trim() ||
    email;
  const roleValue = readString(record, 'role');

  if (!uid || !email) {
    throw new Error('Invalid auth response: incomplete user payload');
  }

  return {
    uid,
    email,
    displayName,
    firstName,
    lastName,
    photoURL: readOptionalString(record, 'photoURL', 'photoUrl', 'photo_url', 'avatar'),
    phoneNumber: readOptionalString(record, 'phoneNumber', 'phone_number', 'phone'),
    role: roleValue === 'admin' ? 'admin' : 'customer',
  };
}

function extractAuthPayload(raw: unknown): { user: AppUser; token?: string } {
  const outer = asRecord(raw);
  const nested = asRecord(outer?.data);
  const source = nested || outer;

  if (!source) {
    throw new Error('Invalid auth response');
  }

  const token =
    readOptionalString(source, 'token', 'accessToken', 'access_token') ||
    readOptionalString(outer || {}, 'token', 'accessToken', 'access_token');
  const userSource = source.user ?? source.account ?? source.profile ?? source;

  return {
    user: normalizeAppUser(userSource),
    token,
  };
}

function getAllLocalUsers(): LocalRegisteredUser[] {
  const sessionUsers = getSessionUsers<LocalRegisteredUser>();
  return [...USERS, ...sessionUsers];
}

async function localLogin(email: string, password: string): Promise<AppUser> {
  const found = getAllLocalUsers().find(
    (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password
  );

  if (!found) {
    throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
  }

  const user: AppUser = {
    uid: found.uid,
    email: found.email,
    displayName: found.displayName,
    firstName: found.firstName,
    lastName: found.lastName,
    photoURL: found.photoURL,
    phoneNumber: found.phoneNumber,
    role: found.role,
  };

  setAuthUser(user);
  return user;
}

async function localRegister(
  email: string,
  password: string,
  displayName: string,
  firstName?: string,
  lastName?: string,
): Promise<AppUser> {
  if (getAllLocalUsers().find((user) => user.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('อีเมลนี้ถูกใช้งานแล้ว');
  }

  const uid = `user-${Date.now()}`;
  const resolvedFirstName = firstName || displayName.split(' ')[0] || '';
  const resolvedLastName = lastName || displayName.split(' ').slice(1).join(' ') || '';
  const newUser: LocalRegisteredUser = {
    uid,
    email,
    password,
    displayName,
    firstName: resolvedFirstName,
    lastName: resolvedLastName,
    role: 'customer',
  };

  const sessionUsers = getSessionUsers<LocalRegisteredUser>();
  setSessionUsers([...sessionUsers, newUser]);
  writeStorageJson(PROFILE_KEY(uid), {
    uid,
    email,
    displayName,
    firstName: resolvedFirstName,
    lastName: resolvedLastName,
    photoURL: '',
    phoneNumber: '',
    createdAt: new Date().toISOString(),
  });

  const user: AppUser = {
    uid,
    email,
    displayName,
    firstName: resolvedFirstName,
    lastName: resolvedLastName,
    role: 'customer',
  };

  setAuthUser(user);
  return user;
}

async function localLogout(): Promise<void> {
  clearAuthState();
}

async function apiLogin(email: string, password: string): Promise<AppUser> {
  const response = await apiFetch<unknown>('/api/auth/login', {
    method: 'POST',
    auth: false,
    body: { email, password },
  });
  const { user, token } = extractAuthPayload(response);

  if (token) {
    setStoredAuthToken(token);
  }

  setAuthUser(user);
  return user;
}

async function apiRegister(
  email: string,
  password: string,
  displayName: string,
  firstName?: string,
  lastName?: string,
): Promise<AppUser> {
  const response = await apiFetch<unknown>('/api/auth/register', {
    method: 'POST',
    auth: false,
    body: { email, password, displayName, firstName, lastName },
  });

  try {
    const { user, token } = extractAuthPayload(response);
    if (token) {
      setStoredAuthToken(token);
    }
    setAuthUser(user);
    return user;
  } catch {
    return apiLogin(email, password);
  }
}

async function apiLogout(): Promise<void> {
  try {
    await apiFetch('/api/auth/logout', {
      method: 'POST',
    });
  } catch {
    // Ignore logout network failures and still clear local session state.
  }

  clearAuthState();
}

export { authStore } from './authStore';

export const authService = {
  provider: authProvider,
  isGoApi: isGoApiProvider,
  login: isGoApiProvider ? apiLogin : localLogin,
  register: isGoApiProvider ? apiRegister : localRegister,
  logout: isGoApiProvider ? apiLogout : localLogout,
};
