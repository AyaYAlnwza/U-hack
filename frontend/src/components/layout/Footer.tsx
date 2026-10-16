import React from 'react';
import Link from 'next/link';
import { Rocket, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        
        {/* Top Disclaimer Banner */}
        <div className="mb-10 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-950">ข้อชี้แจงสำคัญ (Sponsorship & Escrow Disclaimer): </span>
            CampusBoost เป็นแพลตฟอร์มสนับสนุนโปรเจกต์นักศึกษาแลกกับสิทธิ์การโปรโมต/เครดิต (Sponsorship) 
            <strong> สิทธิ์ที่ผู้สนับสนุนได้รับเป็นการโปรโมตแบรนด์และเครดิตตามข้อตกลง ไม่มีการแบ่งผลตอบแทนทางการเงิน</strong>
            เงินสนับสนุนจะถูกเก็บรักษาไว้ใน Escrow Smart Contract และจะถูกทยอยปล่อยเป็นงวดตามหลักฐานความคืบหน้า (Milestones) 
            หากโปรเจกต์ไม่เป็นไปตามข้อตกลง ระบบมีกลไก Dispute คืนเงิน (Refund) ให้แก่ผู้สนับสนุน
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <Rocket className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-slate-900">
                Campus<span className="text-blue-600">Boost</span>
              </span>
            </div>
            <p className="text-sm text-slate-600 max-w-md leading-relaxed">
              โครงสร้างพื้นฐาน Web3 ที่เชื่อมโยงพลังความคิดสร้างสรรค์ของนักศึกษาสู่แบรนด์และชุมชน 
              ขับเคลื่อนด้วย Smart Contract เพื่อสร้างความโปร่งใสและสร้างสรรค์นวัตกรรมสู่อนาคต
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Audited Escrow Logic
              </span>
              <span>•</span>
              <span>Base Sepolia / Polygon Amoy</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider">
              หมวดหมู่นวัตกรรม
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/?category=AI" className="hover:text-blue-600 transition-colors">ปัญญาประดิษฐ์ (AI)</Link></li>
              <li><Link href="/?category=Environment" className="hover:text-blue-600 transition-colors">สิ่งแวดล้อม (Green Tech)</Link></li>
              <li><Link href="/?category=Health" className="hover:text-blue-600 transition-colors">สุขภาพ (HealthTech)</Link></li>
              <li><Link href="/?category=Education" className="hover:text-blue-600 transition-colors">การศึกษา (EdTech)</Link></li>
              <li><Link href="/?category=Community" className="hover:text-blue-600 transition-colors">ชุมชนและสังคม (Smart City)</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider">
              สำหรับผู้ใช้งาน
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/create" className="hover:text-blue-600 transition-colors">ส่งโครงการนักศึกษา</Link></li>
              <li><Link href="/subscription" className="hover:text-blue-600 transition-colors">ระดับสมาชิกและการมองเห็น</Link></li>
              <li><Link href="/dashboard/sponsor" className="hover:text-blue-600 transition-colors">Sponsor Dashboard</Link></li>
              <li><Link href="/dashboard/admin" className="hover:text-blue-600 transition-colors">Admin Verification Portal</Link></li>
              <li><span className="text-slate-400 cursor-not-allowed">Smart Contract on GitHub</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 CampusBoost. Built for University Innovation Hackathon.
          </div>
          <div className="flex items-center gap-1 font-medium">
            <span>Powered by Smart Contract Escrow</span>
            <span className="mx-1">•</span>
            <span className="text-blue-600 font-semibold">Trust through Verification</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
