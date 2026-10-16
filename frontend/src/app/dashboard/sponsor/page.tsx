'use client';

import React from 'react';
import Link from 'next/link';
import { useWeb3 } from '@/context/Web3Context';
import { MilestoneStatus, DirectiveStatus, SponsorCampDirective } from '@/types/campusboost';
import { 
  Briefcase, 
  CheckCircle2, 
  ExternalLink, 
  Award, 
  FileCheck,
  Check,
  Handshake,
  FileText,
  Sparkles,
  Tent,
  Compass,
  Clock,
  Target,
  AlertCircle
} from 'lucide-react';

export default function SponsorDashboardPage() {
  const { projects, approveMilestone } = useWeb3();

  // Find projects that have milestones submitted needing review
  const pendingApprovals: { projectId: string; projectTitle: string; milestoneIdx: number; milestone: typeof projects[0]['milestones'][0] }[] = [];

  projects.forEach((p) => {
    if (p.isCampProject || p.category === 'Camp') return;
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

  // Find projects with active custom agreements
  const activeAgreements = projects
    .filter((p) => p.category !== 'Camp' && !p.isCampProject && p.customAgreement && p.customAgreement.enabled)
    .map((p) => ({
      projectId: p.id,
      projectTitle: p.title,
      university: p.university,
      agreement: p.customAgreement!,
      milestonesCount: p.milestones.length,
    }));

  // Find all Camp Directives across projects
  const sponsorCampDirectives: {
    projectId: string;
    projectTitle: string;
    directive: SponsorCampDirective;
  }[] = [];

  projects.forEach((p) => {
    p.campDirectives?.forEach((d) => {
      sponsorCampDirectives.push({
        projectId: p.id,
        projectTitle: p.title,
        directive: d,
      });
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
            <div className="text-[11px] text-emerald-600 font-bold">Role: Strategic Partner & Verifier</div>
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
            {totalBrandViews.toLocaleString('en-US')} <span className="text-xs font-semibold text-slate-500">Impression</span>
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

      {/* Camp Directives Tracking Section */}
      <div className="clean-card p-6 border border-blue-200/90 shadow-xs space-y-5 bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Tent className="w-5 h-5 text-blue-600" />
              คำขอทิศทางการจัดกิจกรรมค่าย (Sponsor Camp Directives & Tracks)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              ติดตามสถานะคำขอ Tracks การแข่งขันและเวิร์กช็อปที่ท่านเสนอไปยังผู้จัดค่าย
            </p>
          </div>
          <span className="text-xs text-blue-800 font-bold bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
            {sponsorCampDirectives.length} คำขอในระบบ
          </span>
        </div>

        {sponsorCampDirectives.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sponsorCampDirectives.map((item, idx) => {
              const d = item.directive;
              const isAccepted = d.status === DirectiveStatus.Accepted;
              const isPending = d.status === DirectiveStatus.Pending;

              return (
                <div
                  key={idx}
                  className={`p-4 sm:p-5 rounded-2xl bg-white border shadow-2xs space-y-3 flex flex-col justify-between ${
                    isAccepted ? 'border-emerald-200' : isPending ? 'border-amber-200' : 'border-slate-200'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      {isAccepted && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> ตอบรับแล้ว
                        </span>
                      )}
                      {isPending && (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600" /> รอผู้จัดค่ายพิจารณา
                        </span>
                      )}
                      <span className="text-sm font-black text-blue-700">
                        +{(d.amountTHB ?? Math.round(d.amount * 120000)).toLocaleString('th-TH')} บาท
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm leading-snug">
                      {d.title}
                    </h3>
                    <div className="text-[11px] text-slate-500 font-medium">
                      โครงการ: <strong className="text-slate-800">{item.projectTitle}</strong>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {d.directionRequest}
                    </p>

                    {/* Organizer note */}
                    {d.responseNote && (
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 space-y-0.5">
                        <span className="font-bold text-slate-800">คำชี้แจงจากผู้จัดค่าย:</span>
                        <p className="italic leading-snug">&ldquo;{d.responseNote}&rdquo;</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono text-[10px]">
                      {d.createdAt}
                    </span>
                    <Link
                      href={`/projects/${item.projectId}`}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold transition-colors flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" /> ไปยังหน้าค่าย
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-4 text-center">ยังไม่มีคำขอทิศทางค่ายที่บันทึกไว้</p>
        )}
      </div>

      {/* Held Project Sponsorship Agreements Section */}
      <div className="clean-card p-6 border border-indigo-200/90 shadow-xs space-y-5 bg-gradient-to-br from-indigo-50/40 via-white to-blue-50/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Handshake className="w-5 h-5 text-indigo-600" />
              สัญญาร่วมสนับสนุนและข้อตกลงพิเศษเฉพาะโครงการ (Project-Specific Agreements)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              ข้อเสนอสัญญาความร่วมมือพิเศษที่เจ้าของโครงการระบุในใบประกาศ พร้อมสิทธิประโยชน์เฉพาะ
            </p>
          </div>
          <span className="text-xs text-indigo-800 font-bold bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200">
            {activeAgreements.length} สัญญาในระบบ
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeAgreements.map((item, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-indigo-100 shadow-2xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                    🏛️ {item.university}
                  </span>
                  <span className="text-sm font-black text-indigo-700">
                    {item.agreement.amount} ETH
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm leading-snug">
                  {item.agreement.title}
                </h3>
                <div className="text-[11px] text-slate-500 font-medium">
                  โครงการ: <strong className="text-slate-800">{item.projectTitle}</strong>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {item.agreement.summary}
                </p>

                {/* Top Perks */}
                <div className="space-y-1 pt-1">
                  {item.agreement.perks.slice(0, 2).map((p, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-1.5 text-[11px] text-slate-700">
                      <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">
                  คุ้มครองด้วย Escrow Smart Contract
                </span>
                <Link
                  href={`/projects/${item.projectId}`}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold transition-colors flex items-center gap-1"
                >
                  <FileText className="w-3 h-3" /> เปิดดูสัญญาและโครงการ
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
