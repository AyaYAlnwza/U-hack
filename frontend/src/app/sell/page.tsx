'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Info, Tag } from 'lucide-react';
import { MARKETPLACE_CATEGORIES, type ContactMethod, type MarketplaceCategory } from '@/types/marketplace';
import { useProfile } from '@/context/ProfileContext';

const fieldClass = 'mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100';

export default function SellProjectPage() {
  const router = useRouter();
  const { isLoggedIn, profileId, ensureProfileId, subscriptionLevel } = useProfile();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MarketplaceCategory>('AI');
  const [summary, setSummary] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [contactMethod, setContactMethod] = useState<ContactMethod>('line');
  const [contactValue, setContactValue] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const response = await fetch('/api/marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, summary, askingPrice, sellerName, contactMethod, contactValue, ownerProfileId: isLoggedIn ? (profileId || ensureProfileId()) : undefined }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'ไม่สามารถลงประกาศได้');
      router.push('/marketplace');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'ไม่สามารถลงประกาศได้');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"><ArrowLeft size={16} /> ดูประกาศทั้งหมด</Link>
      <div className="mt-8 mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700"><Tag size={14} /> ตลาดโปรเจกต์</div>
        <h1 className="text-3xl font-black text-slate-900">ลงประกาศขายโปรเจกต์</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">เผยแพร่ภาพรวมของผลงานและช่องทางติดต่อ ผู้สนใจจะสอบถามรายละเอียด ซอร์สโค้ด และเงื่อนไขการซื้อกับคุณโดยตรง</p>
        <p className="mt-3 text-xs text-slate-500">{subscriptionLevel > 0 ? 'สมาชิก Boost: ประกาศที่เชื่อมกับโปรไฟล์นี้จะแสดงก่อนรายการทั่วไป' : <><Link href="/subscription" className="font-bold text-blue-600 hover:underline">ดูระดับสมาชิก</Link> เพื่อเพิ่มการมองเห็นประกาศของคุณ</>}</p>
      </div>
      <form onSubmit={submit} className="clean-card space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <label htmlFor="title" className="text-sm font-bold text-slate-800">ชื่อโปรเจกต์ *</label>
          <input id="title" required maxLength={100} value={title} onChange={e => setTitle(e.target.value)} className={fieldClass} placeholder="เช่น แอปจัดการร้านค้าด้วย AI" />
        </div>
        <div>
          <label htmlFor="category" className="text-sm font-bold text-slate-800">หมวดหมู่ *</label>
          <select id="category" value={category} onChange={e => setCategory(e.target.value as MarketplaceCategory)} className={fieldClass}>
            {MARKETPLACE_CATEGORIES.map(item => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="summary" className="text-sm font-bold text-slate-800">คำอธิบายสำหรับประกาศ *</label>
          <textarea id="summary" required maxLength={600} rows={5} value={summary} onChange={e => setSummary(e.target.value)} className={fieldClass} placeholder="โปรเจกต์ทำอะไร ใช้เทคโนโลยีอะไร และเหมาะกับใคร (ไม่ต้องใส่ซอร์สโค้ดหรือข้อมูลลับ)" />
          <p className="mt-1 text-xs text-slate-500">รายละเอียดเชิงลึกและซอร์สโค้ดให้ผู้สนใจสอบถามคุณโดยตรง</p>
        </div>
        <div>
          <label htmlFor="price" className="text-sm font-bold text-slate-800">ราคาที่ต้องการ (บาท)</label>
          <input id="price" type="number" min="1" max="1000000000" step="1" value={askingPrice} onChange={e => setAskingPrice(e.target.value)} className={fieldClass} placeholder="เว้นว่างไว้หากต้องการให้สอบถามราคา" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="seller" className="text-sm font-bold text-slate-800">ชื่อผู้ขายหรือทีม *</label>
            <input id="seller" required maxLength={80} value={sellerName} onChange={e => setSellerName(e.target.value)} className={fieldClass} placeholder="ชื่อที่ต้องการแสดงต่อสาธารณะ" />
          </div>
          <div>
            <label htmlFor="contactMethod" className="text-sm font-bold text-slate-800">ช่องทางติดต่อ *</label>
            <select id="contactMethod" value={contactMethod} onChange={e => { setContactMethod(e.target.value as ContactMethod); setContactValue(''); }} className={fieldClass}>
              <option value="line">LINE ID</option>
              <option value="email">อีเมล</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="contact" className="text-sm font-bold text-slate-800">{contactMethod === 'line' ? 'LINE ID' : 'อีเมล'} สำหรับให้ผู้สนใจติดต่อ *</label>
          <input id="contact" required type={contactMethod === 'email' ? 'email' : 'text'} maxLength={100} value={contactValue} onChange={e => setContactValue(e.target.value)} className={fieldClass} placeholder={contactMethod === 'line' ? 'เช่น campusboost.team' : 'name@example.com'} />
          <p className="mt-1 text-xs text-slate-500">ช่องทางนี้จะแสดงต่อผู้เข้าชมทุกคน</p>
        </div>
        <div className="flex gap-2 rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-sm text-blue-900"><Info size={18} className="mt-0.5 shrink-0" /> ประกาศนี้ใช้เพื่อให้ผู้ซื้อและผู้ขายติดต่อกันโดยตรง ไม่มีการชำระเงินหรือส่งมอบซอร์สโค้ดผ่านเว็บไซต์</div>
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button disabled={submitting} type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60">{submitting ? 'กำลังลงประกาศ...' : 'ลงประกาศขายโปรเจกต์'} <ArrowRight size={17} /></button>
      </form>
    </main>
  );
}
