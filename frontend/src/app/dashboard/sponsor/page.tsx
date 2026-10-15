'use client';

import React from 'react';
import Link from 'next/link';
import { useWeb3 } from '@/context/Web3Context';
import { MilestoneStatus } from '@/types/campusboost';
import { 
  Briefcase, 
  CheckCircle2, 
  ExternalLink, 
  Award, 
  FileCheck,
  Check
} from 'lucide-react';

export default function SponsorDashboardPage() {
  const { projects, approveMilestone } = useWeb3();

  // Find projects that have milestones submitted needing review
  const pendingApprovals: { projectId: string; projectTitle: string; milestoneIdx: number; milestone: typeof projects[0]['milestones'][0] }[] = [];

  projects.forEach((p) => {
    p.milestones.forEach((m, idx) => {
      if (m.status === MilestoneStatus.Submitted) {
        pendingApprovals.push({
          projectId: p.id,
          projectTitle: p.title,
          milestoneIdx: idx,
          milestone: m,
        });
      }
    });
  });

  // Calculate stats for sponsor
  const totalSupportedAmount = 0.75; // Demo ETH
  const totalBrandViews = 4520;
  const activeSponsorshipsCount = 2;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs text-blue-700 font-bold px-3 py-1 rounded-full bg-blue-50 border border-blue-200">
            <Briefcase className="w-3.5 h-3.5 text-blue-600" />
            Corporate Sponsor Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Sponsor Dashboard & Brand Visibility
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            จัดการโปรเจกต์ที่สนับสนุน ตรวจสอบความคืบหน้า และติดตามผลลัพธ์การโปรโมตแบรนด์
          </p>
        </div>

        {/* Brand Profile Widget */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl border border-blue-200">
            🏢
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">SCB 10X / Corporate Partner</div>
            <div className="text-[11px] text-emerald-600 font-bold">Tier: Title Sponsor & Verifier</div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="clean-card p-5 border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">ยอดเงินสนับสนุนรวม</div>
          <div className="text-2xl font-black text-slate-900">{totalSupportedAmount} ETH</div>
          <div className="text-[11px] text-slate-400">ล็อกใน Escrow จนกว่างานจะผ่าน</div>
        </div>

        <div className="clean-card p-5 border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">การมองเห็นแบรนด์ (Brand Reach)</div>
          <div className="text-2xl font-black text-blue-600">
            {totalBrandViews.toLocaleString()} <span className="text-xs font-semibold text-slate-500">Impression</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold">↑ 18% จากกิจกรรมในมหาวิทยาลัย</div>
        </div>

        <div className="clean-card p-5 border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">โปรเจกต์ในพอร์ตโฟลิโอ</div>
          <div className="text-2xl font-black text-slate-900">{activeSponsorshipsCount} โครงการ</div>
          <div className="text-[11px] text-slate-400">หมวดหมู่ Community & Environment</div>
        </div>

        <div className="clean-card p-5 border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">งานที่รอการตรวจรับ (Pending Actions)</div>
          <div className="text-2xl font-black text-amber-600">
            {pendingApprovals.length} <span className="text-xs font-semibold text-slate-500">งวดงาน</span>
          </div>
          <div className="text-[11px] text-amber-700 font-medium">ต้องดำเนินการเพื่อปล่อยเงิน</div>
        </div>

      </div>

      {/* Action Required: Milestone Approvals Queue */}
      <div className="clean-card p-6 border border-amber-200 space-y-4 bg-amber-50/40">
        <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            <h2 className="text-base font-bold text-slate-900">
              งานที่รอการตรวจสอบและอนุมัติ (Milestone Verifications)
            </h2>
          </div>
          <span className="text-xs text-amber-800 font-bold bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
            สิทธิ์ตรวจรับเฉพาะ Sponsor & Admin
          </span>
        </div>

        {pendingApprovals.length > 0 ? (
          <div className="space-y-3">
            {pendingApprovals.map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                      งวดที่ {item.milestoneIdx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {item.projectTitle}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{item.milestone.title}</h3>
                  <p className="text-xs text-slate-600">{item.milestone.description}</p>

                  {item.milestone.evidenceURI && (
                    <div className="pt-1 flex items-center gap-2 text-xs">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <a
                        href={item.milestone.evidenceURI}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1 font-bold"
                      >
                        {item.milestone.evidenceTitle || 'ดูเอกสารหลักฐานที่นักศึกษาส่ง'}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    href={`/projects/${item.projectId}`}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
                  >
                    ดูโปรเจกต์เต็ม
                  </Link>
                  <button
                    onClick={async () => {
                      await approveMilestone(item.projectId, item.milestoneIdx);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-sm flex items-center gap-1.5 transition-colors"
                  >
                    <Check className="w-4 h-4" /> อนุมัติตรวจรับงาน (Approve)
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-slate-500 space-y-1">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p className="font-bold text-slate-800">ไม่มีงานค้างตรวจรับในขณะนี้</p>
            <p>ทุก Milestone อยู่ในสถานะสมบูรณ์หรือกำลังดำเนินงาน</p>
          </div>
        )}
      </div>

      {/* Brand Perks & Deliverables Showcase */}
      <div className="clean-card p-6 border border-slate-200 shadow-xs space-y-6">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Award className="w-5 h-5 text-blue-600" />
          สิทธิ์การโปรโมตและผลลัพธ์ที่ได้รับ (Brand Perks & Deliverables)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">โลโก้บนหน้าโปรเจกต์</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">Active</span>
            </div>
            <div className="h-20 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xs text-slate-500 font-medium shadow-2xs">
              [ โลโก้ SCB 10X แสดงในหน้าหลักและหน้ารายละเอียด ]
            </div>
            <div className="text-[11px] text-slate-500 font-medium">แสดงผลไปแล้ว 4,520 ครั้ง</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">ป้ายแบรนด์ในงาน Demo Day</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">Scheduled</span>
            </div>
            <div className="h-20 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xs text-slate-600 text-center px-4 font-medium shadow-2xs">
              กำหนดจัดงาน: 30 พ.ย. 2026 ณ หอประชุมจุฬาฯ
            </div>
            <div className="text-[11px] text-slate-500 font-medium">สิทธิ์ตั้งบูธและมอบรางวัลแก่นักศึกษา</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">สิทธิ์คัดเลือกนักศึกษาฝึกงาน</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200">Talent Pool</span>
            </div>
            <div className="h-20 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xs text-slate-600 text-center px-4 font-medium shadow-2xs">
              ทีมนักศึกษา 4 คน พร้อมเข้าสัมภาษณ์ Fast-track
            </div>
            <div className="text-[11px] text-slate-500 font-medium">เข้าถึง Talent ด้าน Web3 & AI โดยตรง</div>
          </div>

        </div>
      </div>

    </div>
  );
}
