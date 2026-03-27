import {
  getMockOrders,
  saveMockOrder,
  updateMockOrderStatus,
  getMockAddresses,
  addMockAddress,
  updateMockAddress,
  deleteMockAddress,
  getMockProfile,
  saveMockProfile,
  mockTs,
} from './mockDataService';

const IS_LOCAL = (import.meta.env.VITE_AUTH_PROVIDER as string) !== 'go-api';
const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:8080';

// ── Shared types ──────────────────────────────────────────────────────────
export interface OrderItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  quantity: number;
  image?: string;
  isFreeGift?: boolean;
  freeGift?: { name: string; image: string } | null;
  selectableGifts?: { name: string; image: string }[] | null;
  badge?: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  trackingNumber?: string;
  carrier?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  currency: string;
  items: OrderItem[];
  createdAt: { toMillis: () => number; toDate: () => Date };
}

export interface Address {
  id: string;
  uid: string;
  label: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface Profile {
  uid: string;
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  photoURL: string;
  phoneNumber: string;
  createdAt?: string | null;
}

export interface CreateOrderInput {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  currency: string;
  trackingNumber?: string;
  carrier?: string;
  createdAtMs: number;
  items: OrderItem[];
}

// ── Go API helpers ────────────────────────────────────────────────────────
function getToken(): string {
  return localStorage.getItem('pet_auth_token') || '';
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...(options?.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `API error ${res.status}`);
  return data as T;
}

// Convert an API order (ISO date string) to our Order shape
function apiOrderToOrder(o: any): Order {
  const ms = new Date(o.createdAt).getTime();
  return { ...o, createdAt: mockTs(ms) };
}

// ── Error helper ──────────────────────────────────────────────────────────
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleDataError(error: unknown, op: OperationType, path: string | null): never {
  const msg = error instanceof Error ? error.message : String(error);
  console.error(`DataService [${op}] ${path ?? ''}:`, msg);
  throw new Error(msg);
}

// ── Orders ────────────────────────────────────────────────────────────────
async function getOrders(uid: string): Promise<Order[]> {
  if (IS_LOCAL) return getMockOrders(uid) as unknown as Order[];
  const list = await apiFetch<any[]>(`/api/orders?uid=${uid}`);
  return list.map(apiOrderToOrder);
}

async function createOrder(uid: string, order: CreateOrderInput): Promise<void> {
  if (IS_LOCAL) {
    saveMockOrder(uid, order);
    return;
  }
  await apiFetch('/api/orders', {
    method: 'POST',
    body: JSON.stringify({ uid, ...order }),
  });
}

async function updateOrderStatus(uid: string, orderId: string, status: Order['status']): Promise<Order[]> {
  if (IS_LOCAL) return updateMockOrderStatus(uid, orderId, status) as unknown as Order[];
  await apiFetch(`/api/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  return getOrders(uid);
}

// ── Addresses ─────────────────────────────────────────────────────────────
async function getAddresses(uid: string): Promise<Address[]> {
  if (IS_LOCAL) return getMockAddresses(uid) as Address[];
  return apiFetch<Address[]>(`/api/addresses?uid=${uid}`);
}

async function createAddress(uid: string, data: Omit<Address, 'id'>): Promise<Address[]> {
  if (IS_LOCAL) return addMockAddress(uid, data) as Address[];
  await apiFetch('/api/addresses', { method: 'POST', body: JSON.stringify({ uid, ...data }) });
  return getAddresses(uid);
}

async function updateAddress(uid: string, id: string, data: Partial<Address>): Promise<Address[]> {
  if (IS_LOCAL) return updateMockAddress(uid, id, data) as Address[];
  await apiFetch(`/api/addresses/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  return getAddresses(uid);
}

async function deleteAddress(uid: string, id: string): Promise<Address[]> {
  if (IS_LOCAL) return deleteMockAddress(uid, id) as Address[];
  await apiFetch(`/api/addresses/${id}`, { method: 'DELETE' });
  return getAddresses(uid);
}

// ── Profile ───────────────────────────────────────────────────────────────
async function getProfile(uid: string): Promise<Profile | null> {
  if (IS_LOCAL) return getMockProfile(uid) as Profile | null;
  return apiFetch<Profile>(`/api/profile/${uid}`);
}

async function updateProfile(uid: string, data: Partial<Profile>): Promise<void> {
  if (IS_LOCAL) {
    saveMockProfile(uid, data);
    return;
  }
  await apiFetch(`/api/profile/${uid}`, { method: 'PUT', body: JSON.stringify(data) });
}

// ── Exported service ──────────────────────────────────────────────────────
export const dataService = {
  getOrders,
  createOrder,
  updateOrderStatus,
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  getProfile,
  updateProfile,
};
