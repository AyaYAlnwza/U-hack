'use client';

import React, { useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useWeb3 } from '@/context/Web3Context';
import { ProjectStatus, MilestoneStatus, DirectiveStatus, SponsorCampDirective } from '@/types/campusboost';
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
  Hash,
  Handshake,
  FileText,
  Sparkles,
  Scroll,
  Copy,
  Tent,
  Compass,
  Target,
  MessageSquare,
  Clock,
  Plus,
  MapPin,
  Calendar,
  Award
} from 'lucide-react';

const campBaht = (amountTHB?: number, legacyEth = 0) =>
  (amountTHB ?? Math.round(legacyEth * 120000)).toLocaleString('th-TH');

function ProjectDetailContent() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;
  const {
    projects,
    account,
    supportProject,
    submitCampDirective,
    respondToCampDirective,
    submitMilestoneEvidence,
    approveMilestone,
    releaseMilestoneFunds
  } = useWeb3();

  // Find project
  const project = projects.find((p) => p.id === projectId);

  // Modals state
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isContractViewModalOpen, setIsContractViewModalOpen] = useState(false);
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [copiedContract, setCopiedContract] = useState(false);

  // Camp Directive Modal state (Sponsor submitting directive)
  const [isDirectiveModalOpen, setIsDirectiveModalOpen] = useState(false);
  const [directiveTitle, setDirectiveTitle] = useState('');
  const [directiveAmount, setDirectiveAmount] = useState('10000');
  const [directionRequest, setDirectionRequest] = useState('');
  const [expectedOutcomes, setExpectedOutcomes] = useState('');
  const [sponsorPerksOffered, setSponsorPerksOffered] = useState('');
  const [directiveFilter, setDirectiveFilter] = useState<'all' | 'accepted' | 'pending'>('all');

  // Organizer Response Modal state (Student accepting or declining directive)
  const [isRespondModalOpen, setIsRespondModalOpen] = useState(false);
  const [selectedDirective, setSelectedDirective] = useState<SponsorCampDirective | null>(null);
  const [respondAction, setRespondAction] = useState<'accept' | 'decline'>('accept');
  const [responseNote, setResponseNote] = useState('');

  // Milestone Evidence Modal
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [evidenceMilestoneIdx, setEvidenceMilestoneIdx] = useState<number>(0);
  const [evidenceTitle, setEvidenceTitle] = useState('');
  const [evidenceURI, setEvidenceURI] = useState('');

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

  const isCamp = Boolean(project.isCampProject || project.category === 'Camp' || (project.campDirectives && project.campDirectives.length > 0));
  const campGoal = project.campGoalTHB ?? Math.round(project.goalAmount * 120000);
  const campRaised = project.campRaisedTHB ?? Math.round(project.raisedAmount * 120000);
  const percent = Math.min(100, Math.round(100 * (isCamp ? campRaised / (campGoal || 1) : project.raisedAmount / (project.goalAmount || 1))));

  // Filter directives
  const directivesList = project.campDirectives || [];
  const filteredDirectives = directivesList.filter((d) => {
    if (directiveFilter === 'accepted') return d.status === DirectiveStatus.Accepted;
    if (directiveFilter === 'pending') return d.status === DirectiveStatus.Pending;
    return true;
  });

  const acceptedDirectivesCount = directivesList.filter((d) => d.status === DirectiveStatus.Accepted).length;
  const pendingDirectivesCount = directivesList.filter((d) => d.status === DirectiveStatus.Pending).length;

  // Handle Support submit (Custom Agreement)
  const handleSupportSubmit = async () => {
    if (!project.customAgreement) return;
    setIsSubmitting(true);
    try {
      await supportProject(
        project.id,
        99,
        project.customAgreement.amount,
        {
          isCustomAgreement: true,
          agreementTitle: project.customAgreement.title,
        }
      );
      setIsSupportModalOpen(false);
      setAgreementAccepted(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Submit Camp Directive
  const handleDirectiveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountTHB = Number(directiveAmount);
    if (!directiveTitle.trim() || !directionRequest.trim() || !Number.isSafeInteger(amountTHB) || amountTHB < 1) return;

    setIsSubmitting(true);
    try {
      await submitCampDirective(project.id, {
        amountTHB,
        title: directiveTitle,
        directionRequest,
        expectedOutcomes: expectedOutcomes || 'เพื่อพัฒนาศักยภาพผู้เข้าร่วมค่ายให้มีทักษะพร้อมต่อยอดจริง',
        sponsorPerksOffered: sponsorPerksOffered || undefined,
      });

      setIsDirectiveModalOpen(false);
      setDirectiveTitle('');
      setDirectiveAmount('10000');
      setDirectionRequest('');
      setExpectedOutcomes('');
      setSponsorPerksOffered('');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Response Modal
  const openResponseDialog = (directive: SponsorCampDirective, action: 'accept' | 'decline') => {
    setSelectedDirective(directive);
    setRespondAction(action);
    setResponseNote(
      action === 'accept'
        ? `ทีมผู้จัดค่ายยินดีตอบรับคำขอนี้เป็นอย่างยิ่ง โดยจะบรรจุหัวข้อ ${directive.title} เข้าสู่กำหนดการของค่ายและจัดเตรียมทีมงานดูแลเรียบร้อยครับ`
        : 'ทีมผู้จัดค่ายขอขอบพระคุณในข้อเสนอ แต่เนื่องจากข้อจำกัดด้านเวลาและทรัพยากร จึงไม่สามารถตอบรับเงื่อนไขนี้ได้ ขออภัยมา ณ ที่นี้ครับ'
    );
    setIsRespondModalOpen(true);
  };

  // Handle Response Confirm
  const handleResponseConfirm = async () => {
    if (!selectedDirective) return;
    setIsSubmitting(true);
    try {
      await respondToCampDirective(
        project.id,
        selectedDirective.id,
        respondAction,
        responseNote
      );
      setIsRespondModalOpen(false);
      setSelectedDirective(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Milestone Evidence
  const handleEvidenceSubmit = async () => {
    if (!evidenceURI) return;
    setIsSubmitting(true);
    try {
      await submitMilestoneEvidence(project.id, evidenceMilestoneIdx, evidenceURI, evidenceTitle || 'หลักฐานความคืบหน้า');
      setIsEvidenceModalOpen(false);
      setEvidenceURI('');
      setEvidenceTitle('');
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
              {isCamp ? 'เปิดรับคำขอสนับสนุนค่าย' : 'เปิดรับการสนับสนุนครั้งเดียวผ่าน Escrow'}
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

        {/* Left 2 Cols: Project Header, Camp Details, Directives, Story, Milestones */}
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
                <span className="px-3 py-1 rounded-lg bg-white/90 backdrop-blur-md text-blue-700 font-bold border border-white/40 shadow-xs flex items-center gap-1.5">
                  {isCamp && <Tent className="w-3.5 h-3.5 text-blue-600" />}
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
                  <div className="text-[11px] text-slate-500 font-medium">ผู้จัดกิจกรรม / หัวหน้าโครงการ (Lead Organizer)</div>
                  <div className="text-sm font-bold text-slate-900">{project.ownerName}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[11px] text-slate-500 font-medium">{isCamp ? 'ผู้จัดค่าย' : 'ที่อยู่ผู้จัดโครงการ'}</div>
                <div className="text-xs font-mono font-semibold text-blue-700">
                  {project.ownerAddress.slice(0, 6)}...{project.ownerAddress.slice(-4)}
                </div>
              </div>
            </div>
          </div>

          {/* CAMP SPECIFICATION BANNER (If Camp Project) */}
          {isCamp && (
            <div className="rounded-2xl p-6 bg-gradient-to-br from-blue-50/90 via-white to-indigo-50/70 border border-blue-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
                    <Tent className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      ข้อมูลการจัดค่ายกิจกรรมเยาวชน & นวัตกรรม (Camp Specifications)
                    </h3>
                    <p className="text-xs text-slate-500">
                       ผู้สนับสนุนระบุจำนวนเงินบาทและเสนอคำขอทิศทางกิจกรรมได้
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsDirectiveModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> เสนอคำขอทิศทางค่าย
                </button>
              </div>

              {/* 3 Detail Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded-xl border border-blue-100 flex items-start gap-2.5">
                  <Users className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">กลุ่มเป้าหมายผู้ร่วมค่าย</div>
                    <div className="text-xs font-bold text-slate-800 leading-snug">
                      {project.campDetails?.targetAudience || 'นักเรียนมัธยมปลายและนิสิตนักศึกษา 120 คน'}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-blue-100 flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">ระยะเวลาจัดกิจกรรม</div>
                    <div className="text-xs font-bold text-slate-800 leading-snug">
                      {project.campDetails?.duration || '3 วัน 2 คืน'}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-blue-100 flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">สถานที่จัดค่าย</div>
                    <div className="text-xs font-bold text-slate-800 leading-snug">
                      {project.campDetails?.location || 'มหาวิทยาลัย'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Directive Escrow Rule Notice */}
              <div className="p-3 rounded-xl bg-blue-100/60 border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  <strong>ขั้นตอนคำขอ:</strong> ผู้สนับสนุนเลือกจำนวนบาทและส่งคำขอให้ผู้จัดค่ายพิจารณา เมื่อผู้จัดตอบรับ ระบบจะบันทึกยอดสนับสนุนจำลอง โดยยังไม่มีการชำระเงินจริง
                </span>
              </div>
            </div>
          )}

          {/* SPONSOR DIRECTIVES SECTION (คำขอทิศทางการจัดกิจกรรมจากผู้สนับสนุน) */}
          {isCamp && (
            <div className="clean-card rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="space-y-0.5">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Compass className="w-5 h-5 text-blue-600" />
                    คำขอทิศทางการจัดค่ายจากผู้สนับสนุน (Sponsor Camp Directives)
                  </h2>
                  <p className="text-xs text-slate-500">
                    หัวข้อ Tracks, เวิร์กช็อปพิเศษ หรือโจทย์การแข่งขันที่สปอนเซอร์เสนอและผู้จัดค่ายพิจารณาตอบรับ
                  </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs">
                  <button
                    onClick={() => setDirectiveFilter('all')}
                    className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                      directiveFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    ทั้งหมด ({directivesList.length})
                  </button>
                  <button
                    onClick={() => setDirectiveFilter('accepted')}
                    className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                      directiveFilter === 'accepted' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-emerald-700'
                    }`}
                  >
                    ตอบรับแล้ว ({acceptedDirectivesCount})
                  </button>
                  <button
                    onClick={() => setDirectiveFilter('pending')}
                    className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                      directiveFilter === 'pending' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-500 hover:text-amber-700'
                    }`}
                  >
                    รอพิจารณา ({pendingDirectivesCount})
                  </button>
                </div>
              </div>

              {/* Directives List */}
              {filteredDirectives.length > 0 ? (
                <div className="space-y-4">
                  {filteredDirectives.map((directive) => {
                    const isAccepted = directive.status === DirectiveStatus.Accepted;
                    const isPending = directive.status === DirectiveStatus.Pending;
                    const isDeclined = directive.status === DirectiveStatus.Declined;

                    return (
                      <div
                        key={directive.id}
                        className={`rounded-2xl p-5 border transition-all space-y-4 ${
                          isAccepted
                            ? 'bg-gradient-to-br from-emerald-50/40 via-white to-slate-50 border-emerald-200'
                            : isPending
                            ? 'bg-gradient-to-br from-amber-50/40 via-white to-slate-50 border-amber-200'
                            : 'bg-slate-50 border-slate-200 opacity-75'
                        }`}
                      >
                        {/* Header: Title, Status, Amount */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              {isAccepted && (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ตอบรับและบรรจุในหลักสูตรค่ายแล้ว
                                </span>
                              )}
                              {isPending && (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-amber-600" /> รอผู้จัดค่ายพิจารณาตอบรับ
                                </span>
                              )}
                              {isDeclined && (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200 flex items-center gap-1">
                                  <AlertCircle className="w-3.5 h-3.5 text-red-600" /> ปฏิเสธคำขอ
                                </span>
                              )}
                              <span className="text-[11px] text-slate-400 font-mono">
                                {directive.createdAt}
                              </span>
                            </div>

                            <h3 className="text-base font-bold text-slate-900 pt-0.5">
                              {directive.title}
                            </h3>
                          </div>

                          <div className="sm:text-right shrink-0">
                            <div className="text-[11px] text-slate-400 font-medium">เงินสนับสนุนที่เสนอ</div>
                            <div className="text-lg font-black text-blue-700">
                               +{campBaht(directive.amountTHB, directive.amount)} <span className="text-xs text-slate-500 font-semibold">บาท</span>
                            </div>
                          </div>
                        </div>

                        {/* Sponsor Identity */}
                        <div className="flex items-center gap-2.5 text-xs text-slate-600">
                          <span className="text-base">{directive.sponsorAvatar || '🏢'}</span>
                          <span className="font-bold text-slate-900">{directive.sponsorName}</span>
                          <span className="text-slate-400 font-mono text-[11px]">
                            ({directive.sponsorAddress.slice(0, 6)}...{directive.sponsorAddress.slice(-4)})
                          </span>
                        </div>

                        {/* Directive Details */}
                        <div className="space-y-2 text-xs">
                          <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 space-y-2">
                            <div>
                              <span className="font-bold text-slate-800 flex items-center gap-1">
                                <Target className="w-3.5 h-3.5 text-blue-600" /> คำขอทิศทางที่ต้องการให้ค่ายจัด (Direction Request):
                              </span>
                              <p className="text-slate-600 mt-1 leading-relaxed pl-4">
                                {directive.directionRequest}
                              </p>
                            </div>

                            <div>
                              <span className="font-bold text-slate-800 flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> ผลสัมฤทธิ์ที่คาดหวังให้เกิดขึ้นกับเยาวชน:
                              </span>
                              <p className="text-slate-600 mt-1 leading-relaxed pl-4">
                                {directive.expectedOutcomes}
                              </p>
                            </div>

                            {directive.sponsorPerksOffered && (
                              <div>
                                <span className="font-bold text-slate-800 flex items-center gap-1">
                                  <Award className="w-3.5 h-3.5 text-amber-600" /> สิ่งที่สปอนเซอร์จะสนับสนุนเพิ่มเติม:
                                </span>
                                <p className="text-slate-600 mt-1 leading-relaxed pl-4">
                                  {directive.sponsorPerksOffered}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Response Note (If Accepted or Declined) */}
                        {directive.responseNote && (
                          <div className={`p-3.5 rounded-xl text-xs space-y-1 ${
                            isAccepted ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-red-50 border border-red-200 text-red-900'
                          }`}>
                            <div className="font-bold flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <MessageSquare className="w-3.5 h-3.5" />
                                คำชี้แจงและการตอบรับจากผู้จัดค่าย ({project.ownerName}):
                              </span>
                              {directive.reviewedAt && (
                                <span className="text-[10px] font-normal text-slate-500">{directive.reviewedAt}</span>
                              )}
                            </div>
                            <p className="leading-relaxed pl-5 font-medium">
                              &ldquo;{directive.responseNote}&rdquo;
                            </p>
                          </div>
                        )}

                        {/* ORGANIZER ACTION DESK (When Pending and simulated role is student) */}
                        {isPending && account.role === 'student' && (
                          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="text-xs text-blue-900 leading-snug">
                              <strong>⚡ สิทธิ์ผู้จัดค่าย (Student Lead):</strong> ท่านสามารถพิจารณาว่าคำขอนี้สามารถจัดทำได้ตามแผนค่ายหรือไม่
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => openResponseDialog(directive, 'decline')}
                                className="px-3 py-1.5 rounded-lg bg-white hover:bg-red-50 text-red-700 border border-red-200 text-xs font-bold transition-colors"
                              >
                                ✕ ปฏิเสธ
                              </button>
                              <button
                                onClick={() => openResponseDialog(directive, 'accept')}
                                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5" /> ตอบรับคำขอนี้
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-xl">
                    ⛺
                  </div>
                  <div className="text-sm font-bold text-slate-700">ยังไม่มีคำขอทิศทางในหมวดนี้</div>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    ร่วมเป็นสปอนเซอร์รายแรกที่เสนอทิศทางการเรียนรู้หรือโจทย์กิจกรรมให้กับเยาวชนในค่ายนี้
                  </p>
                  <button
                    onClick={() => setIsDirectiveModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                  >
                    เสนอคำขอทิศทางค่าย
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Description Story */}
          <div className="clean-card rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              รายละเอียดและที่มาของโครงการ
            </h2>
            <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {project.description}
            </div>
          </div>

          {/* MILESTONE ESCROW TIMELINE */}
          {!isCamp && <div className="clean-card rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  แผนการส่งมอบงานและการเบิกจ่ายเงินทุน (Milestones & Escrow Deliverables)
                </h2>
                <p className="text-xs text-slate-500">
                  เงินทุนสนับสนุนจะทยอยปล่อยตามหลักฐานผลงานจริงที่ผ่านการตรวจสอบ
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {project.milestones.map((m, idx) => {
                const isReleased = m.status === MilestoneStatus.Released;
                const isApproved = m.status === MilestoneStatus.Approved;
                const isSubmitted = m.status === MilestoneStatus.Submitted;
                const isPending = m.status === MilestoneStatus.Pending;

                return (
                  <div
                    key={m.id || idx}
                    className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-100">
                          {idx + 1}
                        </span>
                        <h3 className="font-bold text-sm text-slate-900">{m.title}</h3>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        {isReleased && (
                          <span className="px-2.5 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            ✓ ปล่อยเงินแล้ว ({m.amount} ETH)
                          </span>
                        )}
                        {isApproved && (
                          <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            ✓ อนุมัติแล้ว ({m.amount} ETH)
                          </span>
                        )}
                        {isSubmitted && (
                          <span className="px-2.5 py-0.5 rounded-full font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            ⏳ ส่งงานแล้ว รอตรวจ ({m.amount} ETH)
                          </span>
                        )}
                        {isPending && (
                          <span className="px-2.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-600">
                            กำลังดำเนินงาน ({m.amount} ETH)
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {m.description}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>กำหนดส่งมอบ: <strong className="text-slate-600 font-medium">{m.deadline}</strong></span>
                      {m.evidenceURI && (
                        <a
                          href={m.evidenceURI}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" /> ดูหลักฐาน: {m.evidenceTitle || 'Evidence'}
                        </a>
                      )}
                    </div>

                    {/* Interactive Role Actions on Milestone */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2 text-xs">
                      {/* Student Submit Evidence */}
                      {account.role === 'student' && isPending && (
                        <button
                          onClick={() => {
                            setEvidenceMilestoneIdx(idx);
                            setIsEvidenceModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1"
                        >
                          <FileCheck className="w-3.5 h-3.5" /> ส่งมอบหลักฐานงาน
                        </button>
                      )}

                      {/* Sponsor / Admin Approve Milestone */}
                      {(account.role === 'sponsor' || account.role === 'admin') && isSubmitted && (
                        <button
                          onClick={() => approveMilestone(project.id, idx)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> อนุมัติตรวจรับงาน
                        </button>
                      )}

                      {/* Admin Release Funds */}
                      {account.role === 'admin' && isApproved && (
                        <button
                          onClick={() => releaseMilestoneFunds(project.id, idx)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1"
                        >
                          <Coins className="w-3.5 h-3.5" /> ปล่อยเงินงวดสู่นักศึกษา
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>}

          {/* Project-Specific Custom Agreement (If Enabled) */}
          {!isCamp && project.customAgreement && project.customAgreement.enabled && (
            <div className="rounded-2xl p-6 sm:p-7 bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/60 border-2 border-indigo-200/90 shadow-sm space-y-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-indigo-100 pb-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-600 text-white flex items-center gap-1.5 shadow-xs">
                      <Handshake className="w-3.5 h-3.5" />
                      ข้อเสนอพิเศษในใบประกาศ (Project Agreement)
                    </span>
                    <span className="text-xs font-semibold text-indigo-900 bg-indigo-100/70 px-2.5 py-0.5 rounded-full border border-indigo-200">
                      สัญญาร่วมสนับสนุนเฉพาะโครงการ
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 pt-1 leading-snug">
                    {project.customAgreement.title}
                  </h3>
                  <div className="text-xs text-slate-500 font-medium">
                    เสนอโดย: <strong className="text-slate-800">{project.ownerName}</strong> ({project.university})
                  </div>
                </div>

                <div className="sm:text-right shrink-0 bg-white/90 sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-indigo-100">
                  <div className="text-[11px] text-slate-500 font-medium">เงินสนับสนุนครั้งเดียว</div>
                  <div className="text-2xl sm:text-3xl font-black text-indigo-700">
                    {project.customAgreement.amount} <span className="text-sm font-bold text-slate-600">ETH</span>
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                {project.customAgreement.summary}
              </p>

              {/* Perks Checklist */}
              <div className="space-y-3 bg-white/90 p-4 sm:p-5 rounded-xl border border-indigo-100 shadow-2xs">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  สิทธิประโยชน์และสิ่งที่ส่งมอบตามสัญญา (Deliverables & Privileges):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {project.customAgreement.perks.map((perk, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>เงินทุนจะถูกล็อกใน Escrow Smart Contract และคุ้มครองตามข้อกำหนดสัญญา</span>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => setIsContractViewModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <FileText className="w-3.5 h-3.5" /> ตรวจสอบร่างสัญญา
                  </button>

                  <button
                    onClick={() => setIsSupportModalOpen(true)}
                    disabled={project.status !== ProjectStatus.Active}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
                  >
                    <Handshake className="w-4 h-4" /> สนับสนุนตามสัญญานี้
                  </button>
                </div>
              </div>
            </div>
          )}

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
                    className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                      b.isDirective
                        ? 'bg-blue-50/70 border-blue-200'
                        : b.isCustomAgreement
                        ? 'bg-indigo-50/60 border-indigo-200/90'
                        : 'bg-slate-50 border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg font-bold flex items-center justify-center border ${
                        b.isDirective
                          ? 'bg-blue-600 text-white border-blue-700'
                          : b.isCustomAgreement
                          ? 'bg-indigo-600 text-white border-indigo-700'
                          : 'bg-blue-100 text-blue-700 border-blue-200'
                      }`}>
                        {b.isDirective ? '⛺' : b.isCustomAgreement ? '📜' : b.tierName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                          <span>{b.tierName}</span>
                          {b.directiveTitle && (
                            <span className="text-[10px] text-blue-700 font-semibold bg-blue-100/70 px-2 py-0.5 rounded-md border border-blue-200">
                              {b.directiveTitle}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-500 font-mono">
                            {b.address.slice(0, 6)}...{b.address.slice(-4)}
                          </span>
                        </div>
                        <div className="text-slate-500 text-[11px]">{b.timestamp}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-black text-blue-700">
                         +{isCamp ? `${campBaht(b.amountTHB, b.amount)} บาท` : `${b.amount} ETH`}
                      </div>
                      {b.txHash && !isCamp && <div className="text-[10px] font-mono text-slate-500 flex items-center justify-end gap-1">
                         <Hash className="w-3 h-3" /> {b.txHash}
                       </div>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">
                ยังไม่มีผู้สนับสนุน ร่วมเป็นผู้สนับสนุนคนแรกของกิจกรรมนี้!
              </p>
            )}
          </div>

        </div>

        {/* Right 1 Col: Funding Status Box & Support CTA */}
        <div className="space-y-6">

          <div className="clean-card rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5 sticky top-24">

            <div className="space-y-2">
              <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">ยอดทุนสนับสนุนที่ระดมได้</div>
              <div className="text-3xl font-black text-slate-900">
                 {isCamp ? campRaised.toLocaleString('th-TH') : project.raisedAmount} <span className="text-blue-600 text-xl font-bold">{isCamp ? 'บาท' : 'ETH'}</span>
              </div>
              <div className="text-xs text-slate-600 font-medium">
                 เป้าหมาย: <strong className="text-slate-900 font-bold">{isCamp ? campGoal.toLocaleString('th-TH') : project.goalAmount} {isCamp ? 'บาท' : 'ETH'}</strong> ({percent}%)
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden mt-3">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
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
                <div className="text-slate-500 font-medium">ปิดรับระดมทุน</div>
                <div className="font-black text-slate-900 text-base mt-0.5">{project.deadline}</div>
              </div>
            </div>

            {/* CAMP DIRECTIVE PRIMARY CTA BUTTON */}
            {isCamp && (
              <button
                onClick={() => setIsDirectiveModalOpen(true)}
                disabled={project.status !== ProjectStatus.Active}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4" />
                เสนอคำขอทิศทางและสนับสนุนค่าย
              </button>
            )}

            {/* Agreement Support Primary CTA Button (If has agreement) */}
             {!isCamp && project.customAgreement && (
              <button
                onClick={() => setIsSupportModalOpen(true)}
                disabled={project.status !== ProjectStatus.Active}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
              >
                <Handshake className="w-4 h-4" />
                ลงนามสนับสนุนตามสัญญา ({project.customAgreement.amount} ETH)
              </button>
            )}

            {/* Escrow Guarantee Box */}
             {!isCamp && <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                ระบบ Escrow คุ้มครองความโปร่งใส:
             </div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                ผู้สนับสนุนส่งยอดครั้งเดียวเข้า Escrow ของโปรเจกต์ จากนั้นเงินจะปล่อยตามงวดงานที่ผ่านการตรวจรับ
              </p>
             </div>}

            {/* Simulated Role Notice */}
            <div className="text-[11px] text-slate-500 text-center font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              บทบาทจำลองปัจจุบัน: <strong className="text-blue-700 font-bold capitalize">{account.role}</strong>
              <div className="text-[10px] text-slate-400 mt-0.5">
                (สลับบทบาทเป็น Student Lead หรือ Sponsor ที่เมนูด้านบนขวา เพื่อทดลองกดตอบรับหรือส่งคำขอ)
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ---------------- MODAL 1: Propose Camp Directive Modal (Sponsor) ---------------- */}
      {isDirectiveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-2xl p-6 border border-slate-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">สนับสนุนพร้อมกำหนดคำขอทิศทางค่าย</h3>
                   <p className="text-xs text-slate-500">ระบุยอดเป็นบาทและส่งคำขอให้ผู้จัดค่ายพิจารณา (เดโม)</p>
                </div>
              </div>
              <button
                onClick={() => setIsDirectiveModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-base p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDirectiveSubmit} className="space-y-4 text-xs">
              <div>
                 <label className="font-bold text-slate-700">จำนวนเงินสนับสนุนที่ต้องการให้ (บาท) *</label>
                <input
                  type="number"
                   step="1"
                   min="1"
                  required
                  value={directiveAmount}
                  onChange={(e) => setDirectiveAmount(e.target.value)}
                  className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 font-mono text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">หัวข้อคำขอทิศทาง (Directive Title) *</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ขอเพิ่ม Track การแข่งขัน Mini-Hackathon หัวข้อ Green AI & ESG"
                  value={directiveTitle}
                  onChange={(e) => setDirectiveTitle(e.target.value)}
                  className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">รายละเอียดคำขอทิศทางที่อยากให้ค่ายจัดทำ (Direction Details) *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="อธิบายกิจกรรม เวิร์กช็อป หรือโจทย์ที่ต้องการให้ค่ายจัด เช่น ขอให้มีช่วง Hands-on Workshop วันที่ 2 เวลา 13:00-17:00 น. พร้อมเปิดให้ทีมของสปอนเซอร์ขึ้นบรรยาย 45 นาที"
                  value={directionRequest}
                  onChange={(e) => setDirectionRequest(e.target.value)}
                  className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 leading-relaxed"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">ผลสัมฤทธิ์ที่คาดหวังให้เกิดขึ้นกับเยาวชน (Expected Outcomes)</label>
                <textarea
                  rows={2}
                  placeholder="เช่น น้องๆ ได้พัฒนา Prototype ที่แก้ปัญหาได้จริง และเข้าใจการประยุกต์ใช้โมเดล AI ในภาคอุตสาหกรรม"
                  value={expectedOutcomes}
                  onChange={(e) => setExpectedOutcomes(e.target.value)}
                  className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">สิ่งที่สปอนเซอร์จะสนับสนุนเพิ่มเติม (Optional)</label>
                <input
                  type="text"
                  placeholder="เช่น ส่ง Senior Mentor 3 คน, อุปกรณ์ฮาร์ดแวร์ 20 ชุด, ทุนรางวัลชนะเลิศ 10,000 บาท"
                  value={sponsorPerksOffered}
                  onChange={(e) => setSponsorPerksOffered(e.target.value)}
                  className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Escrow Rule Note */}
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs leading-relaxed">
                 <strong>รายการจำลอง:</strong> เสนอสนับสนุน <strong>{Number(directiveAmount || 0).toLocaleString('th-TH')} บาท</strong> พร้อมคำขอ โดยยังไม่มีการชำระเงินหรือโอนเข้า Escrow เมื่อผู้จัดตอบรับ ระบบจึงบันทึกยอดนี้ ไม่มีการแบ่งงวด
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDirectiveModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-2"
                >
                   {isSubmitting ? 'กำลังส่งข้อมูล...' : 'ส่งคำขอสนับสนุนค่าย'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ---------------- MODAL 2: Organizer Response Dialog (Accept / Decline) ---------------- */}
      {isRespondModalOpen && selectedDirective && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">

            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg font-bold flex items-center justify-center text-white ${
                  respondAction === 'accept' ? 'bg-emerald-600' : 'bg-red-600'
                }`}>
                  {respondAction === 'accept' ? '✓' : '✕'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {respondAction === 'accept' ? 'ตอบรับคำขอทิศทางค่าย' : 'ปฏิเสธคำขอทิศทางค่าย'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {respondAction === 'accept'
                       ? 'บันทึกยอดสนับสนุนจำลองและนำคำขอเข้าสู่แผนกิจกรรมค่าย'
                       : 'ปฏิเสธคำขอโดยไม่มีการชำระเงินจริง'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsRespondModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-base p-1"
              >
                ✕
              </button>
            </div>

            {/* Directive Summary */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="font-bold text-slate-800">{selectedDirective.title}</div>
              <div className="text-slate-500">
                 เสนอโดย: <strong className="text-slate-700">{selectedDirective.sponsorName}</strong> • เงินสนับสนุน: <strong className="text-blue-700">+{campBaht(selectedDirective.amountTHB, selectedDirective.amount)} บาท</strong>
              </div>
              <div className="text-slate-600 text-[11px] pt-1">
                {selectedDirective.directionRequest}
              </div>
            </div>

            {/* Response Note Input */}
            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-700">
                ข้อความตอบรับหรือเหตุผลจากผู้จัดค่าย (Response Message to Sponsor) *
              </label>
              <textarea
                rows={3}
                required
                value={responseNote}
                onChange={(e) => setResponseNote(e.target.value)}
                placeholder="ระบุข้อความเพื่อแจ้งให้สปอนเซอร์ทราบ เช่น แผนการจัดเตรียมเวลา หรือเหตุผลที่ไม่สามารถจัดได้"
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 leading-relaxed"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsRespondModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleResponseConfirm}
                disabled={isSubmitting}
                className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold shadow-md flex items-center gap-2 ${
                  respondAction === 'accept'
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                    : 'bg-red-600 hover:bg-red-700 shadow-red-600/20'
                }`}
              >
                {isSubmitting
                  ? 'กำลังดำเนินการ...'
                  : respondAction === 'accept'
                   ? `ยืนยันตอบรับคำขอ (+${campBaht(selectedDirective.amountTHB, selectedDirective.amount)} บาทในเดโม)`
                   : 'ยืนยันปฏิเสธคำขอ'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ---------------- MODAL 3: Support Custom Agreement Modal ---------------- */}
      {isSupportModalOpen && !isCamp && project.customAgreement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-2xl p-6 border border-slate-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">
                  <Handshake className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">ลงนามข้อตกลงสนับสนุนโครงการ</h3>
                  <p className="text-xs text-slate-500">สนับสนุนครั้งเดียว ยอดถูกบันทึกในเดโมและแสดงแผนตรวจรับงาน</p>
                </div>
              </div>
              <button
                onClick={() => setIsSupportModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-base p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 bg-gradient-to-br from-indigo-50/50 to-white p-4 sm:p-5 rounded-xl border border-indigo-200">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full border border-indigo-200">
                    ข้อเสนอในใบประกาศ (Project Agreement)
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{project.customAgreement.title}</h4>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] text-slate-500">เงินสนับสนุนครั้งเดียว</div>
                  <div className="text-xl font-black text-indigo-700">{project.customAgreement.amount} ETH</div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {project.customAgreement.summary}
              </p>

              <div className="space-y-1.5 bg-white p-3 rounded-lg border border-indigo-100 text-xs">
                <div className="font-bold text-slate-800 flex items-center gap-1 text-[11px]">
                  <Sparkles className="w-3 h-3 text-indigo-600" /> สิทธิประโยชน์ตามสัญญา:
                </div>
                {project.customAgreement.perks.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                    <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                  <FileText className="w-3 h-3 text-indigo-600" />
                  ร่างข้อกำหนดสัญญา (Terms of Agreement):
                </label>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[10.5px] text-slate-700 max-h-36 overflow-y-auto whitespace-pre-line leading-relaxed">
                  {project.customAgreement.contractTerms}
                </div>
              </div>

              <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agreementAccepted}
                  onChange={(e) => setAgreementAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <span className="leading-snug">
                  ข้าพเจ้าได้ตรวจสอบและยอมรับเงื่อนไขใน <strong>ข้อตกลงสนับสนุนโครงการ</strong> เรียบร้อยแล้ว และรับทราบว่าเงินสนับสนุนจะถูกทยอยเบิกจ่ายผ่านระบบ Milestone Escrow ของแพลตฟอร์ม
                </span>
              </label>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-indigo-100">
                <button
                  onClick={() => setIsSupportModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleSupportSubmit}
                  disabled={!agreementAccepted || isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-2"
                >
                  {isSubmitting ? 'กำลังทำธุรกรรม...' : `ยืนยันลงนามและโอน ${project.customAgreement.amount} ETH เข้า Escrow`}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ---------------- MODAL 4: Full Contract Terms Viewer ---------------- */}
      {isContractViewModalOpen && project.customAgreement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">
                  <Scroll className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">เอกสารข้อตกลงสนับสนุนเฉพาะโครงการ</h3>
                  <p className="text-xs text-slate-500">Project Sponsorship & Strategic Agreement</p>
                </div>
              </div>
              <button
                onClick={() => setIsContractViewModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-base p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4">
              <div className="text-center pb-2 border-b border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  {project.university} Innovation Registry
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 pt-1">
                  {project.customAgreement.title}
                </h2>
                <div className="text-xs text-slate-500 font-mono">
                  Escrow Contract: {project.ownerAddress}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500">ผู้เสนอข้อตกลง (Project Lead):</span>
                  <div className="font-bold text-slate-900">{project.ownerName}</div>
                </div>
                <div>
                  <span className="text-slate-500">เงินสนับสนุนตามสัญญา:</span>
                  <div className="font-black text-indigo-700">{project.customAgreement.amount} ETH (ครั้งเดียว)</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                  <span>ข้อกำหนดและเงื่อนไขแห่งสัญญา (Full Terms):</span>
                  <button
                    onClick={() => {
                      if (project.customAgreement) {
                        navigator.clipboard.writeText(project.customAgreement.contractTerms);
                        setCopiedContract(true);
                        setTimeout(() => setCopiedContract(false), 2000);
                      }
                    }}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> {copiedContract ? 'คัดลอกแล้ว!' : 'คัดลอกข้อความ'}
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 font-mono text-[11px] text-slate-800 whitespace-pre-line leading-relaxed max-h-56 overflow-y-auto">
                  {project.customAgreement.contractTerms}
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsContractViewModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                ปิดหน้าต่าง
              </button>
              <button
                onClick={() => {
                  setIsContractViewModalOpen(false);
                  setIsSupportModalOpen(true);
                }}
                disabled={project.status !== ProjectStatus.Active}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
              >
                <Handshake className="w-3.5 h-3.5" /> สนับสนุนตามสัญญานี้ ({project.customAgreement.amount} ETH)
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ---------------- MODAL 5: Submit Milestone Evidence Modal ---------------- */}
      {isEvidenceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 border border-slate-200 shadow-2xl space-y-4">

            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                ส่งหลักฐานความคืบหน้างวดที่ {evidenceMilestoneIdx + 1}
              </h3>
              <button onClick={() => setIsEvidenceModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">ชื่อเอกสารหรือหัวข้องาน:</label>
                <input
                  type="text"
                  placeholder="เช่น รายงานผลการจัดกิจกรรมค่าย วันที่ 1-2, ลิงก์คลิปวิดีโอ"
                  value={evidenceTitle}
                  onChange={(e) => setEvidenceTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 mt-1 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">ลิงก์หลักฐาน (URL หรือ IPFS Hash):</label>
                <input
                  type="url"
                  placeholder="https://... หรือ ipfs://..."
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
                {isSubmitting ? 'กำลังบันทึก...' : 'ส่งมอบงานเพื่อขออนุมัติ'}
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
