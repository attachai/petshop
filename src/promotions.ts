export interface Promotion {
  id: string;
  label: string;
  title: string;
  description: string;
  ctaText: string;
  image: string;
  badge?: string;
  /** matches product.category - 'All' shows everything */
  categoryFilter: string;
  collectionHeading: string;
  collectionSubheading: string;
  /** tailwind text-color class for label */
  labelColor: string;
  /** tailwind bg-color class for badge pill */
  badgeColor: string;
  /** rgba start color for the left gradient overlay */
  overlayColor: string;
  /** hex/rgb accent used for collection page banner tint */
  bannerTint: string;
}

export const PROMOTIONS: Promotion[] = [
  {
    id: 'pet-world',
    label: 'Thonglor Pet Shop 2026',
    title: 'ดูแลสัตว์เลี้ยงที่รัก\nด้วยสิ่งที่ดีที่สุด',
    description:
      "สินค้าคัดพิเศษสำหรับน้องหมาและน้องแมว จากแบรนด์ชั้นนำระดับโลก Royal Canin, Hill's, Purina พร้อมส่งตรงถึงบ้านคุณ",
    ctaText: 'ช้อปสินค้าทั้งหมด',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1400&h=700&fit=crop&auto=format',
    categoryFilter: 'All',
    collectionHeading: 'Thonglor Pet Shop Collection 2026',
    collectionSubheading:
      'สินค้าคัดพิเศษสำหรับสัตว์เลี้ยงที่คุณรัก ครบครันทั้งอาหาร ของเล่น อุปกรณ์กรูมมิ่ง และเฟอร์นิเจอร์สัตว์เลี้ยง',
    labelColor: 'text-primary',
    badgeColor: 'bg-primary',
    overlayColor: 'rgba(2, 20, 10, 0.78)',
    bannerTint: 'rgba(4, 120, 87, 0.85)',
  },
  {
    id: 'dog-nutrition',
    label: 'Premium Dog Food',
    title: 'โภชนาการดี\nน้องหมาสุขภาพแข็งแรง',
    description:
      'อาหารสุนัขพรีเมียมจากแบรนด์ชั้นนำ คัดสรรสูตรเหมาะสำหรับทุกช่วงวัยและทุกสายพันธุ์ โปรตีนสูง บำรุงขนและกระดูก',
    ctaText: 'ดูอาหารสุนัขทั้งหมด',
    image: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=1400&h=700&fit=crop&auto=format',
    badge: 'ลด 20% ทุกออเดอร์',
    categoryFilter: 'Dog Food',
    collectionHeading: 'Premium Dog Nutrition',
    collectionSubheading:
      'อาหารสุนัขพรีเมียมสูตรพิเศษ คัดสรรโดยผู้เชี่ยวชาญด้านโภชนาการสัตว์เลี้ยง เพื่อสุขภาพที่ดีของน้องหมาคุณ',
    labelColor: 'text-amber-400',
    badgeColor: 'bg-amber-500',
    overlayColor: 'rgba(30, 18, 4, 0.82)',
    bannerTint: 'rgba(180, 83, 9, 0.85)',
  },
  {
    id: 'cat-lovers',
    label: 'Cat Lovers Collection',
    title: 'เพื่อน้องแมวที่รัก\nสินค้าพรีเมียมครบครัน',
    description:
      'ทุกสิ่งที่น้องแมวต้องการ ตั้งแต่อาหารคุณภาพสูง คอนโดแมว ของเล่น ไปจนถึงกระบะทรายดูดกลิ่นระดับพรีเมียม',
    ctaText: 'ช้อปสินค้าสำหรับแมว',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1400&h=700&fit=crop&auto=format',
    badge: 'ส่งฟรีทุกออเดอร์',
    categoryFilter: 'Cat Food',
    collectionHeading: 'Cat Lovers Collection',
    collectionSubheading:
      'สินค้าพรีเมียมสำหรับน้องแมวที่คุณรัก ทั้งอาหาร ขนม ของเล่น และคอนโดแมว ครบในที่เดียว',
    labelColor: 'text-pink-400',
    badgeColor: 'bg-pink-500',
    overlayColor: 'rgba(30, 5, 20, 0.80)',
    bannerTint: 'rgba(190, 24, 93, 0.82)',
  },
  {
    id: 'play-care',
    label: 'Play & Care',
    title: 'ของเล่นและอุปกรณ์\nดูแลน้องสัตว์เลี้ยง',
    description:
      'กระตุ้นความสนุกและดูแลสุขภาพน้องด้วยของเล่นคุณภาพ สายจูง ที่นอน และอุปกรณ์กรูมมิ่งระดับพรีเมียม',
    ctaText: 'ช้อปของเล่น & อุปกรณ์',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1400&h=700&fit=crop&auto=format',
    badge: 'สินค้าใหม่',
    categoryFilter: 'Toys',
    collectionHeading: 'Play & Care Collection',
    collectionSubheading:
      'ของเล่นและอุปกรณ์ดูแลสัตว์เลี้ยงคุณภาพพรีเมียม ทุกอย่างที่น้องหมาและน้องแมวต้องการเพื่อชีวิตที่มีความสุข',
    labelColor: 'text-violet-400',
    badgeColor: 'bg-violet-500',
    overlayColor: 'rgba(20, 8, 35, 0.78)',
    bannerTint: 'rgba(109, 40, 217, 0.82)',
  },
];
