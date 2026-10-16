'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWeb3 } from '@/context/Web3Context';
import { useProfile } from '@/context/ProfileContext';
import { Milestone, MilestoneStatus, type Project } from '@/types/campusboost';
import {
  ArrowLeft,
  Rocket,
  Plus,
  Trash2,
  AlertCircle,
  FileText,
  Handshake,
  Sparkles,
  Check
} from 'lucide-react';

type SupportType = 'project' | 'camp';
type MilestoneDraft = { title: string; description: string; amount: string; deadline: string };

export default function SupportRequestForm({ type }: { type: SupportType }) {
  const isCamp = type === 'camp';
  const router = useRouter();
  const { createNewProject } = useWeb3();
  const { isLoggedIn, profileId, ensureProfileId } = useProfile();

  // Form State
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState<Project['category']>(isCamp ? 'Camp' : 'AI');
  const [university, setUniversity] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80'
  );
  const [goalAmount, setGoalAmount] = useState<string>(isCamp ? '100000' : '1.0');
  const [deadline, setDeadline] = useState('2026-12-31');
  const [milestoneDrafts, setMilestoneDrafts] = useState<MilestoneDraft[]>([
    { title: 'ส่งมอบต้นแบบ', description: 'ส่งหลักฐานผลงานตามแผนที่เสนอ', amount: '1.0', deadline: '2026-12-31' },
  ]);

  // Camp Specific Details
  const [targetAudience, setTargetAudience] = useState('นักเรียนมัธยมปลายและนิสิตนักศึกษา 120 คน');
  const [campDuration, setCampDuration] = useState('3 วัน 2 คืน');
  const [campLocation, setCampLocation] = useState('อาคารวิศวฯ 100 ปี จุฬาลงกรณ์มหาวิทยาลัย');

  // Project-Specific Custom Agreement ("ข้อตกลงสนับสนุนเฉพาะโครงการ")
  const [agreementTitle, setAgreementTitle] = useState(isCamp ? 'ข้อตกลงสนับสนุนค่ายและสิทธิ์ผู้สนับสนุนกิจกรรม' : 'ข้อตกลงสนับสนุนการพัฒนาโปรเจกต์และสิทธิ์ผู้สนับสนุน');
  const [agreementAmount, setAgreementAmount] = useState('0.25');
  const [agreementSummary, setAgreementSummary] = useState(
    isCamp
      ? 'สนับสนุนการจัดค่าย พร้อมรับเครดิตและพื้นที่ประชาสัมพันธ์ตามที่ทีมผู้จัดกำหนด'
      : 'สนับสนุนการพัฒนาผลงาน พร้อมรับเครดิตและสิทธิ์เข้าชมผลงานตามที่ทีมพัฒนากำหนด'
  );
  const [agreementPerks, setAgreementPerks] = useState<string[]>(isCamp ? [
    'เครดิตผู้สนับสนุนบนสื่อประชาสัมพันธ์ค่าย',
    'พื้นที่แสดงโลโก้ในกิจกรรม',
    'รายงานผลการจัดค่ายและจำนวนผู้เข้าร่วม',
  ] : [
    'เครดิตผู้สนับสนุนบนหน้าโปรเจกต์',
    'รายงานความคืบหน้าตามงวดงาน',
    'สิทธิ์เข้าชมผลงานต้นแบบเมื่อส่งมอบ',
  ]);
  const [agreementTerms, setAgreementTerms] = useState(
    `ข้อตกลงสนับสนุนเฉพาะโครงการ (Project Sponsorship & Partnership Agreement)
ทำขึ้นระหว่าง: ทีมพัฒนาโครงการ (ผู้เสนอ) และ ผู้สนับสนุน (พันธมิตรผู้ร่วมสนับสนุน)

1. วัตถุประสงค์: ร่วมสนับสนุนเงินทุนแบบครั้งเดียวเพื่อดำเนิน${isCamp ? 'ค่ายและกิจกรรม' : 'โครงการพัฒนาผลงาน'}ตามแผนงานที่ระบุในใบประกาศ
2. การบริหารเงินทุน: เงินสนับสนุนจะถูกล็อกใน Escrow Smart Contract และทยอยปล่อยตามงวดงานจริง (Milestones)
3. สิทธิประโยชน์: ผู้สนับสนุนจะได้รับเครดิตและสิทธิ์ตามที่ระบุในใบประกาศ
4. การคุ้มครอง: หากไม่เป็นไปตามเงื่อนไข ผู้สนับสนุนมีสิทธิ์เปิดข้อพิพาท (Dispute) เพื่อขอคืนเงินตามกติกา`
  );
  const [agreementQuota, setAgreementQuota] = useState<number>(3);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Calculate goal
  const targetGoal = Number(goalAmount) || 0;

  // Agreement perks helpers
  const addPerk = () => {
    setAgreementPerks([...agreementPerks, '']);
  };

  const updatePerk = (idx: number, val: string) => {
    const updated = [...agreementPerks];
    updated[idx] = val;
    setAgreementPerks(updated);
  };

  const removePerk = (idx: number) => {
    if (agreementPerks.length <= 1) return;
    setAgreementPerks(agreementPerks.filter((_, i) => i !== idx));
  };

  const updateMilestone = (index: number, field: keyof MilestoneDraft, value: string) => {
    setMilestoneDrafts(current => current.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const milestoneTotal = milestoneDrafts.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim() || !description.trim() || !university.trim() || !Number.isFinite(targetGoal) || targetGoal <= 0 || !deadline) {
      setErrorMsg('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }

    if (!isCamp && (!agreementTitle.trim() || !Number.isFinite(Number(agreementAmount)) || Number(agreementAmount) <= 0 || !agreementSummary.trim() || !agreementTerms.trim())) {
      setErrorMsg('กรุณากรอกข้อมูลสัญญาร่วมสนับสนุนของโครงการให้ครบถ้วน (ชื่อสัญญา, ยอดเงิน, สรุป และเงื่อนไขสัญญา)');
      return;
    }

    if (isCamp && (!targetAudience.trim() || !campDuration.trim() || !campLocation.trim())) {
      setErrorMsg('กรุณากรอกกลุ่มเป้าหมาย ระยะเวลา และสถานที่จัดค่าย');
      return;
    }

    if (isCamp && !Number.isSafeInteger(targetGoal)) {
      setErrorMsg('เป้าหมายค่ายต้องเป็นจำนวนบาทเต็ม');
      return;
    }

    if (!isCamp && (milestoneDrafts.some(item => !item.title.trim() || !item.description.trim() || !item.deadline || !Number.isFinite(Number(item.amount)) || Number(item.amount) <= 0) ||
        Math.abs(milestoneTotal - targetGoal) > 0.00000001)) {
      setErrorMsg('กรุณากรอกงวดงานให้ครบ และจัดสรรงบประมาณทุกงวดให้รวมเท่ากับเป้าหมาย');
      return;
    }

    setIsSubmitting(true);
    try {
      const projectMilestones: Milestone[] = isCamp ? [] : milestoneDrafts.map((item, index) => ({
        id: `m-${index + 1}`,
        index,
        title: item.title.trim(),
        description: item.description.trim(),
        amount: Number(item.amount),
        deadline: item.deadline,
        status: MilestoneStatus.Pending,
      }));

      const newId = await createNewProject({
        creatorProfileId: isLoggedIn ? (profileId || ensureProfileId()) : undefined,
        title,
        tagline,
        category: isCamp ? 'Camp' : category,
        university,
        description,
        coverImage,
        goalAmount: isCamp ? 0 : targetGoal,
        campGoalTHB: isCamp ? targetGoal : undefined,
        deadline,
        milestones: projectMilestones,
        isCampProject: isCamp,
        campDetails: isCamp ? {
          targetAudience,
          duration: campDuration,
          location: campLocation,
          openForDirectives: true,
        } : undefined,
        campDirectives: [],
        customAgreement: isCamp ? undefined : {
          enabled: true,
          title: agreementTitle,
          amount: Number(agreementAmount),
          summary: agreementSummary,
          perks: agreementPerks.filter(p => p.trim().length > 0),
          contractTerms: agreementTerms,
          quota: agreementQuota || 1,
          claimedCount: 0,
        },
      });

      router.push(`/dashboard/admin?highlight=${newId}`);
    } catch {
      setErrorMsg('เกิดข้อผิดพลาดในการส่งคำขอรับการสนับสนุน');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-10 space-y-8">

      {/* Header */}
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <Link href="/create" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"><ArrowLeft size={16} /> เลือกประเภทคำขอ</Link>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
          <Rocket className="w-3.5 h-3.5 text-blue-600" />
          {isCamp ? 'ขอสนับสนุนค่ายและกิจกรรมเยาวชน' : 'ขอสนับสนุนโปรเจกต์นักศึกษา'}
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          {isCamp ? 'ส่งคำขอสนับสนุนค่าย' : 'ส่งคำขอสนับสนุนโปรเจกต์'}
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          {isCamp
            ? 'ระบุรายละเอียดค่ายและเป้าหมายเป็นบาท ผู้สนับสนุนเลือกจำนวนเงินเองและส่งคำขอถึงผู้จัดได้ โดยไม่มีงวดงาน'
            : 'ผู้สนับสนุนให้เงินครั้งเดียว เงินจะอยู่ใน Escrow และปล่อยตามหลักฐานงานที่ผ่านการตรวจรับ'}
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2 shadow-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span className="font-semibold">{errorMsg}</span>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="clean-card rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">

        {/* Section 1: Basic Information */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">1</span>
            {isCamp ? 'ข้อมูลค่ายและกิจกรรม' : 'ข้อมูลโปรเจกต์'}
          </h2>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700">{isCamp ? 'ชื่อค่ายหรือกิจกรรม' : 'ชื่อโปรเจกต์'} *</label>
              <input
                type="text"
                required
                placeholder={isCamp ? 'เช่น ค่าย AI เพื่อชุมชน' : 'เช่น SignBridge: ถุงมืออัจฉริยะแปลภาษามือด้วย AI'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-2xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">สโลแกนหรือคำอธิบายสั้น (Tagline)</label>
              <input
                type="text"
                placeholder="อธิบายประโยชน์และสิ่งที่นวัตกรรมนี้แก้ปัญหาใน 1 บรรทัด"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-2xs"
              />
            </div>

            {isCamp ? (
              <div className="rounded-xl border border-blue-200 bg-blue-50/70 px-4 py-3 text-sm font-semibold text-blue-800">ประเภทคำขอ: ค่ายและกิจกรรมเยาวชน</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700">หมวดหมู่โปรเจกต์ *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Project['category'])}
                    className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-2xs"
                  >
                    <option value="AI">ปัญญาประดิษฐ์ (AI)</option>
                    <option value="Environment">สิ่งแวดล้อม (Environment)</option>
                    <option value="Health">สุขภาพ (HealthTech)</option>
                    <option value="Education">การศึกษา (EdTech)</option>
                    <option value="Community">ชุมชนและเมือง (Community)</option>
                  </select>
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700">สถาบันหรือหน่วยงานผู้จัด *</label>
              <input
                type="text"
                required
                value={university}
                onChange={e => setUniversity(e.target.value)}
                placeholder={isCamp ? 'เช่น ชมรมเทคโนโลยี มหาวิทยาลัย...' : 'เช่น คณะวิศวกรรมศาสตร์ มหาวิทยาลัย...'}
                className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Camp-Specific Details Box */}
            {isCamp && (
              <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-blue-950 flex items-center gap-1.5">
                    <span>⛺</span> รายละเอียดการจัดค่ายกิจกรรม (Camp Specifications)
                  </h3>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md border border-blue-200">
                    Sponsor Directives Enabled
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700">กลุ่มเป้าหมายผู้เข้าร่วมค่าย *</label>
                    <input
                      type="text"
                      required
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder="เช่น นักเรียนมัธยมปลาย 120 คน"
                      className="w-full mt-1 px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700">ระยะเวลาจัดกิจกรรม *</label>
                    <input
                      type="text"
                      required
                      value={campDuration}
                      onChange={(e) => setCampDuration(e.target.value)}
                      placeholder="เช่น 3 วัน 2 คืน (15-17 พ.ย. 2026)"
                      className="w-full mt-1 px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700">สถานที่จัดค่าย *</label>
                    <input
                      type="text"
                      required
                      value={campLocation}
                      onChange={(e) => setCampLocation(e.target.value)}
                      placeholder="เช่น คณะวิศวกรรมศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย"
                      className="w-full mt-1 px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div className="flex items-center text-xs font-bold text-blue-700">ผู้สนับสนุนเลือกยอดเป็นบาทและส่งคำขอกิจกรรมให้ผู้จัดพิจารณาได้</div>
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700">ลิงก์รูปภาพหน้าปก (Cover Image URL)</label>
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full mt-1.5 px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">รายละเอียดโครงการ (Story & Methodology) *</label>
              <textarea
                required
                rows={4}
                placeholder="อธิบายที่มาของปัญหา วิธีการแก้ปัญหา กลุ่มเป้าหมาย และแผนงานโดยสังเขป"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 leading-relaxed shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Budget Goal & Timeline */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">2</span>
            งบประมาณเป้าหมายและกำหนดเวลา (Budget & Deadline)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700">เป้าหมายยอดเงินสนับสนุนรวม ({isCamp ? 'บาท' : 'ETH'}) *</label>
              <input
                type="number"
                step={isCamp ? '1' : '0.01'}
                min={isCamp ? '1' : '0.1'}
                required
                value={goalAmount}
                onChange={(e) => setGoalAmount(e.target.value)}
                className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 font-mono focus:outline-none focus:border-blue-600 shadow-2xs"
              />
              {!isCamp && <span className="text-[11px] text-slate-500 font-medium mt-1 block">≈ {(Number(goalAmount || 0) * 120000).toLocaleString('en-US')} THB (ตัวเลขตัวอย่าง)</span>}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">วันสิ้นสุดการระดมทุน (Funding Deadline) *</label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
              />
            </div>
          </div>
        </div>

        {!isCamp && (
          <div className="space-y-4 border-t border-slate-100 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">3</span>
                แผนงวดงานและหลักฐานที่จะส่งมอบ
              </h2>
              <button type="button" onClick={() => setMilestoneDrafts(current => [...current, { title: '', description: '', amount: '', deadline: '' }])} className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100">
                <Plus size={14} /> เพิ่มงวดงาน
              </button>
            </div>
            <p className="text-xs text-slate-600">กำหนดงานแต่ละงวดให้ตรวจรับได้ชัดเจน และจัดสรรเงินรวมให้ตรงกับเป้าหมาย</p>
            {milestoneDrafts.map((item, index) => (
              <div key={index} className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">งวดงานที่ {index + 1}</h3>
                  {milestoneDrafts.length > 1 && <button type="button" onClick={() => setMilestoneDrafts(current => current.filter((_, i) => i !== index))} className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700"><Trash2 size={14} /> ลบงวด</button>}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="text-xs font-bold text-slate-700">ชื่องวดงาน *
                    <input required value={item.title} onChange={e => updateMilestone(index, 'title', e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-normal text-slate-900 focus:border-blue-600 focus:outline-none" />
                  </label>
                  <label className="text-xs font-bold text-slate-700">งบประมาณ (ETH) *
                    <input required type="number" min="0.0001" step="0.0001" value={item.amount} onChange={e => updateMilestone(index, 'amount', e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-normal text-slate-900 focus:border-blue-600 focus:outline-none" />
                  </label>
                  <label className="text-xs font-bold text-slate-700 sm:col-span-2">ผลงานหรือหลักฐานที่จะส่ง *
                    <input required value={item.description} onChange={e => updateMilestone(index, 'description', e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-normal text-slate-900 focus:border-blue-600 focus:outline-none" />
                  </label>
                  <label className="text-xs font-bold text-slate-700">กำหนดส่งงาน *
                    <input required type="date" value={item.deadline} onChange={e => updateMilestone(index, 'deadline', e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-normal text-slate-900 focus:border-blue-600 focus:outline-none" />
                  </label>
                </div>
              </div>
            ))}
            <p className={`text-sm font-bold ${Math.abs(milestoneTotal - targetGoal) <= 0.00000001 ? 'text-blue-700' : 'text-red-700'}`}>
              รวมงวดงาน {milestoneTotal.toLocaleString('th-TH')} / {targetGoal.toLocaleString('th-TH')} ETH
            </p>
          </div>
        )}

        {/* Agreement offered to supporters */}
        {!isCamp && <div className="space-y-5 pt-4 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">{isCamp ? 3 : 4}</span>
                ข้อเสนอการสนับสนุน{isCamp ? 'ค่าย' : 'โปรเจกต์'} *
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                ข้อตกลงสัญญาความร่วมมือที่เจ้าของโครงการเสนอในใบประกาศ ซึ่งเป็นช่องทางเดียวที่เปิดรับการสนับสนุน
              </p>
            </div>

            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
              โมเดลการสนับสนุนหลัก
            </span>
          </div>

          <div className="space-y-5 bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/30 p-5 rounded-2xl border border-indigo-200/80 shadow-xs">

            <div className="flex items-center gap-2 text-xs font-bold text-indigo-800 bg-indigo-100/70 px-3 py-1.5 rounded-xl border border-indigo-200">
              <Handshake className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>ผู้สนับสนุนจะลงนามและสนับสนุนตามสัญญานี้ เงินจะถูกส่งเข้า Escrow Smart Contract และคุ้มครองตาม Milestone</span>
            </div>

            {/* Title & Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700">ชื่อสัญญาที่เสนอในใบประกาศ (Agreement Title) *</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น สัญญาร่วมสนับสนุนเพื่อการวิจัยพัฒนาและสิทธิ์ Strategic Partner"
                  value={agreementTitle}
                  onChange={(e) => setAgreementTitle(e.target.value)}
                  className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">เงินสนับสนุนครั้งเดียว (ETH) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={agreementAmount}
                  onChange={(e) => setAgreementAmount(e.target.value)}
                  className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 font-mono focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Summary */}
            <div>
              <label className="text-xs font-bold text-slate-700">สรุปใจความสำคัญของข้อเสนอในใบประกาศ (Pitch Summary) *</label>
              <textarea
                rows={2}
                required
                placeholder="อธิบายว่าสัญญานี้คืออะไร มอบโอกาสอะไรให้แก่ผู้สนับสนุนแบบครั้งเดียว..."
                value={agreementSummary}
                onChange={(e) => setAgreementSummary(e.target.value)}
                className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 leading-relaxed"
              />
            </div>

            {/* Perks / Privileges Builder */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  สิทธิประโยชน์ตามสัญญาที่ผู้สนับสนุนจะได้รับ (Agreement Deliverables & Perks)
                </label>
                <button
                  type="button"
                  onClick={addPerk}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
                >
                  <Plus className="w-3 h-3" /> เพิ่มข้อกำหนดสิทธิ์
                </button>
              </div>

              <div className="space-y-2">
                {agreementPerks.map((perk, pIdx) => (
                  <div key={pIdx} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {pIdx + 1}
                    </span>
                    <input
                      type="text"
                      placeholder={`ระบุสิทธิประโยชน์ข้อที่ ${pIdx + 1}`}
                      value={perk}
                      onChange={(e) => updatePerk(pIdx, e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                    />
                    {agreementPerks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePerk(pIdx)}
                        className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Full Contract Terms */}
            <div>
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                ร่างข้อกำหนดและเงื่อนไขสัญญาฉบับเต็ม (Full Contract Terms & Conditions)
              </label>
              <textarea
                rows={4}
                required
                value={agreementTerms}
                onChange={(e) => setAgreementTerms(e.target.value)}
                className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 font-mono focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 leading-relaxed"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                * ผู้สนับสนุนจะสามารถเปิดอ่านสัญญาฉบับเต็มนี้และต้องกดยอมรับเงื่อนไขก่อนลงนามโอนเงินเข้า Escrow
              </p>
            </div>

            {/* Quota */}
            <div className="w-full sm:w-48">
              <label className="text-xs font-bold text-slate-700">จำนวนสิทธิ์ที่เปิดรับ (Quota)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={agreementQuota}
                onChange={(e) => setAgreementQuota(parseInt(e.target.value) || 1)}
                className="w-full mt-1.5 px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 font-mono focus:outline-none focus:border-indigo-600"
              />
            </div>

            {/* Live Preview of Announcement Box */}
            <div className="p-4 rounded-xl bg-white border border-indigo-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                  <Handshake className="w-4 h-4 text-indigo-600" />
                  ตัวอย่างการแสดงผลในใบประกาศ (Live Preview)
                </span>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold border border-indigo-200">
                  One-time Exclusive Agreement
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{agreementTitle || 'ชื่อสัญญา'}</h4>
                <div className="text-xs font-black text-indigo-700 mt-0.5">{agreementAmount} ETH (ครั้งเดียว)</div>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{agreementSummary}</p>
              </div>
              <div className="space-y-1">
                {agreementPerks.slice(0, 2).map((p, idx) => p && (
                  <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-700">
                    <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{p}</span>
                  </div>
                ))}
                {agreementPerks.length > 2 && (
                  <div className="text-[10px] text-slate-500 font-medium">และสิทธิประโยชน์อื่นอีก {agreementPerks.length - 2} ข้อ</div>
                )}
              </div>
            </div>

          </div>
        </div>}

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            {isCamp ? 'คำขอจัดค่าย' : 'โปรเจกต์'}จะเข้าสู่สถานะ <strong className="text-amber-700">Pending Review</strong> เพื่อรอ Admin อนุมัติ
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              'กำลังส่งคำขอ...'
            ) : (
              <>
                <Rocket className="w-4 h-4" /> ส่งคำขอสนับสนุน{isCamp ? 'ค่าย' : 'โปรเจกต์'}
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
