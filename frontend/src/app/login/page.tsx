'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Fingerprint, LockKeyhole, ShieldCheck } from 'lucide-react';
import { useProfile } from '@/context/ProfileContext';

export default function LoginPage() {
  const router = useRouter();
  const { ready, isLoggedIn, loginDemo } = useProfile();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:py-20">
      <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:grid-cols-2">
        <div className="bg-blue-50/70 p-8 sm:p-12">
          <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <Fingerprint className="h-7 w-7" />
          </div>
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-blue-700">CampusBoost ID</p>
          <h1 className="text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">เริ่มสร้างโปรไฟล์ที่บอกตัวตนของคุณ</h1>
          <p className="mt-5 leading-7 text-slate-600">เพิ่มสถานศึกษา ความสนใจ ทักษะ และผลงาน เพื่อให้ผู้สนับสนุนรู้จักคนเบื้องหลังโปรเจกต์มากขึ้น</p>
          <div className="mt-10 flex items-start gap-3 rounded-2xl border border-blue-200 bg-white p-4 text-sm text-slate-700">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
            <span>ขั้นตอนนี้เป็นการจำลอง ThaiD เท่านั้น ยังไม่มีการยืนยันตัวตนกับ ThaiD จริง</span>
          </div>
        </div>
        <div className="flex flex-col justify-center p-8 sm:p-12">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-700"><LockKeyhole className="h-6 w-6" /></div>
          <h2 className="text-2xl font-bold text-slate-900">เข้าสู่ระบบ</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">กดปุ่มเพื่อจำลองการเข้าสู่ระบบ แล้วกรอกข้อมูลโปรไฟล์ของคุณได้ทันที</p>
          {ready && isLoggedIn ? (
            <Link href="/profile" className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700">ไปยังโปรไฟล์ <ArrowRight className="h-4 w-4" /></Link>
          ) : (
            <button type="button" disabled={!ready} onClick={() => { loginDemo(); router.push('/profile'); }} className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-50">
              <Fingerprint className="h-5 w-5" /> เข้าสู่ระบบด้วย ThaiD (เดโม)
            </button>
          )}
          <p className="mt-4 text-center text-xs text-slate-500">ไม่ต้องใช้เลขบัตรประชาชนหรือข้อมูลจริงในการทดลอง</p>
        </div>
      </div>
    </div>
  );
}
