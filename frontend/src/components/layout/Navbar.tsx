'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWeb3, UserRole } from '@/context/Web3Context';
import { 
  Rocket, 
  PlusCircle, 
  ShieldCheck, 
  Briefcase, 
  ChevronDown, 
  Check, 
  RotateCcw
} from 'lucide-react';

function NavbarInner() {
  const pathname = usePathname();
  const { account, switchRole, resetToDefault } = useWeb3();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const roles: { id: UserRole; title: string; desc: string; icon: string }[] = [
    { id: 'student', title: 'Student Lead', desc: 'สร้างโปรเจกต์ & ส่งหลักฐาน Milestone', icon: '👨‍🎓' },
    { id: 'sponsor', title: 'Brand / Sponsor', desc: 'สนับสนุน Tier & ตรวจรับงานเพื่อปล่อยเงิน', icon: '🏢' },
    { id: 'admin', title: 'University Admin', desc: 'อนุมัติโปรเจกต์ & จัดการข้อพิพาท Dispute', icon: '🏛️' },
    { id: 'backer', title: 'General Backer', desc: 'ผู้สนับสนุนทั่วไป & ติดตามความคืบหน้า', icon: '🚀' },
  ];

  const navLinks = [
    { href: '/', label: 'สำรวจโปรเจกต์', icon: Rocket },
    { href: '/create', label: 'สร้างโปรเจกต์', icon: PlusCircle },
    { href: '/dashboard/sponsor', label: 'Sponsor Portal', icon: Briefcase },
    { href: '/dashboard/admin', label: 'Admin Desk', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-3.5 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                Campus<span className="text-blue-600">Boost</span>
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                dApp
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">Web3 Student Milestone Escrow</p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/80">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-blue-700 shadow-xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action: Demo Switcher & Wallet */}
        <div className="flex items-center gap-3">
          
          {/* Quick Demo Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors"
              title="สลับบทบาทจำลองเพื่อทดสอบ Flow"
            >
              <span className="text-sm">{account.avatar}</span>
              <div className="text-left hidden lg:block">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Demo Role</div>
                <div className="text-blue-700 font-bold capitalize">{account.role}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-100 text-[11px] text-slate-500 font-semibold">
                  สลับบทบาทเพื่อทดสอบ (Interactive Demo)
                </div>
                <div className="py-1 space-y-1">
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        switchRole(r.id);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-all ${
                        account.role === r.id
                          ? 'bg-blue-50 text-blue-900 border border-blue-200'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="text-lg mt-0.5">{r.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold flex items-center justify-between">
                          {r.title}
                          {account.role === r.id && <Check className="w-3.5 h-3.5 text-blue-600 font-bold" />}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">{r.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      resetToDefault();
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[11px] text-slate-500 hover:text-slate-800 transition-colors font-medium"
                  >
                    <RotateCcw className="w-3 h-3" /> รีเซ็ตข้อมูล Demo ทั้งหมด
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Web3 Wallet Pill */}
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200/80 px-3 py-1.5 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <div className="hidden sm:block text-right">
              <span className="text-[10px] text-blue-600 font-semibold block uppercase">Base Sepolia</span>
              <div className="text-xs font-bold text-slate-900">{account.balance} ETH</div>
            </div>
            <div className="px-2 py-0.5 rounded bg-white text-[11px] font-mono font-semibold text-blue-700 border border-blue-100 shadow-2xs">
              {account.address.slice(0, 5)}...{account.address.slice(-3)}
            </div>
          </div>

        </div>

      </div>

      {/* Mobile Nav */}
      <div className="flex md:hidden items-center justify-around mt-3 pt-2.5 border-t border-slate-200 text-xs">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 py-1 font-semibold ${
                isActive ? 'text-blue-600' : 'text-slate-500'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}

export function Navbar() {
  return (
    <React.Suspense fallback={<header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-4 h-16" />}>
      <NavbarInner />
    </React.Suspense>
  );
}
