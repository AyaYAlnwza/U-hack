'use client';

import React, { useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useWeb3 } from '@/context/Web3Context';
import { SPONSOR_PACKAGES } from '@/lib/constants';
import { MilestoneStatus, ProjectStatus } from '@/types/campusboost';
import { 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  FileCheck, 
  Send, 
  Coins, 
  Users, 
  Check,
  AlertCircle,
  Hash
} from 'lucide-react';

function ProjectDetailContent() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;
  const { 
    projects, 
    account, 
    supportProject, 
    submitMilestoneEvidence, 
    approveMilestone, 
    releaseMilestoneFunds,
    openDispute
  } = useWeb3();

  // Find project
  const project = projects.find((p) => p.id === projectId);

  // Modals state
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<number>(2); // Default Booster
  const [customAmount, setCustomAmount] = useState<string>('0.05');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Evidence modal state
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [evidenceMilestoneIdx, setEvidenceMilestoneIdx] = useState<number>(0);
  const [evidenceTitle, setEvidenceTitle] = useState('');
  const [evidenceURI, setEvidenceURI] = useState('');

  // Dispute modal state
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [disputeMilestoneIdx, setDisputeMilestoneIdx] = useState<number>(0);
  const [disputeReason, setDisputeReason] = useState('');

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">ไม่พบข้อมูลโปรเจกต์</h2>
        <p className="text-slate-500 text-sm">โปรเจกต์อาจถูกลบหรือไม่มีอยู่ในระบบ</p>
        <Link href="/" className="inline-block px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold">
          กลับสู่หน้าหลัก
        </Link>
      </div>
    );
  }

  const percent = Math.min(100, Math.round((project.raisedAmount / project.goalAmount) * 100));

  // Determine permissions
  const isOwner = account.role === 'student' || account.address.toLowerCase() === project.ownerAddress.toLowerCase();
  const isSponsorUser = account.role === 'sponsor' || account.role === 'admin';
  const isAdmin = account.role === 'admin';

  // Handle Support submit
  const handleSupportSubmit = async () => {
    setIsSubmitting(true);
    try {
      const amt = parseFloat(customAmount) || 0.05;
      await supportProject(project.id, selectedTier, amt);
      setIsSupportModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Evidence submit
  const handleEvidenceSubmit = async () => {
    if (!evidenceURI) return;
    setIsSubmitting(true);
    try {
      await submitMilestoneEvidence(project.id, evidenceMilestoneIdx, evidenceURI, evidenceTitle || 'หลักฐานความคืบหน้างวดงาน');
      setIsEvidenceModalOpen(false);
      setEvidenceURI('');
      setEvidenceTitle('');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Dispute submit
  const handleDisputeSubmit = async () => {
    if (!disputeReason) return;
    setIsSubmitting(true);
    try {
      await openDispute(project.id, disputeMilestoneIdx, disputeReason);
      setIsDisputeModalOpen(false);
      setDisputeReason('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Back button & Status Badge */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับสู่รายการโปรเจกต์
        </Link>

        <div className="flex items-center gap-2">
          {project.status === ProjectStatus.Active && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Active Funding & Milestone Escrow
            </span>
          )}
          {project.status === ProjectStatus.Disputed && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              Disputed Under Review
            </span>
          )}
          {project.status === ProjectStatus.Completed && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              Project Completed
            </span>
          )}
        </div>
      </div>

      {/* Main Grid: Left Story / Right Escrow Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Project Header, Story, Milestones */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Cover & Main Title */}
          <div className="space-y-4">
            <div className="h-72 sm:h-96 w-full rounded-2xl overflow-hidden relative bg-slate-100 border border-slate-200 shadow-xs">
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                <span className="px-3 py-1 rounded-lg bg-white/90 backdrop-blur-md text-blue-700 font-bold border border-white/40 shadow-xs">
                  {project.category}
                </span>
                <span className="font-semibold drop-shadow">🏛️ {project.university}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {project.title}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {project.tagline}
              </p>
            </div>

            {/* Student Owner Info */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-lg border border-blue-200">
                  👨‍🎓
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-medium">ผู้พัฒนาโครงการ (Project Lead)</div>
                  <div className="text-sm font-bold text-slate-900">{project.ownerName}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[11px] text-slate-500 font-medium">Escrow Address</div>
                <div className="text-xs font-mono font-semibold text-blue-700">
                  {project.ownerAddress.slice(0, 6)}...{project.ownerAddress.slice(-4)}
                </div>
              </div>
            </div>
          </div>

          {/* Description Story */}
          <div className="clean-card rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              รายละเอียดและที่มาของโครงการ
            </h2>
            <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {project.description}
            </div>
          </div>

          {/* Milestone Interactive Timeline (Clean Escrow Flow) */}
          <div className="clean-card rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Coins className="w-5 h-5 text-blue-600" />
                  แผนการใช้เงินและ Milestone เบิกจ่าย (Escrow Timeline)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  เงินจะถูกปล่อยออกจาก Smart Contract เมื่อนักศึกษาส่งหลักฐานและผ่านการอนุมัติ
                </p>
              </div>
              <span className="text-xs text-emerald-700 font-bold px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200">
                หัก 2% Platform Fee
              </span>
            </div>

            {/* Milestones List */}
            <div className="space-y-4">
              {project.milestones.map((m, index) => {
                const isReleased = m.status === MilestoneStatus.Released;
                const isApproved = m.status === MilestoneStatus.Approved;
                const isSubmitted = m.status === MilestoneStatus.Submitted;
                const isPending = m.status === MilestoneStatus.Pending;

                return (
                  <div
                    key={m.id || index}
                    className={`p-5 rounded-2xl border transition-all ${
                      isReleased
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : isApproved
                        ? 'bg-blue-50/50 border-blue-200'
                        : isSubmitted
                        ? 'bg-amber-50/60 border-amber-200'
                        : 'bg-slate-50/70 border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white text-slate-700 border border-slate-200 shadow-2xs">
                            งวดที่ {index + 1}
                          </span>
                          <h3 className="font-bold text-slate-900 text-base">{m.title}</h3>

                          {/* Status Pill */}
                          {isReleased && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              ✓ ปล่อยเงินแล้ว ({m.amount} ETH)
                            </span>
                          )}
                          {isApproved && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                              ✓ ผ่านการอนุมัติ (พร้อมเบิกจ่าย)
                            </span>
                          )}
                          {isSubmitted && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              ⏳ รอ Sponsor/Admin ตรวจรับงาน
                            </span>
                          )}
                          {isPending && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-200/60 text-slate-600">
                              อยู่ระหว่างดำเนินการ
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {m.description}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                          <span>งบประมาณ: <strong className="text-slate-900 font-bold">{m.amount} ETH</strong></span>
                          <span>•</span>
                          <span>กำหนดส่ง: <strong className="text-slate-700">{m.deadline}</strong></span>
                        </div>

                        {/* Evidence Link Section if submitted */}
                        {m.evidenceURI && (
                          <div className="mt-3 p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs shadow-2xs">
                            <div className="flex items-center gap-2">
                              <FileCheck className="w-4 h-4 text-emerald-600" />
                              <span className="text-slate-700 font-semibold">หลักฐานความคืบหน้า:</span>
                              <span className="text-blue-700 font-medium">{m.evidenceTitle || 'Evidence Deliverable'}</span>
                            </div>
                            <a
                              href={m.evidenceURI}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-bold underline"
                            >
                              เปิดดูหลักฐาน <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons for this Milestone */}
                      <div className="flex sm:flex-col gap-2 shrink-0">
                        
                        {/* 1. Student Submit Evidence Button */}
                        {isPending && isOwner && (
                          <button
                            onClick={() => {
                              setEvidenceMilestoneIdx(index);
                              setIsEvidenceModalOpen(true);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            <Send className="w-3 h-3" /> ส่งหลักฐานงาน
                          </button>
                        )}

                        {/* 2. Sponsor / Admin Approve Button */}
                        {isSubmitted && isSponsorUser && (
                          <button
                            onClick={async () => {
                              await approveMilestone(project.id, index);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5" /> อนุมัติตรวจรับ
                          </button>
                        )}

                        {/* 3. Release Funds Button (When Approved) */}
                        {isApproved && (
                          <button
                            onClick={async () => {
                              await releaseMilestoneFunds(project.id, index);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            <Coins className="w-3.5 h-3.5" /> ปล่อยเงินงวดนี้
                          </button>
                        )}

                        {/* 4. Open Dispute Button */}
                        {isSubmitted && (
                          <button
                            onClick={() => {
                              setDisputeMilestoneIdx(index);
                              setIsDisputeModalOpen(true);
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-red-50 text-slate-500 hover:text-red-600 text-xs border border-slate-200 transition-colors shadow-2xs"
                            title="งานไม่ตรงตามสัญญา? เปิดข้อพิพาท"
                          >
                            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                          </button>
                        )}

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Hall of Backers & Brand Sponsors */}
          <div className="clean-card rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              รายชื่อผู้สนับสนุนและสปอนเซอร์ (Hall of Backers)
            </h2>

            {project.backersList && project.backersList.length > 0 ? (
              <div className="space-y-2">
                {project.backersList.map((b, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center border border-blue-200">
                        {b.tierName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span>{b.tierName}</span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {b.address.slice(0, 6)}...{b.address.slice(-4)}
                          </span>
                        </div>
                        <div className="text-slate-500 text-[11px]">{b.timestamp}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-black text-emerald-600">+{b.amount} ETH</div>
                      <div className="text-[10px] font-mono text-slate-500 flex items-center justify-end gap-1">
                        <Hash className="w-3 h-3" /> {b.txHash || '0x4f...9a'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">
                ยังไม่มีผู้สนับสนุน ร่วมเป็นผู้สนับสนุนคนแรกของโปรเจกต์นี้!
              </p>
            )}
          </div>

        </div>

        {/* Right 1 Col: Funding Status Box & Support CTA */}
        <div className="space-y-6">
          
          <div className="clean-card rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6 sticky top-24">
            
            <div className="space-y-2">
              <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">ยอดทุนที่ระดมได้</div>
              <div className="text-3xl font-black text-slate-900">
                {project.raisedAmount} <span className="text-blue-600 text-xl font-bold">ETH</span>
              </div>
              <div className="text-xs text-slate-600 font-medium">
                เป้าหมาย: <strong className="text-slate-900 font-bold">{project.goalAmount} ETH</strong> ({percent}%)
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden mt-3">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-100 text-xs">
              <div>
                <div className="text-slate-500 font-medium">ผู้สนับสนุน</div>
                <div className="font-black text-slate-900 text-base mt-0.5">{project.sponsorsCount} ราย</div>
              </div>
              <div>
                <div className="text-slate-500 font-medium">สิ้นสุดโครงการ</div>
                <div className="font-black text-slate-900 text-base mt-0.5">{project.deadline}</div>
              </div>
            </div>

            {/* Support CTA Button */}
            <button
              onClick={() => setIsSupportModalOpen(true)}
              disabled={project.status !== ProjectStatus.Active}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2"
            >
              <Coins className="w-4 h-4" />
              สนับสนุนโปรเจกต์นี้
            </button>

            {/* Security Guarantee Box */}
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 space-y-2 text-xs text-slate-600">
              <div className="font-bold text-blue-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Escrow Protection Guarantee
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600">
                เงินสนับสนุนจะไม่โอนให้นักศึกษาทันที แต่จะเก็บใน Escrow Contract และทยอยปล่อยเมื่อส่งมอบงานตามเงื่อนไข
              </p>
            </div>

            {/* Simulated Role Notice */}
            <div className="text-[11px] text-slate-500 text-center font-medium">
              บทบาทปัจจุบัน: <strong className="text-blue-700 font-bold capitalize">{account.role}</strong>
              <div className="text-[10px] text-slate-400 mt-0.5">
                (สามารถสลับบทบาทได้ที่เมนูด้านบนขวา เพื่อทดลองกดส่งงานหรืออนุมัติ)
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ---------------- MODAL 1: Support Project Modal (Clean White & Blue) ---------------- */}
      {isSupportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 border border-slate-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Coins className="w-5 h-5 text-blue-600" />
                เลือกแพ็กเกจสนับสนุน (Sponsorship)
              </h3>
              <button
                onClick={() => setIsSupportModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-base"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5">
              {SPONSOR_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => {
                    setSelectedTier(pkg.id);
                    setCustomAmount(pkg.minAmount.toString());
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedTier === pkg.id
                      ? 'bg-blue-50/80 border-blue-500 text-slate-900 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">{pkg.name}</span>
                    <span className="font-black text-blue-600">{pkg.minAmount} ETH</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{pkg.description}</p>
                </div>
              ))}
            </div>

            {/* Custom Amount input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">จำนวนเงินที่ต้องการสนับสนุน (ETH):</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsSupportModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSupportSubmit}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-2"
              >
                {isSubmitting ? 'กำลังทำธุรกรรม...' : 'ยืนยันโอนเงินเข้า Escrow'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ---------------- MODAL 2: Submit Milestone Evidence Modal ---------------- */}
      {isEvidenceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 border border-slate-200 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                ส่งหลักฐานความคืบหน้า (Milestone {evidenceMilestoneIdx + 1})
              </h3>
              <button onClick={() => setIsEvidenceModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">ชื่อเอกสารหรือหัวข้องาน:</label>
                <input
                  type="text"
                  placeholder="เช่น GitHub Release v1.0, เอกสารรายงานผลทดสอบ"
                  value={evidenceTitle}
                  onChange={(e) => setEvidenceTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 mt-1 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">ลิงก์หลักฐาน (URL หรือ IPFS URI):</label>
                <input
                  type="text"
                  placeholder="https://github.com/... หรือ ipfs://Qm..."
                  value={evidenceURI}
                  onChange={(e) => setEvidenceURI(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 mt-1 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsEvidenceModalOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-500"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleEvidenceSubmit}
                disabled={!evidenceURI || isSubmitting}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white text-xs font-bold"
              >
                {isSubmitting ? 'กำลังบันทึกลง Chain...' : 'ส่งมอบงานเพื่อขออนุมัติ'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ---------------- MODAL 3: Dispute Modal ---------------- */}
      {isDisputeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 border border-red-200 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-base font-bold text-red-600 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                เปิดข้อพิพาท (Open Dispute)
              </h3>
              <button onClick={() => setIsDisputeModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <p className="text-xs text-slate-600">
              เมื่อเปิดข้อพิพาท โครงการจะถูกระงับการปล่อยเงินงวดนี้ชั่วคราวเพื่อให้ Admin เข้ามาตรวจสอบหลักฐาน
            </p>

            <div>
              <label className="text-xs font-semibold text-slate-600">ระบุเหตุผลหรือปัญหาที่ไม่เป็นไปตามเงื่อนไข:</label>
              <textarea
                rows={3}
                placeholder="เช่น หลักฐานที่ส่งมาไม่สามารถเข้าถึงได้ หรือชิ้นงานไม่ตรงตามสเปก"
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 mt-1 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button onClick={() => setIsDisputeModalOpen(false)} className="px-3 py-1.5 text-xs font-semibold text-slate-500">
                ยกเลิก
              </button>
              <button
                onClick={handleDisputeSubmit}
                disabled={!disputeReason || isSubmitting}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-slate-200 text-white text-xs font-bold"
              >
                {isSubmitting ? 'กำลังส่งข้อมูล...' : 'ยืนยันเปิดข้อพิพาท'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function ProjectDetailPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto py-24 px-4 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 text-sm">กำลังโหลดข้อมูลโปรเจกต์และสัญญา Escrow...</p>
      </div>
    }>
      <ProjectDetailContent />
    </Suspense>
  );
}
