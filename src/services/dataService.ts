import {
  addMockAddress,
  deleteMockAddress,
  getMockAddresses,
  getMockOrders,
  getMockProfile,
  mockTs,
  saveMockOrder,
  saveMockProfile,
  updateMockAddress,
  updateMockOrderStatus,
} from './mockDataService';
import { isLocalProvider } from '../config/runtime';
import { apiFetch } from './apiClient';

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

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : null;
}

function unwrapData(value: unknown): unknown {
  const record = asRecord(value);
  if (!record || record.data === undefined) {
    return value;
  }

  return record.data;
}

function unwrapCollection(value: unknown): unknown[] {
  const payload = unwrapData(value);
  if (Array.isArray(payload)) {
    return payload;
  }

  const record = asRecord(payload);
  if (!record) {
    return [];
  }

  if (Array.isArray(record.items)) {
    return record.items;
  }

  if (Array.isArray(record.results)) {
    return record.results;
  }

  return [];
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

function readNumber(record: Record<string, unknown>, ...keys: string[]): number {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return 0;
}

function readNullableNumber(record: Record<string, unknown>, ...keys: string[]): number | null {
  for (const key of keys) {
    const value = record[key];
    if (value == null) {
      continue;
    }

    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return null;
}

function readBoolean(record: Record<string, unknown>, ...keys: string[]): boolean {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'boolean') {
      return value;
    }
  }

  return false;
}

function withQuery(path: string, params: Record<string, string | undefined>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();
  return query ? `${path}?${query}` : path;
}

function normalizeTimestamp(value: unknown) {
  const record = asRecord(value);

  if (record && typeof record.toMillis === 'function' && typeof record.toDate === 'function') {
    return {
      toMillis: () => (record.toMillis as () => number)(),
      toDate: () => (record.toDate as () => Date)(),
    };
  }

  if (record && typeof record.seconds === 'number') {
    return mockTs(record.seconds * 1000);
  }

  const ms =
    value instanceof Date
      ? value.getTime()
      : typeof value === 'number'
        ? value
        : typeof value === 'string'
          ? new Date(value).getTime()
          : NaN;

  return mockTs(Number.isFinite(ms) ? ms : Date.now());
}

function normalizeOrderStatus(value: unknown): Order['status'] {
  const status = typeof value === 'string' ? value.toLowerCase() : 'pending';
  if (
    status === 'pending' ||
    status === 'processing' ||
    status === 'shipped' ||
    status === 'delivered' ||
    status === 'cancelled'
  ) {
    return status;
  }

  return 'pending';
}

function normalizeGift(value: unknown): { name: string; image: string } | null {
  const record = asRecord(value);
  if (!record) {
    return null;
  }

  const name = readString(record, 'name');
  const image = readString(record, 'image');

  if (!name || !image) {
    return null;
  }

  return { name, image };
}

function normalizeSelectableGifts(value: unknown): { name: string; image: string }[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const gifts = value
    .map((item) => normalizeGift(item))
    .filter((item): item is { name: string; image: string } => Boolean(item));

  return gifts.length > 0 ? gifts : null;
}

function normalizeOrderItem(value: unknown): OrderItem {
  const record = asRecord(value) || {};

  return {
    id: readString(record, 'id') || String(readNumber(record, 'id')),
    name: readString(record, 'name'),
    price: readNumber(record, 'price'),
    originalPrice: readNullableNumber(record, 'originalPrice', 'original_price'),
    quantity: readNumber(record, 'quantity') || 1,
    image: readOptionalString(record, 'image'),
    isFreeGift: readBoolean(record, 'isFreeGift', 'is_free_gift'),
    freeGift: normalizeGift(record.freeGift ?? record.free_gift),
    selectableGifts: normalizeSelectableGifts(record.selectableGifts ?? record.selectable_gifts),
    badge: readOptionalString(record, 'badge') ?? null,
  };
}

function normalizeOrder(value: unknown): Order {
  const record = asRecord(value);
  if (!record) {
    throw new Error('Invalid order payload');
  }

  return {
    id: readString(record, 'id'),
    orderNumber: readString(record, 'orderNumber', 'order_number'),
    trackingNumber: readOptionalString(record, 'trackingNumber', 'tracking_number'),
    carrier: readOptionalString(record, 'carrier'),
    status: normalizeOrderStatus(record.status),
    totalAmount: readNumber(record, 'totalAmount', 'total_amount'),
    currency: readString(record, 'currency') || 'THB',
    items: Array.isArray(record.items) ? record.items.map((item) => normalizeOrderItem(item)) : [],
    createdAt: normalizeTimestamp(record.createdAt ?? record.created_at ?? record.createdAtMs ?? record.created_at_ms),
  };
}

function normalizeAddress(value: unknown): Address {
  const record = asRecord(value);
  if (!record) {
    throw new Error('Invalid address payload');
  }

  return {
    id: readString(record, 'id'),
    uid: readString(record, 'uid', 'userId', 'user_id'),
    label: readString(record, 'label'),
    fullName: readString(record, 'fullName', 'full_name'),
    street: readString(record, 'street'),
    city: readString(record, 'city'),
    state: readString(record, 'state', 'province'),
    zipCode: readString(record, 'zipCode', 'zip_code', 'postalCode', 'postal_code'),
    country: readString(record, 'country') || 'Thailand',
    isDefault: readBoolean(record, 'isDefault', 'is_default'),
  };
}

function normalizeProfile(value: unknown): Profile | null {
  const record = asRecord(unwrapData(value));
  if (!record) {
    return null;
  }

  return {
    uid: readString(record, 'uid', 'id', 'userId', 'user_id'),
    displayName:
      readString(record, 'displayName', 'display_name', 'name') ||
      `${readString(record, 'firstName', 'first_name')} ${readString(record, 'lastName', 'last_name')}`.trim(),
    firstName: readString(record, 'firstName', 'first_name'),
    lastName: readString(record, 'lastName', 'last_name'),
    email: readString(record, 'email'),
    photoURL: readString(record, 'photoURL', 'photoUrl', 'photo_url', 'avatar'),
    phoneNumber: readString(record, 'phoneNumber', 'phone_number', 'phone'),
    createdAt: readOptionalString(record, 'createdAt', 'created_at') ?? null,
  };
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleDataError(error: unknown, op: OperationType, path: string | null): Error {
  const normalized = error instanceof Error ? error : new Error(String(error));
  console.error(`DataService [${op}] ${path ?? ''}:`, normalized.message);
  return normalized;
}

async function getOrders(uid: string): Promise<Order[]> {
  if (isLocalProvider) {
    return getMockOrders(uid) as Order[];
  }

  const response = await apiFetch<unknown>(withQuery('/api/orders', { uid }));
  return unwrapCollection(response).map((item) => normalizeOrder(item));
}

async function createOrder(uid: string, order: CreateOrderInput): Promise<void> {
  if (isLocalProvider) {
    saveMockOrder(uid, order);
    return;
  }

  await apiFetch('/api/orders', {
    method: 'POST',
    body: { uid, ...order },
  });
}

async function updateOrderStatus(uid: string, orderId: string, status: Order['status']): Promise<Order[]> {
  if (isLocalProvider) {
    return updateMockOrderStatus(uid, orderId, status) as Order[];
  }

  await apiFetch(`/api/orders/${orderId}/status`, {
    method: 'PATCH',
    body: { status },
  });
  return getOrders(uid);
}

async function getAddresses(uid: string): Promise<Address[]> {
  if (isLocalProvider) {
    return getMockAddresses(uid) as Address[];
  }

  const response = await apiFetch<unknown>(withQuery('/api/addresses', { uid }));
  return unwrapCollection(response).map((item) => normalizeAddress(item));
}

async function createAddress(uid: string, data: Omit<Address, 'id'>): Promise<Address[]> {
  if (isLocalProvider) {
    return addMockAddress(uid, data) as Address[];
  }

  await apiFetch('/api/addresses', {
    method: 'POST',
    body: { uid, ...data },
  });
  return getAddresses(uid);
}

async function updateAddress(uid: string, id: string, data: Partial<Address>): Promise<Address[]> {
  if (isLocalProvider) {
    return updateMockAddress(uid, id, data) as Address[];
  }

  await apiFetch(`/api/addresses/${id}`, {
    method: 'PATCH',
    body: data,
  });
  return getAddresses(uid);
}

async function deleteAddress(uid: string, id: string): Promise<Address[]> {
  if (isLocalProvider) {
    return deleteMockAddress(uid, id) as Address[];
  }

  await apiFetch(`/api/addresses/${id}`, {
    method: 'DELETE',
  });
  return getAddresses(uid);
}

async function getProfile(uid: string): Promise<Profile | null> {
  if (isLocalProvider) {
    return getMockProfile(uid) as Profile | null;
  }

  const response = await apiFetch<unknown>(`/api/profile/${uid}`);
  return normalizeProfile(response);
}

async function updateProfile(uid: string, data: Partial<Profile>): Promise<void> {
  if (isLocalProvider) {
    saveMockProfile(uid, data);
    return;
  }

  await apiFetch(`/api/profile/${uid}`, {
    method: 'PUT',
    body: data,
  });
}

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
