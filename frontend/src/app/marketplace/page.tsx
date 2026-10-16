'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Mail, MessageCircle, PlusCircle, Search, Sparkles } from 'lucide-react';
import type { SaleListing } from '@/types/marketplace';

export default function MarketplacePage() {
  const [listings, setListings] = useState<SaleListing[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/marketplace', { cache: 'no-store' })
      .then(async response => {
        if (!response.ok) throw new Error('ไม่สามารถโหลดประกาศได้');
        return response.json() as Promise<SaleListing[]>;
      })
      .then(setListings)
      .catch(cause => setError(cause instanceof Error ? cause.message : 'ไม่สามารถโหลดประกาศได้'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = listings.filter(listing => `${listing.title} ${listing.summary} ${listing.category}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">ตลาดโปรเจกต์</div>
          <h1 className="text-3xl font-black text-slate-900">โปรเจกต์ที่เปิดขาย</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">เลือกชมผลงานและติดต่อผู้ขายโดยตรงเพื่อสอบถามรายละเอียด ซอร์สโค้ด และเงื่อนไขการซื้อ</p>
        </div>
        <Link href="/sell" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"><PlusCircle size={18} /> ลงขายโปรเจกต์</Link>
      </div>
      <div className="relative mt-8 max-w-lg">
        <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
        <input aria-label="ค้นหาโปรเจกต์ที่เปิดขาย" value={query} onChange={e => setQuery(e.target.value)} placeholder="ค้นหาชื่อ คำอธิบาย หรือหมวดหมู่" className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
      </div>
      <p className="mt-3 text-xs text-slate-500">รายการที่มีป้ายโปรโมตแสดงก่อนรายการทั่วไป · <Link href="/subscription" className="font-bold text-blue-600 hover:underline">ดูระดับสมาชิก</Link></p>
      {loading && <p className="mt-10 text-sm text-slate-600">กำลังโหลดประกาศ...</p>}
      {error && <p role="alert" className="mt-10 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {!loading && !error && filtered.length === 0 && <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600">{query ? 'ไม่พบประกาศที่ตรงกับคำค้นหา' : 'ยังไม่มีประกาศขายโปรเจกต์'} </div>}
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map(listing => {
          const contactHref = listing.contactMethod === 'email'
            ? `mailto:${listing.contactValue}?subject=${encodeURIComponent(`สอบถามโปรเจกต์ ${listing.title}`)}`
            : `https://line.me/ti/p/~${encodeURIComponent(listing.contactValue)}`;
          return <article key={listing.id} className={`flex flex-col rounded-2xl border bg-white p-6 shadow-sm ${listing.isBoosted ? 'border-blue-400 ring-1 ring-blue-100' : 'border-slate-200'}`}>
            <div className="flex items-center justify-between gap-2"><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{listing.category}</span><span className="text-xs text-slate-500">{new Date(listing.createdAt).toLocaleDateString('th-TH', { timeZone: 'Asia/Bangkok' })}</span></div>
            {listing.isBoosted && <span className="mt-4 inline-flex w-fit items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white"><Sparkles size={13} /> โปรโมต</span>}
            <h2 className="mt-5 text-xl font-bold text-slate-900">{listing.title}</h2>
            <p className="mt-3 line-clamp-5 whitespace-pre-wrap text-sm leading-6 text-slate-600">{listing.summary}</p>
            <div className="mt-auto pt-6">
              <div className="border-t border-slate-100 pt-4 text-sm"><span className="text-slate-500">ผู้ขาย </span><strong className="text-slate-900">{listing.sellerName}</strong></div>
              <div className="mt-2 text-lg font-black text-blue-600">{listing.askingPrice === null ? 'สอบถามราคา' : `${listing.askingPrice.toLocaleString('th-TH')} บาท`}</div>
              <a href={contactHref} target={listing.contactMethod === 'line' ? '_blank' : undefined} rel={listing.contactMethod === 'line' ? 'noopener noreferrer' : undefined} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700">{listing.contactMethod === 'email' ? <Mail size={17} /> : <MessageCircle size={17} />} สอบถามผู้ขาย <ArrowRight size={16} /></a>
              <p className="mt-2 text-center text-xs text-slate-500">รายละเอียดและซอร์สโค้ดสอบถามผู้ขายโดยตรง</p>
            </div>
          </article>;
        })}
      </div>
    </main>
  );
}
