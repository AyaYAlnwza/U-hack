'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Palette, ShieldAlert, Sparkles } from 'lucide-react';
import { useProfile } from '@/context/ProfileContext';
import { SUBSCRIPTION_PLANS, type SubscriptionLevel } from '@/types/subscription';

export default function SubscriptionPage() {
  const { ready, isLoggedIn, subscriptionLevel, changeSubscription } = useProfile();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function selectPlan(level: SubscriptionLevel) {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await changeSubscription(level);
      setMessage(level === 0 ? 'กลับสู่ระดับทั่วไปแล้ว' : `เปิดใช้ระดับ ${level} แล้ว`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'เปลี่ยนระดับสมาชิกไม่สำเร็จ');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700"><Sparkles size={14} /> CampusBoost Subscription</span>
        <h1 className="mt-5 text-3xl font-black text-slate-900 sm:text-4xl">เลือกระดับการมองเห็นโปรเจกต์</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">ทั้งสองระดับช่วยให้โปรเจกต์ของคุณแสดงก่อนรายการทั่วไป ระดับ 2 เพิ่มสิทธิ์ตกแต่งโปรไฟล์</p>
      </div>

      <div className="mt-8 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <ShieldAlert size={18} className="mt-0.5 shrink-0" />
        <span>ระบบสมาชิกนี้เป็นเดโม ยังไม่มีการเก็บเงิน ต่ออายุอัตโนมัติ หรือยืนยันตัวตนจริง คุณสามารถสลับระดับเพื่อทดลองฟีเจอร์ได้</span>
      </div>
      <p className="mt-3 text-xs leading-6 text-slate-500">สิทธิ์เพิ่มการมองเห็นใช้กับประกาศและโปรเจกต์ที่สร้างขณะเข้าสู่ระบบเดโม เพื่อให้ระบบเชื่อมรายการกับโปรไฟล์ของคุณได้</p>

      {!ready ? <p className="mt-8 text-center text-sm text-slate-500">กำลังโหลดข้อมูลสมาชิก...</p> : !isLoggedIn ? (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-center">
          <p className="text-sm text-slate-700">เข้าสู่ระบบเดโมก่อนเลือกระดับสมาชิก</p>
          <Link href="/login" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700">ไปหน้าเข้าสู่ระบบ <ArrowRight size={16} /></Link>
        </div>
      ) : (
        <>
          <p className="mt-8 text-center text-sm font-bold text-slate-700">ระดับปัจจุบัน: {subscriptionLevel === 0 ? 'ทั่วไป' : SUBSCRIPTION_PLANS.find(plan => plan.level === subscriptionLevel)?.name}</p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {SUBSCRIPTION_PLANS.map(plan => (
              <section key={plan.level} className={`flex flex-col rounded-2xl border bg-white p-7 shadow-sm ${subscriptionLevel === plan.level ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'}`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">{plan.level === 1 ? <Sparkles size={22} /> : <Palette size={22} />}</div>
                  <span className="text-xs font-bold text-blue-700">ระดับ {plan.level}</span>
                </div>
                <h2 className="mt-5 text-2xl font-black text-slate-900">{plan.name}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{plan.description}</p>
                <ul className="mt-5 space-y-3 text-sm text-slate-700">
                  {plan.benefits.map(benefit => <li key={benefit} className="flex items-start gap-2"><Check size={16} className="mt-0.5 shrink-0 text-blue-600" />{benefit}</li>)}
                </ul>
                <button type="button" disabled={busy || subscriptionLevel === plan.level} onClick={() => selectPlan(plan.level)} className="mt-8 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-default disabled:bg-blue-100 disabled:text-blue-700">
                  {subscriptionLevel === plan.level ? 'กำลังใช้งาน' : `ทดลองระดับ ${plan.level}`}
                </button>
              </section>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 text-sm">
            <p className="text-slate-600">ระดับทั่วไปแสดงโปรเจกต์ตามลำดับปกติ</p>
            {subscriptionLevel > 0 && <button type="button" disabled={busy} onClick={() => selectPlan(0)} className="font-bold text-slate-700 hover:text-blue-700 disabled:opacity-50">กลับสู่ระดับทั่วไป</button>}
          </div>
          {message && <p role="status" className="mt-4 rounded-xl bg-green-50 p-3 text-sm font-semibold text-green-700">{message}</p>}
          {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
          {subscriptionLevel === 2 && <Link href="/profile" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline">ไปตกแต่งโปรไฟล์ <ArrowRight size={16} /></Link>}
        </>
      )}
    </main>
  );
}
