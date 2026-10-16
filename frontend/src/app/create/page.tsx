import Link from 'next/link';
import { ArrowRight, Lightbulb, ShieldCheck, Tent } from 'lucide-react';

const choices = [
  {
    href: '/create/project',
    icon: Lightbulb,
    title: 'ขอสนับสนุนโปรเจกต์',
    description: 'ผู้สนับสนุนให้โปรเจกต์ครั้งเดียว ทีมระบุแผนงานและส่งหลักฐานให้ตรวจรับก่อนเบิกเงินแต่ละงวด',
    details: ['ระบุปัญหาและแนวทางแก้ไข', 'วางงวดงานและงบประมาณ', 'กำหนดสิทธิ์ผู้สนับสนุน'],
  },
  {
    href: '/create/camp',
    icon: Tent,
    title: 'ขอสนับสนุนค่าย',
    description: 'สำหรับผู้จัดค่ายหรือกิจกรรมเยาวชน ผู้สนับสนุนเลือกยอดเป็นบาทและส่งคำขอถึงผู้จัดได้ ไม่มีงวดงาน',
    details: ['ระบุข้อมูลการจัดค่าย', 'กำหนดเป้าหมายเป็นบาท', 'เปิดรับคำขอจากผู้สนับสนุน'],
  },
] as const;

export default function CreateSupportPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
          <ShieldCheck size={14} /> ขอรับการสนับสนุน
        </span>
        <h1 className="mt-5 text-3xl font-black text-slate-900 sm:text-4xl">คุณต้องการขอสนับสนุนอะไร?</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">เลือกประเภทก่อนกรอกข้อมูล เพื่อให้แบบฟอร์มและวิธีติดตามผลงานตรงกับสิ่งที่คุณกำลังทำ</p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {choices.map(({ href, icon: Icon, title, description, details }) => (
          <Link key={href} href={href} className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-400 hover:shadow-md sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Icon size={24} /></div>
            <h2 className="mt-5 text-xl font-bold text-slate-900">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
            <ul className="mt-5 space-y-2 text-sm text-slate-700">
              {details.map(detail => <li key={detail} className="flex items-start gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />{detail}</li>)}
            </ul>
            <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-bold text-blue-600 group-hover:text-blue-700">เริ่มกรอกแบบฟอร์ม <ArrowRight size={17} /></span>
          </Link>
        ))}
      </div>
      <p className="mt-8 text-center text-xs text-slate-500">ทั้งสองประเภทส่งให้ผู้ดูแลตรวจสอบก่อนเปิดรับการสนับสนุน</p>
    </main>
  );
}
