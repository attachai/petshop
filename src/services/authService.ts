import { AppUser } from '../types';
import { USERS } from '../data';

const AUTH_PROVIDER = (import.meta.env.VITE_AUTH_PROVIDER as string) || 'local';
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:8080';

const STORAGE_KEY = 'pet_auth_user';
const TOKEN_KEY = 'pet_auth_token';
const SESSION_USERS_KEY = 'pet_registered_users';
const PROFILE_KEY = (uid: string) => `mock_profile_${uid}`;

// ── Module-level auth store ───────────────────────────────────────────────
// Shared auth state for the active provider.
type AuthListener = (user: AppUser | null) => void;

let _currentUser: AppUser | null = null;
const _listeners = new Set<AuthListener>();

function _notify(user: AppUser | null) {
  _currentUser = user;
  _listeners.forEach(fn => fn(user));
}

// Restore session from localStorage on module load
try {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) _currentUser = JSON.parse(stored) as AppUser;
} catch {
  _currentUser = null;
}

export const authStore = {
  get currentUser(): AppUser | null {
    return _currentUser;
  },
  onAuthStateChanged(callback: AuthListener): () => void {
    _listeners.add(callback);
    callback(_currentUser);
    return () => { _listeners.delete(callback); };
  },
};

// ── Local provider ────────────────────────────────────────────────────────
function _getAllLocalUsers(): Array<{ uid: string; email: string; password: string; displayName: string; photoURL?: string; phoneNumber?: string; role: 'admin' | 'customer' }> {
  const session = JSON.parse(localStorage.getItem(SESSION_USERS_KEY) || '[]');
  return [...USERS, ...session];
}

async function localLogin(email: string, password: string): Promise<AppUser> {
  const found = _getAllLocalUsers().find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!found) throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
  const user: AppUser = {
    uid: found.uid,
    email: found.email,
    displayName: found.displayName,
    photoURL: found.photoURL,
    phoneNumber: found.phoneNumber,
    role: found.role,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  _notify(user);
  return user;
}

async function localRegister(
  email: string,
  password: string,
  displayName: string,
  firstName?: string,
  lastName?: string,
): Promise<AppUser> {
  if (_getAllLocalUsers().find(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('อีเมลนี้ถูกใช้งานแล้ว');
  }
  const uid = `user-${Date.now()}`;
  const fn = firstName || displayName.split(' ')[0] || '';
  const ln = lastName || displayName.split(' ').slice(1).join(' ') || '';
  const newUser = { uid, email, password, displayName, firstName: fn, lastName: ln, role: 'customer' as const };

  const session = JSON.parse(localStorage.getItem(SESSION_USERS_KEY) || '[]');
  session.push(newUser);
  localStorage.setItem(SESSION_USERS_KEY, JSON.stringify(session));

  const profile = { uid, email, displayName, firstName: fn, lastName: ln, photoURL: '', phoneNumber: '', createdAt: new Date().toISOString() };
  localStorage.setItem(PROFILE_KEY(uid), JSON.stringify(profile));

  const user: AppUser = { uid, email, displayName, firstName: fn, lastName: ln, role: 'customer' };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  _notify(user);
  return user;
}

async function localLogout(): Promise<void> {
  localStorage.removeItem(STORAGE_KEY);
  _notify(null);
}

// ── Go API provider ───────────────────────────────────────────────────────
async function apiLogin(email: string, password: string): Promise<AppUser> {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'เข้าสู่ระบบไม่สำเร็จ');
  const user: AppUser = data.user;
  if (data.token) localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  _notify(user);
  return user;
}

async function apiRegister(
  email: string,
  password: string,
  displayName: string,
  firstName?: string,
  lastName?: string,
): Promise<AppUser> {
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, displayName, firstName, lastName }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'สมัครสมาชิกไม่สำเร็จ');
  return apiLogin(email, password);
}

async function apiLogout(): Promise<void> {
  const token = localStorage.getItem(TOKEN_KEY);
  try {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch { /* ignore network errors on logout */ }
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(TOKEN_KEY);
  _notify(null);
}

// ── Exported auth service ─────────────────────────────────────────────────
const isGoApi = AUTH_PROVIDER === 'go-api';

export const authService = {
  provider: AUTH_PROVIDER,
  login: isGoApi ? apiLogin : localLogin,
  register: isGoApi ? apiRegister : localRegister,
  logout: isGoApi ? apiLogout : localLogout,
};
