'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWeb3 } from '@/context/Web3Context';
import { Milestone, MilestoneStatus } from '@/types/campusboost';
import { 
  Rocket, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';

export default function CreateProjectPage() {
  const router = useRouter();
  const { createNewProject } = useWeb3();

  // Form State
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState<'AI' | 'Environment' | 'Health' | 'Education' | 'Community'>('AI');
  const [university, setUniversity] = useState('จุฬาลงกรณ์มหาวิทยาลัย');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80'
  );
  const [goalAmount, setGoalAmount] = useState<string>('1.0');
  const [deadline, setDeadline] = useState('2026-12-31');

  // Dynamic Milestones
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: 'm-1',
      index: 0,
      title: 'Milestone 1: ออกแบบสถาปัตยกรรมระบบ & Figma Prototype',
      description: 'ทำ User Research และออกแบบ UI/UX ครบทุก Flow',
      amount: 0.3,
      deadline: '2026-11-15',
      status: MilestoneStatus.Pending,
    },
    {
      id: 'm-2',
      index: 1,
      title: 'Milestone 2: พัฒนา MVP & Smart Contract Escrow',
      description: 'เขียนโค้ดและ deploy เวอร์ชันทดสอบบน Base Sepolia',
      amount: 0.4,
      deadline: '2026-12-10',
      status: MilestoneStatus.Pending,
    },
    {
      id: 'm-3',
      index: 2,
      title: 'Milestone 3: ทดสอบกับกลุ่มเป้าหมายและจัดทำรายงานสรุป',
      description: 'ทดสอบการใช้งานจริงและเตรียมนำเสนอในงาน Demo Day',
      amount: 0.3,
      deadline: '2026-12-31',
      status: MilestoneStatus.Pending,
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Add milestone
  const addMilestone = () => {
    const nextIdx = milestones.length;
    setMilestones([
      ...milestones,
      {
        id: `m-${Date.now()}`,
        index: nextIdx,
        title: `Milestone ${nextIdx + 1}: `,
        description: '',
        amount: 0.1,
        deadline: deadline,
        status: MilestoneStatus.Pending,
      },
    ]);
  };

  // Remove milestone
  const removeMilestone = (idx: number) => {
    if (milestones.length <= 1) return;
    const updated = milestones.filter((_, i) => i !== idx).map((m, newIdx) => ({
      ...m,
      index: newIdx,
    }));
    setMilestones(updated);
  };

  // Update milestone
  const updateMilestone = (idx: number, field: keyof Milestone, value: unknown) => {
    const updated = [...milestones];
    updated[idx] = { ...updated[idx], [field]: value };
    setMilestones(updated);
  };

  // Calculate sum
  const totalMilestonesSum = +milestones.reduce((acc, m) => acc + (Number(m.amount) || 0), 0).toFixed(4);
  const targetGoal = Number(goalAmount) || 0;
  const isSumValid = Math.abs(totalMilestonesSum - targetGoal) < 0.0001;

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title || !description || !goalAmount) {
      setErrorMsg('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }

    if (!isSumValid) {
      setErrorMsg(`ผลรวมงบประมาณของ Milestone แต่ละงวด (${totalMilestonesSum} ETH) ต้องเท่ากับเป้าหมาย (${targetGoal} ETH)`);
      return;
    }

    setIsSubmitting(true);
    try {
      const newId = await createNewProject({
        title,
        tagline,
        category,
        university,
        description,
        coverImage,
        goalAmount: targetGoal,
        deadline,
        milestones,
      });

      router.push(`/dashboard/admin?highlight=${newId}`);
    } catch {
      setErrorMsg('เกิดข้อผิดพลาดในการสร้างโปรเจกต์');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
          <Rocket className="w-3.5 h-3.5 text-blue-600" />
          ส่งโครงการนักศึกษาเพื่อขอรับทุนสนับสนุน
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          สร้างโปรเจกต์ใหม่ (Create Project)
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          ระบุรายละเอียดนวัตกรรมและแผนการเบิกจ่ายตาม Milestone เงินทุนจะถูกล็อกไว้ใน Escrow และเบิกจ่ายตามความคืบหน้าจริง
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
            ข้อมูลโครงการทั่วไป (Project Details)
          </h2>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700">ชื่อโปรเจกต์ (Project Title) *</label>
              <input
                type="text"
                required
                placeholder="เช่น SignBridge: ถุงมืออัจฉริยะแปลภาษามือด้วย AI"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700">หมวดหมู่นวัตกรรม (Category) *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as unknown as 'AI')}
                  className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-2xs"
                >
                  <option value="AI">ปัญญาประดิษฐ์ (AI)</option>
                  <option value="Environment">สิ่งแวดล้อม (Environment)</option>
                  <option value="Health">สุขภาพ (HealthTech)</option>
                  <option value="Education">การศึกษา (EdTech)</option>
                  <option value="Community">ชุมชนและเมือง (Community)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">สถาบันการศึกษา (University) *</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น มหาวิทยาลัยเกษตรศาสตร์"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-2xs"
                />
              </div>
            </div>

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
              <label className="text-xs font-bold text-slate-700">เป้าหมายยอดเงินสนับสนุนรวม (ETH) *</label>
              <input
                type="number"
                step="0.01"
                min="0.1"
                required
                value={goalAmount}
                onChange={(e) => setGoalAmount(e.target.value)}
                className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 font-mono focus:outline-none focus:border-blue-600 shadow-2xs"
              />
              <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                ≈ {(Number(goalAmount || 0) * 120000).toLocaleString()} THB
              </span>
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

        {/* Section 3: Dynamic Milestones */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">3</span>
              กำหนดงวดงานและเงื่อนไขการเบิกจ่าย (Escrow Milestones)
            </h2>
            <button
              type="button"
              onClick={addMilestone}
              className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white text-xs font-bold flex items-center gap-1 border border-blue-200 transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" /> เพิ่ม Milestone
            </button>
          </div>

          <p className="text-xs text-slate-500">
            ระบบจะล็อกเงินสนับสนุนไว้ และจะปล่อยเงินแต่ละงวดเมื่อท่านส่งหลักฐานและผ่านการอนุมัติ
          </p>

          <div className="space-y-4">
            {milestones.map((m, idx) => (
              <div
                key={m.id || idx}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-800 px-2.5 py-0.5 rounded-md bg-white border border-blue-200 shadow-2xs">
                    งวดที่ {idx + 1}
                  </span>
                  {milestones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMilestone(idx)}
                      className="text-slate-400 hover:text-red-600 text-xs transition-colors p-1"
                      title="ลบงวดงานนี้"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-slate-600">ชื่องวดงาน (Milestone Title) *</label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น ออกแบบ UI/UX และ User Journey"
                      value={m.title}
                      onChange={(e) => updateMilestone(idx, 'title', e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">งบประมาณงวดนี้ (ETH) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      value={m.amount}
                      onChange={(e) => updateMilestone(idx, 'amount', parseFloat(e.target.value) || 0)}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-slate-600">รายละเอียดงานและหลักฐานที่จะส่งมอบ</label>
                    <input
                      type="text"
                      placeholder="เช่น ส่งลิงก์ Figma และรายงานสัมภาษณ์ผู้ใช้งาน 20 คน"
                      value={m.description}
                      onChange={(e) => updateMilestone(idx, 'description', e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">กำหนดส่งมอบ</label>
                    <input
                      type="date"
                      value={m.deadline}
                      onChange={(e) => updateMilestone(idx, 'deadline', e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Sum Validation Indicator */}
          <div className={`p-4 rounded-xl border flex items-center justify-between text-xs font-semibold ${
            isSumValid
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
            <div>
              <span>รวมยอดงวดงาน: <strong>{totalMilestonesSum} ETH</strong></span>
              <span className="mx-2">|</span>
              <span>เป้าหมายโครงการ: <strong>{targetGoal} ETH</strong></span>
            </div>

            <div className="flex items-center gap-1.5">
              {isSumValid ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>ยอดถูกต้องตรงกัน 100%</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>ยอดงวดงานยังไม่ตรงกับเป้าหมาย (ต่าง {+(targetGoal - totalMilestonesSum).toFixed(4)} ETH)</span>
                </>
              )}
            </div>
          </div>

        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            โครงการจะเข้าสู่สถานะ <strong className="text-amber-700">Pending Review</strong> เพื่อรอ Admin อนุมัติ
          </div>

          <button
            type="submit"
            disabled={!isSumValid || isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              'กำลังบันทึกลงบล็อกเชน...'
            ) : (
              <>
                <Rocket className="w-4 h-4" /> ส่งโครงการเพื่อขออนุมัติ
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
