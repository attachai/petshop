import { USERS } from '../data';
import { isLocalProvider } from '../config/runtime';

export const IS_LOCAL = isLocalProvider;

// ── Mock timestamp helper for app-facing order dates ─────────────────────
export const mockTs = (ms: number) => ({
  toMillis: () => ms,
  toDate: () => new Date(ms),
  seconds: Math.floor(ms / 1000),
  nanoseconds: 0,
});

const d = (dateStr: string) => mockTs(new Date(dateStr).getTime());

// ── Static mock orders per user ──────────────────────────────────────────
const INITIAL_ORDERS: Record<string, RawOrder[]> = {
  'user-001': [
    {
      id: 'ord-a001', orderNumber: 'TPS20261201', status: 'delivered',
      totalAmount: 2580, currency: 'THB',
      trackingNumber: 'TH123456789TH', carrier: 'Kerry Express',
      createdAtMs: new Date('2025-11-15').getTime(),
      items: [
        { id: 'i1', name: 'Royal Canin Maxi Adult 10kg', price: 1290, quantity: 1, image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&h=200&fit=crop&crop=face&auto=format', originalPrice: 1590 },
        { id: 'i2', name: "Hill's Science Diet Cat Adult 2kg", price: 890, quantity: 1, image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop&crop=entropy&auto=format' },
        { id: 'i3', name: 'ถุงซิปล็อคเก็บอาหารสัตว์เลี้ยง', price: 0, quantity: 1, isFreeGift: true },
      ],
    },
    {
      id: 'ord-a002', orderNumber: 'TPS20260105', status: 'shipped',
      totalAmount: 1450, currency: 'THB',
      trackingNumber: 'TH987654321TH', carrier: 'J&T Express',
      createdAtMs: new Date('2026-01-05').getTime(),
      items: [
        { id: 'i4', name: 'KONG Classic Dog Toy', price: 450, quantity: 2, image: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=200&h=200&fit=crop&crop=face&auto=format' },
        { id: 'i5', name: 'Purina Pro Plan Sensitive Dog 3kg', price: 550, quantity: 1, image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&h=200&fit=crop&auto=format' },
      ],
    },
  ],
  'user-002': [
    {
      id: 'ord-b001', orderNumber: 'TPS20251210', status: 'delivered',
      totalAmount: 1290, currency: 'THB',
      trackingNumber: 'TH112233445TH', carrier: 'Flash Express',
      createdAtMs: new Date('2025-12-10').getTime(),
      items: [
        { id: 'i6', name: 'Royal Canin Maxi Adult อาหารสุนัขพันธุ์ใหญ่ 10kg', price: 1290, originalPrice: 1590, quantity: 1, image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&h=200&fit=crop&crop=face&auto=format', badge: 'SALE' },
      ],
    },
    {
      id: 'ord-b002', orderNumber: 'TPS20260108', status: 'shipped',
      totalAmount: 1540, currency: 'THB',
      trackingNumber: 'TH556677889TH', carrier: 'Kerry Express',
      createdAtMs: new Date('2026-01-08').getTime(),
      items: [
        { id: 'i7', name: "Whiskas อาหารแมวโต รสทูน่า 1.2kg", price: 350, quantity: 2, image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&h=200&fit=crop&crop=entropy&auto=format' },
        { id: 'i8', name: 'Catit Jumbo Hooded Cat Pan ห้องน้ำแมว', price: 840, quantity: 1, image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop&crop=entropy&auto=format' },
      ],
    },
    {
      id: 'ord-b003', orderNumber: 'TPS20260120', status: 'processing',
      totalAmount: 890, currency: 'THB',
      createdAtMs: new Date('2026-01-20').getTime(),
      items: [
        { id: 'i9', name: 'KONG Classic Dog Toy ของเล่นสุนัข L', price: 450, quantity: 1, image: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=200&h=200&fit=crop&crop=face&auto=format' },
        { id: 'i10', name: 'Flexi New Classic สายจูงสุนัข 5m', price: 440, quantity: 1, image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&h=200&fit=crop&auto=format' },
      ],
    },
  ],
  'user-003': [
    {
      id: 'ord-c001', orderNumber: 'TPS20260115', status: 'pending',
      totalAmount: 3180, currency: 'THB',
      createdAtMs: new Date('2026-01-15').getTime(),
      items: [
        { id: 'i11', name: "Royal Canin Kitten อาหารลูกแมว 2kg", price: 590, quantity: 2, image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&h=200&fit=crop&crop=entropy&auto=format' },
        { id: 'i12', name: "Temptations ขนมแมว Tasty Chicken 85g", price: 120, quantity: 5, image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop&auto=format' },
        { id: 'i13', name: 'MidWest Deluxe Crinkle Cat Bed ที่นอนแมว', price: 990, quantity: 1, image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&h=200&fit=crop&auto=format' },
      ],
    },
  ],
};

// ── Static mock addresses per user ───────────────────────────────────────
const INITIAL_ADDRESSES: Record<string, RawAddress[]> = {
  'user-001': [
    { id: 'addr-a1', uid: 'user-001', label: 'บ้าน', fullName: 'Admin Thonglor', street: '88/1 ซอยทองหล่อ 13 ถนนสุขุมวิท 55', city: 'วัฒนา', state: 'กรุงเทพมหานคร', zipCode: '10110', country: 'Thailand', isDefault: true },
    { id: 'addr-a2', uid: 'user-001', label: 'ที่ทำงาน', fullName: 'Thonglor Pet Shop', street: '99 ถนนสุขุมวิท 63 (เอกมัย)', city: 'วัฒนา', state: 'กรุงเทพมหานคร', zipCode: '10110', country: 'Thailand', isDefault: false },
  ],
  'user-002': [
    { id: 'addr-b1', uid: 'user-002', label: 'บ้าน', fullName: 'สมชาย ใจดี', street: '123/45 ซอยลาดพร้าว 71', city: 'ลาดพร้าว', state: 'กรุงเทพมหานคร', zipCode: '10230', country: 'Thailand', isDefault: true },
    { id: 'addr-b2', uid: 'user-002', label: 'ที่ทำงาน', fullName: 'สมชาย ใจดี', street: '200 อาคารลุมพินีทาวเวอร์ ถนนรัชดาภิเษก', city: 'ห้วยขวาง', state: 'กรุงเทพมหานคร', zipCode: '10310', country: 'Thailand', isDefault: false },
  ],
  'user-003': [
    { id: 'addr-c1', uid: 'user-003', label: 'บ้าน', fullName: 'มาลี รักสัตว์', street: '56 หมู่บ้านบางกอกบูเลอวาร์ด ถนนพหลโยธิน', city: 'ลาดยาว', state: 'กรุงเทพมหานคร', zipCode: '10900', country: 'Thailand', isDefault: true },
  ],
};

// ── Types ─────────────────────────────────────────────────────────────────
interface RawOrder {
  id: string; orderNumber: string; status: string;
  totalAmount: number; currency: string;
  trackingNumber?: string; carrier?: string;
  createdAtMs: number;
  items: any[];
}

interface RawAddress {
  id: string; uid: string; label: string; fullName: string;
  street: string; city: string; state: string;
  zipCode: string; country: string; isDefault: boolean;
}

// ── Order helpers ─────────────────────────────────────────────────────────
const ORDERS_KEY = (uid: string) => `mock_orders_${uid}`;

function rawToOrder(r: RawOrder) {
  return { ...r, createdAt: mockTs(r.createdAtMs) };
}

export function getMockOrders(uid: string) {
  const stored = localStorage.getItem(ORDERS_KEY(uid));
  const raw: RawOrder[] = stored ? JSON.parse(stored) : (INITIAL_ORDERS[uid] || []);
  return raw.map(rawToOrder).sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
}

export function saveMockOrder(uid: string, order: RawOrder) {
  const stored = localStorage.getItem(ORDERS_KEY(uid));
  const existing: RawOrder[] = stored ? JSON.parse(stored) : (INITIAL_ORDERS[uid] || []);
  const updated = [order, ...existing];
  localStorage.setItem(ORDERS_KEY(uid), JSON.stringify(updated));
  return updated.map(rawToOrder).sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
}

export function updateMockOrderStatus(uid: string, orderId: string, status: string) {
  const stored = localStorage.getItem(ORDERS_KEY(uid));
  const raw: RawOrder[] = stored ? JSON.parse(stored) : (INITIAL_ORDERS[uid] || []);
  const updated = raw.map(o => o.id === orderId ? { ...o, status } : o);
  localStorage.setItem(ORDERS_KEY(uid), JSON.stringify(updated));
  return updated.map(rawToOrder).sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
}

// ── Address helpers ───────────────────────────────────────────────────────
const ADDR_KEY = (uid: string) => `mock_addresses_${uid}`;

export function getMockAddresses(uid: string): RawAddress[] {
  const stored = localStorage.getItem(ADDR_KEY(uid));
  return stored ? JSON.parse(stored) : (INITIAL_ADDRESSES[uid] || []);
}

export function addMockAddress(uid: string, data: Omit<RawAddress, 'id'>) {
  const list = getMockAddresses(uid);
  const newItem: RawAddress = { ...data, id: `addr-${Date.now()}` } as RawAddress;
  const updated = [...list, newItem];
  localStorage.setItem(ADDR_KEY(uid), JSON.stringify(updated));
  return updated;
}

export function updateMockAddress(uid: string, id: string, data: Partial<RawAddress>) {
  const updated = getMockAddresses(uid).map(a => a.id === id ? { ...a, ...data } : a);
  localStorage.setItem(ADDR_KEY(uid), JSON.stringify(updated));
  return updated;
}

export function deleteMockAddress(uid: string, id: string) {
  const updated = getMockAddresses(uid).filter(a => a.id !== id);
  localStorage.setItem(ADDR_KEY(uid), JSON.stringify(updated));
  return updated;
}

// ── Profile helpers ───────────────────────────────────────────────────────
const PROFILE_KEY = (uid: string) => `mock_profile_${uid}`;

export function getMockProfile(uid: string) {
  const stored = localStorage.getItem(PROFILE_KEY(uid));
  if (stored) return JSON.parse(stored);
  const user = USERS.find(u => u.uid === uid);
  if (!user) return null;
  return {
    uid: user.uid,
    displayName: user.displayName,
    firstName: user.firstName || user.displayName.split(' ')[0] || '',
    lastName: user.lastName || user.displayName.split(' ').slice(1).join(' ') || '',
    email: user.email,
    photoURL: user.photoURL || '',
    phoneNumber: user.phoneNumber || '',
    createdAt: null,
  };
}

export function saveMockProfile(uid: string, data: object) {
  const current = getMockProfile(uid) || {};
  const updated = { ...current, ...data };
  localStorage.setItem(PROFILE_KEY(uid), JSON.stringify(updated));
  return updated;
}
