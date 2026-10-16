'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, Check, Handshake, Menu, PlusCircle, Rocket, RotateCcw, ShieldCheck, Sparkles, UserRound, X } from 'lucide-react';
import { useWeb3, type UserRole } from '@/context/Web3Context';
import { useProfile } from '@/context/ProfileContext';

const primaryLinks = [
  { href: '/', label: 'สำรวจโปรเจกต์', icon: Rocket },
  { href: '/marketplace', label: 'ตลาดโปรเจกต์', icon: Briefcase },
  { href: '/create', label: 'ขอรับการสนับสนุน', icon: Handshake },
];

const moreLinks = [
  { href: '/sell', label: 'ลงขายโปรเจกต์', icon: PlusCircle },
  { href: '/dashboard/sponsor', label: 'Sponsor Portal', icon: Briefcase },
  { href: '/dashboard/admin', label: 'Admin Desk', icon: ShieldCheck },
];

const roles: { id: UserRole; title: string; icon: string }[] = [
  { id: 'student', title: 'นักศึกษา', icon: '👨‍🎓' },
  { id: 'sponsor', title: 'สปอนเซอร์', icon: '🏢' },
  { id: 'admin', title: 'ผู้ดูแล', icon: '🏛️' },
  { id: 'backer', title: 'ผู้สนับสนุน', icon: '🚀' },
];

function NavbarInner() {
  const pathname = usePathname();
  const { account, switchRole, resetToDefault } = useWeb3();
  const { ready, isLoggedIn, profile, subscriptionLevel } = useProfile();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));
  const closeMenu = () => setMenuOpen(false);

  return (
    <header onKeyDown={event => { if (event.key === 'Escape') closeMenu(); }} className="relative sticky top-0 z-50 border-b border-slate-200 bg-white/95 px-4 py-3 shadow-xs backdrop-blur-md lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link href="/" onClick={closeMenu} className="group flex min-w-0 items-center gap-2.5" aria-label="CampusBoost หน้าแรก">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/20"><Rocket size={20} /></span>
          <span className="hidden truncate text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-blue-700 min-[400px]:inline">Campus<span className="text-blue-600">Boost</span></span>
        </Link>

        <nav aria-label="เมนูหลัก" className="hidden items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 xl:flex">
          {primaryLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} aria-current={isActive(href) ? 'page' : undefined} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${isActive(href) ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:bg-white hover:text-slate-900'}`}>
              <Icon size={16} />{label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link href="/subscription" onClick={closeMenu} aria-current={isActive('/subscription') ? 'page' : undefined} className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2.5 text-xs font-bold text-white transition-colors hover:bg-blue-700 sm:px-4 sm:text-sm">
            <Sparkles size={16} className="shrink-0" />{ready && subscriptionLevel > 0 ? `สมาชิกระดับ ${subscriptionLevel}` : 'สมัครสมาชิก'}
          </Link>
          {ready && <Link href={isLoggedIn ? '/profile' : '/login'} onClick={closeMenu} className="hidden max-w-32 items-center gap-1.5 truncate rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700 sm:inline-flex">
            <UserRound size={16} className="shrink-0" /><span className="truncate">{isLoggedIn ? (profile.displayName || profile.fullName || 'โปรไฟล์') : 'เข้าสู่ระบบ'}</span>
          </Link>}
          <button type="button" aria-controls="campusboost-menu" aria-expanded={menuOpen} aria-label={menuOpen ? 'ปิดเมนูเพิ่มเติม' : 'เปิดเมนูเพิ่มเติม'} onClick={() => setMenuOpen(open => !open)} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700 sm:px-3">
            {menuOpen ? <X size={18} /> : <Menu size={18} />}<span className="hidden sm:inline">เพิ่มเติม</span>
          </button>
        </div>
      </div>

      {menuOpen && <>
        <button type="button" aria-label="ปิดเมนู" onClick={closeMenu} className="fixed inset-0 z-40 cursor-default" />
        <div id="campusboost-menu" className="absolute right-4 top-full z-50 mt-2 max-h-[calc(100vh-5rem)] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-xl lg:right-8">
          <nav aria-label="เมนูเพิ่มเติม" className="space-y-1">
            <div className="xl:hidden">
              {primaryLinks.map(({ href, label, icon: Icon }) => <Link key={href} href={href} onClick={closeMenu} aria-current={isActive(href) ? 'page' : undefined} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${isActive(href) ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`}><Icon size={17} />{label}</Link>)}
              <div className="my-2 border-t border-slate-100" />
            </div>
            {moreLinks.map(({ href, label, icon: Icon }) => <Link key={href} href={href} onClick={closeMenu} aria-current={isActive(href) ? 'page' : undefined} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${isActive(href) ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`}><Icon size={17} />{label}</Link>)}
            <Link href={isLoggedIn ? '/profile' : '/login'} onClick={closeMenu} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:hidden"><UserRound size={17} />{isLoggedIn ? 'โปรไฟล์ของฉัน' : 'เข้าสู่ระบบ'}</Link>
          </nav>

          <div className="mt-3 border-t border-slate-100 pt-3">
            <p className="px-3 text-xs font-bold text-slate-500">สลับบทบาทเดโม</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {roles.map(role => <button key={role.id} type="button" onClick={() => { switchRole(role.id); closeMenu(); }} className={`flex items-center justify-between gap-1 rounded-xl border px-3 py-2 text-xs font-semibold ${account.role === role.id ? 'border-blue-200 bg-blue-50 text-blue-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}><span className="truncate">{role.icon} {role.title}</span>{account.role === role.id && <Check size={14} className="shrink-0" />}</button>)}
            </div>
            <button type="button" onClick={() => { resetToDefault(); closeMenu(); }} className="mt-2 inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-blue-700"><RotateCcw size={14} /> รีเซ็ตข้อมูลโปรเจกต์เดโม</button>
          </div>

          <div className="mt-2 rounded-xl border border-blue-100 bg-blue-50/70 px-3 py-2 text-xs text-slate-600">
            <span className="font-bold text-blue-700">กระเป๋าเดโม</span> · {account.balance} ETH · {account.address.slice(0, 6)}...{account.address.slice(-4)}
          </div>
        </div>
      </>}
    </header>
  );
}

export function Navbar() {
  return <React.Suspense fallback={<header className="sticky top-0 z-50 h-16 border-b border-slate-200 bg-white" />}><NavbarInner /></React.Suspense>;
}
