import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Royal Canin Maxi Adult อาหารสุนัขพันธุ์ใหญ่ 10kg",
    price: 1290,
    originalPrice: 1590,
    category: "Dog Food",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&h=600&fit=crop&crop=face&auto=format",
    images: [
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&h=600&fit=crop&crop=face&auto=format",
      "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=600&h=600&fit=crop&crop=face&auto=format",
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&h=600&fit=crop&auto=format"
    ],
    rating: 4.9,
    reviews: 312,
    description: "อาหารสุนัขพรีเมียมสูตรพิเศษสำหรับสุนัขพันธุ์ใหญ่ อุดมด้วยโปรตีนคุณภาพสูงจากไก่และข้าว ช่วยบำรุงกล้ามเนื้อและกระดูก เสริมความแข็งแรง เหมาะสำหรับสุนัขอายุ 15 เดือนขึ้นไป",
    selectableGifts: [
      { id: 999, name: "ถุงอาหารทดลอง Royal Canin 100g", image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&h=200&fit=crop&crop=face&auto=format" },
      { id: 996, name: "ชามอาหารสแตนเลส", image: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=200&h=200&fit=crop&crop=face&auto=format" },
      { id: 995, name: "ถุงซิปล็อคเก็บอาหารสัตว์เลี้ยง", image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&h=200&fit=crop&auto=format" }
    ],
    reviewsList: [
      { id: '1', userName: 'คุณมานี', rating: 5, comment: 'น้องหมากินแล้วชอบมาก ขนสวยขึ้นชัดเจน แนะนำเลยครับ', date: '2025-12-10' },
      { id: '2', userName: 'คุณสมหญิง', rating: 5, comment: 'คุณภาพดีมาก น้องหมาสุขภาพแข็งแรงขึ้นเยอะหลังเปลี่ยนมากิน Royal Canin', date: '2025-12-15' }
    ]
  },
  {
    id: 2,
    name: "Hill's Science Diet อาหารแมวโต Adult Indoor 2kg",
    price: 890,
    category: "Cat Food",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop&crop=entropy&auto=format",
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=600&fit=crop&crop=entropy&auto=format"
    ],
    rating: 4.7,
    reviews: 189,
    description: "อาหารแมวสูตรพิเศษสำหรับแมวโตที่เลี้ยงในบ้าน อุดมด้วยไฟเบอร์ช่วยลดปัญหาก้อนขน ช่วยควบคุมน้ำหนักและบำรุงระบบย่อยอาหาร ให้พลังงานสมดุลตลอดวัน",
    freeGift: {
      id: 998,
      name: "หวีกำจัดขนแมว",
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop&auto=format"
    },
    reviewsList: [
      { id: '3', userName: 'คุณพิม', rating: 5, comment: 'น้องแมวชอบมากเลยค่ะ กินหมดจานทุกมื้อ ขนสวยและก้อนขนน้อยลงมาก', date: '2025-11-20' }
    ]
  },
  {
    id: 3,
    name: "Kong Classic ของเล่นยางกรอกอาหารสุนัข",
    price: 459,
    originalPrice: 599,
    category: "Toys",
    image: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=600&h=600&fit=crop&crop=face&auto=format",
    images: [
      "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=600&h=600&fit=crop&crop=face&auto=format",
      "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=600&h=600&fit=crop&auto=format"
    ],
    rating: 4.6,
    reviews: 143,
    description: "ของเล่นยางธรรมชาติสำหรับสุนัข สามารถกรอกอาหารหรือขนมไว้ข้างใน ช่วยกระตุ้นสมองและลดความเบื่อหน่ายของน้องหมา ทนทานพิเศษสำหรับสุนัขที่ชอบกัดเคี้ยว",
    selectableGifts: [
      { id: 994, name: "ขนมสุนัขพาสต้า Kong Stuff'N", image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&h=200&fit=crop&crop=face&auto=format" },
      { id: 993, name: "ลูกบอลยางสีสด", image: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=200&h=200&fit=crop&crop=face&auto=format" }
    ],
    reviewsList: []
  },
  {
    id: 4,
    name: "ที่นอนสัตว์เลี้ยงทรงกลม เนื้อนุ่มพิเศษ ขนาด M",
    price: 699,
    originalPrice: 899,
    category: "Beds & Furniture",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&h=600&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=600&fit=crop&auto=format"
    ],
    rating: 4.8,
    reviews: 96,
    description: "ที่นอนทรงกลมขนฟูนุ่มพิเศษ เหมาะสำหรับแมวและสุนัขพันธุ์เล็ก-กลาง ผ้าถอดซักทำความสะอาดได้ง่าย กันลื่นด้านล่าง รับน้ำหนักได้ถึง 15 กก.",
    reviewsList: []
  },
  {
    id: 5,
    name: "แชมพูสุนัข Pro Series สูตรอ่อนโยน Whitening 500ml",
    price: 320,
    originalPrice: 420,
    category: "Grooming",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&h=600&fit=crop&auto=format",
    rating: 4.5,
    reviews: 78,
    description: "แชมพูสุนัขสูตรอ่อนโยนเหมาะสำหรับผิวบอบบาง สูตร Whitening ช่วยให้ขนขาวสะอาด ลดกลิ่น และบำรุงผิวหนัง ปราศจากพาราเบนและสารเคมีอันตราย",
    freeGift: {
      id: 997,
      name: "ครีมนวดขนสุนัข 100ml",
      image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&h=200&fit=crop&auto=format"
    },
    reviewsList: []
  },
  {
    id: 6,
    name: "สายจูงสุนัขแบบ Retractable อัตโนมัติ 5 เมตร",
    price: 459,
    category: "Leash & Collar",
    image: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=600&h=600&fit=crop&auto=format",
    rating: 4.4,
    reviews: 112,
    description: "สายจูงแบบหดอัตโนมัติ ยาวถึง 5 เมตร ล็อคสายได้ทันที ด้ามจับยางกันลื่น รับน้ำหนักสุนัขได้ถึง 30 กก. เหมาะสำหรับสุนัขพันธุ์กลาง พร้อมระบบเบรกนิรภัย",
    reviewsList: []
  },
  {
    id: 7,
    name: "Dentastix ขนมขัดฟันสุนัข ลดกลิ่นปาก 7 ชิ้น",
    price: 189,
    category: "Treats",
    image: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=600&h=600&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=600&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&h=600&fit=crop&crop=face&auto=format"
    ],
    rating: 4.7,
    reviews: 264,
    description: "ขนมสุนัขรูปแท่งช่วยขัดฟันและลดการสะสมของคราบหินปูน ลดกลิ่นปากได้ 80% สุนัขชอบเป็นพิเศษ เหมาะสำหรับสุนัขขนาดกลาง อายุ 4 เดือนขึ้นไป",
    reviewsList: [
      { id: '4', userName: 'คุณณัฐ', rating: 5, comment: 'น้องหมาชอบมากครับ กลิ่นปากดีขึ้นชัดเจน คุ้มค่ามากๆ สั่งซ้ำทุกเดือนเลย', date: '2025-10-05' }
    ]
  },
  {
    id: 8,
    name: "คอนโดแมว 3 ชั้น พร้อมกระดานข่วนเล็บและของเล่น",
    price: 1890,
    originalPrice: 2390,
    category: "Beds & Furniture",
    image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=600&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop&crop=entropy&auto=format",
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=600&fit=crop&crop=entropy&auto=format"
    ],
    rating: 4.9,
    reviews: 87,
    description: "คอนโดแมว 3 ชั้น โครงสร้างแน่นหนา หุ้มด้วยเชือกปอสำหรับข่วนเล็บ มีแพลตฟอร์มนอน 2 ชั้น กล่องบ้านพัก และของเล่นแขวน รับน้ำหนักได้ 15 กก.",
    selectableGifts: [
      { id: 992, name: "ของเล่นตุ๊กตาแมวแบบแขวน", image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&h=200&fit=crop&auto=format" },
      { id: 991, name: "แผ่นรองข่วนเล็บแมวกระดาษลูกฟูก", image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop&crop=entropy&auto=format" }
    ],
    reviewsList: [
      { id: '5', userName: 'คุณแอน', rating: 5, comment: 'น้องแมวชอบมากเลยค่ะ อยู่บนคอนโดทั้งวัน คุ้มค่ามากๆ ประกอบง่าย', date: '2025-11-30' },
      { id: '6', userName: 'คุณเดียร์', rating: 5, comment: 'แข็งแรงทนทาน น้องแมวใช้งานทุกวัน ราคาคุ้มค่ามาก แนะนำค่ะ', date: '2025-12-01' }
    ]
  },
  {
    id: 9,
    name: "Catsan กระบะทรายแมวคาร์บอนดูดซับกลิ่น 10L",
    price: 349,
    category: "Cat Litter",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop&crop=entropy&auto=format",
    rating: 4.3,
    reviews: 156,
    description: "ทรายแมวสูตรคาร์บอนแอคทีฟ ดูดซับกลิ่นได้ยาวนาน 7 วัน เกาะตัวเร็ว จับก้อนแน่น ฝุ่นน้อยมาก น้ำหนักเบา เหมาะสำหรับแมวทุกสายพันธุ์",
    reviewsList: []
  },
  {
    id: 10,
    name: "Purina Pro Plan อาหารลูกแมว Kitten Chicken 1.5kg",
    price: 750,
    originalPrice: 890,
    category: "Cat Food",
    image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=600&fit=crop&crop=entropy&auto=format",
    images: [
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=600&fit=crop&crop=entropy&auto=format",
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop&auto=format"
    ],
    rating: 4.8,
    reviews: 201,
    description: "อาหารลูกแมวสูตรพิเศษ อุดมด้วย DHA และ ARA สำหรับพัฒนาสมองและดวงตา โปรตีนจากไก่คุณภาพสูง ช่วยเสริมสร้างกล้ามเนื้อและระบบภูมิคุ้มกัน เหมาะตั้งแต่แรกเกิด–1 ปี",
    freeGift: {
      id: 990,
      name: "ขนมแมวซอง Whiskas 1 ชิ้น",
      image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&h=200&fit=crop&crop=entropy&auto=format"
    },
    reviewsList: [
      { id: '7', userName: 'คุณปิ่น', rating: 5, comment: 'ลูกแมวชอบมากค่ะ กินหมดจาน โตไว สุขภาพดีมาก แนะนำเลยค่ะ', date: '2025-12-20' }
    ]
  }
];

export const CATEGORIES = [
  "All", "Dog Food", "Cat Food", "Toys", "Beds & Furniture",
  "Grooming", "Leash & Collar", "Treats", "Cat Litter", "Health & Care", "Accessories"
];

export interface MockUser {
  uid: string;
  email: string;
  password: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  photoURL?: string;
  phoneNumber?: string;
  role: 'admin' | 'customer';
}

export const USERS: MockUser[] = [
  {
    uid: 'user-001',
    email: 'admin@thonglorpet.com',
    password: 'Admin@1234',
    displayName: 'Admin Thonglor',
    firstName: 'Admin',
    lastName: 'Thonglor',
    phoneNumber: '081-234-5678',
    role: 'admin',
  },
  {
    uid: 'user-002',
    email: 'demo@thonglorpet.com',
    password: 'Demo@1234',
    displayName: 'สมชาย ใจดี',
    firstName: 'สมชาย',
    lastName: 'ใจดี',
    phoneNumber: '082-345-6789',
    role: 'customer',
  },
  {
    uid: 'user-003',
    email: 'test@thonglorpet.com',
    password: 'Test@1234',
    displayName: 'มาลี รักสัตว์',
    firstName: 'มาลี',
    lastName: 'รักสัตว์',
    phoneNumber: '083-456-7890',
    role: 'customer',
  },
];
