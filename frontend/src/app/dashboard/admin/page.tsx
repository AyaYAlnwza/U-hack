'use client';

import React from 'react';
import Link from 'next/link';
import { useWeb3 } from '@/context/Web3Context';
import { ProjectStatus } from '@/types/campusboost';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { projects, approveProjectAdmin, resolveDispute } = useWeb3();

  // Filter queues
  const pendingProjects = projects.filter((p) => p.status === ProjectStatus.PendingReview);
  const disputedProjects = projects.filter((p) => p.status === ProjectStatus.Disputed);

  // Platform metrics
  const totalVolume = projects.reduce((acc, p) => acc + p.raisedAmount, 0);
  const platformFeeEarned = +(totalVolume * 0.02).toFixed(4); // 2% fee

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs text-blue-700 font-bold px-3 py-1 rounded-full bg-blue-50 border border-blue-200">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            University & Platform Governance
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Admin Verification & Dispute Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            ระบบตรวจสอบและอนุมัติโครงการนักศึกษา จัดการข้อพิพาท และติดตามรายได้แพลตฟอร์ม
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl border border-blue-200">
            🏛️
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">University Partner Admin</div>
            <div className="text-[11px] text-blue-700 font-semibold">Contract Owner & Arbitrator</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="clean-card p-5 border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">ค่าธรรมเนียมที่เก็บได้ (2% Platform Fee)</div>
          <div className="text-2xl font-black text-emerald-600">{platformFeeEarned} ETH</div>
          <div className="text-[11px] text-slate-400">โอนเข้ากระเป๋า Fee Recipient</div>
        </div>

        <div className="clean-card p-5 border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">โครงการรอการอนุมัติ (Pending Review)</div>
          <div className="text-2xl font-black text-amber-600">{pendingProjects.length} โครงการ</div>
          <div className="text-[11px] text-amber-700 font-medium">รอการตรวจสอบก่อนเปิดรับเงิน</div>
        </div>

        <div className="clean-card p-5 border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">ข้อพิพาทที่เกิดขึ้น (Active Disputes)</div>
          <div className="text-2xl font-black text-red-600">{disputedProjects.length} เคส</div>
          <div className="text-[11px] text-slate-400">ต้องการคำตัดสินจาก Admin</div>
        </div>

        <div className="clean-card p-5 border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">โครงการที่สำเร็จ (Completed)</div>
          <div className="text-2xl font-black text-blue-600">
            {projects.filter(p => p.status === ProjectStatus.Completed).length} โครงการ
          </div>
          <div className="text-[11px] text-emerald-600 font-medium">ส่งมอบผลงานครบ 100%</div>
        </div>

      </div>

      {/* Queue 1: Pending Projects for Approval */}
      <div className="clean-card p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            คิวตรวจสอบและอนุมัติโครงการใหม่ (Project Approval Queue)
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {pendingProjects.length} โครงการรอตรวจ
          </span>
        </div>

        {pendingProjects.length > 0 ? (
          <div className="space-y-3">
            {pendingProjects.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold border border-amber-200">
                      รอการอนุมัติ
                    </span>
                    <span className="text-xs text-slate-600 font-medium">🏛️ {p.university}</span>
                    <span className="text-xs text-slate-400">• หมวดหมู่: {p.category}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{p.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-1">{p.tagline}</p>
                  <div className="text-xs text-slate-500 pt-1">
                    เป้าหมาย: <strong className="text-slate-900 font-bold">{p.goalAmount} ETH</strong> | แบ่ง {p.milestones.length} Milestones
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/projects/${p.id}`}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 border border-slate-200 transition-colors shadow-2xs"
                  >
                    ตรวจสอบข้อมูล
                  </Link>
                  <button
                    onClick={async () => {
                      await approveProjectAdmin(p.id);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" /> อนุมัติเปิดรับเงิน (Approve)
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-6 text-center">
            ไม่มีโครงการค้างตรวจ ทุกโครงการได้รับการอนุมัติเรียบร้อยแล้ว
          </p>
        )}
      </div>

      {/* Queue 2: Dispute Resolution Desk */}
      <div className="clean-card p-6 border border-red-200 shadow-xs space-y-4 bg-red-50/40">
        <div className="flex items-center justify-between border-b border-red-200/60 pb-3">
          <h2 className="text-base font-bold text-red-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            การจัดการข้อพิพาท (Dispute Resolution Desk)
          </h2>
          <span className="text-xs text-red-700 font-bold bg-red-100 px-2.5 py-0.5 rounded-full border border-red-200">
            {disputedProjects.length} เคสที่เกิดข้อพิพาท
          </span>
        </div>

        {disputedProjects.length > 0 ? (
          <div className="space-y-4">
            {disputedProjects.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-xl bg-white border border-red-200 space-y-3 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div>
                    <span className="text-xs font-bold text-red-600">🚨 DISPUTE OPENED</span>
                    <h3 className="font-bold text-slate-900 text-base">{p.title}</h3>
                  </div>
                  <div className="text-xs text-slate-600">
                    ยอดเงินที่ติดล็อกในงวด: <strong className="text-slate-900 font-bold">0.4 ETH</strong>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900">
                  <span className="font-bold text-red-950">เหตุผลที่มีการเปิดข้อพิพาท: </span>
                  ผู้สนับสนุนรายงานว่า ลิงก์หลักฐานไม่ตรงกับ Milestone และไม่มีความคืบหน้านานเกิน 3 สัปดาห์
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-end gap-3">
                  <button
                    onClick={async () => {
                      await resolveDispute(p.id, 0, true);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-xs transition-colors"
                  >
                    คำตัดสิน 1: หลักฐานผ่านเกณฑ์ ให้ปล่อยเงินงวด
                  </button>

                  <button
                    onClick={async () => {
                      await resolveDispute(p.id, 0, false);
                    }}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-bold text-white shadow-xs transition-colors"
                  >
                    คำตัดสิน 2: ยกเลิกและคืนเงินให้ผู้สนับสนุน (Refund Backers)
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-6 text-center">
            ไม่มีข้อพิพาทที่ค้างอยู่ ระบบทำงานอย่างราบรื่น
          </p>
        )}
      </div>

      {/* Active Projects Table */}
      <div className="clean-card p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          ภาพรวมโครงการทั้งหมดในระบบ (All Projects Registry)
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-500 uppercase bg-slate-50 border-b border-slate-200 font-bold">
              <tr>
                <th className="py-3 px-4">ชื่อโครงการ</th>
                <th className="py-3 px-4">สถาบัน</th>
                <th className="py-3 px-4">ยอดระดมทุน</th>
                <th className="py-3 px-4">สถานะ</th>
                <th className="py-3 px-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {p.title}
                  </td>
                  <td className="py-3 px-4 text-slate-500">{p.university}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900">{p.raisedAmount}</span> / {p.goalAmount} ETH
                  </td>
                  <td className="py-3 px-4">
                    {p.status === ProjectStatus.Active && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Active
                      </span>
                    )}
                    {p.status === ProjectStatus.PendingReview && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        Pending
                      </span>
                    )}
                    {p.status === ProjectStatus.Completed && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                        Completed
                      </span>
                    )}
                    {p.status === ProjectStatus.Disputed && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
                        Disputed
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/projects/${p.id}`}
                      className="text-blue-600 hover:text-blue-800 font-bold"
                    >
                      ดูรายละเอียด →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
