export type SubscriptionLevel = 0 | 1 | 2;
export type ProfileTheme = 'classic' | 'sky' | 'indigo';

export const SUBSCRIPTION_PLANS = [
  {
    level: 1 as const,
    name: 'Boost',
    description: 'เพิ่มการมองเห็นโปรเจกต์ของคุณในหน้าสำรวจและตลาดโปรเจกต์',
    benefits: ['แสดงก่อนรายการทั่วไป', 'ป้ายโปรโมตบนการ์ด'],
  },
  {
    level: 2 as const,
    name: 'Boost Plus',
    description: 'เพิ่มการมองเห็นโปรเจกต์ พร้อมตกแต่งโปรไฟล์ของคุณ',
    benefits: ['สิทธิ์การมองเห็นเท่าระดับ 1', 'เลือกธีมโปรไฟล์', 'เพิ่มข้อความแนะนำตัวบนหน้าปก'],
  },
] as const;
