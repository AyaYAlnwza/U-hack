'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useWeb3 } from '@/context/Web3Context';
import { useProfile } from '@/context/ProfileContext';
import { CATEGORIES } from '@/lib/constants';
import { ProjectStatus } from '@/types/campusboost';
import { 
  Rocket, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  ArrowRight, 
  Cpu,
  Leaf,
  Activity,
  GraduationCap,
  Handshake,
  FileText,
  Check,
  Tent
} from 'lucide-react';

export default function HomePage() {
  const { projects } = useWeb3();
  const { profileId, subscriptionLevel } = useProfile();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Category Icon Map
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'AI': return <Cpu className="w-4 h-4" />;
      case 'Camp': return <Tent className="w-4 h-4" />;
      case 'Environment': return <Leaf className="w-4 h-4" />;
      case 'Health': return <Activity className="w-4 h-4" />;
      case 'Education': return <GraduationCap className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  // Filter projects
  const activeProjects = projects.filter((p) => p.status === ProjectStatus.Active || p.status === ProjectStatus.Completed);
  const isBoostedProject = (project: (typeof projects)[number]) => Boolean(profileId && subscriptionLevel > 0 && project.creatorProfileId === profileId);
  const filteredProjects = activeProjects.filter((p) => {
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        p.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  }).sort((a, b) => Number(isBoostedProject(b)) - Number(isBoostedProject(a)));

  // Calculate platform stats
  const totalRaised = projects.reduce((acc, p) => acc + (p.isCampProject || p.category === 'Camp' ? 0 : p.raisedAmount), 0);
  const totalSponsors = projects.reduce((acc, p) => acc + p.sponsorsCount, 0);

  return (
    <div className="space-y-16 pb-20">
      <section className="border-b border-blue-100 bg-gradient-to-b from-blue-50/70 to-white px-4 py-14 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-bold text-blue-700">CampusBoost</span>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">ให้โปรเจกต์ของคุณไปต่อ</h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              เลือกลงประกาศขายผลงานที่พร้อมส่งต่อ หรือขอรับการสนับสนุนเพื่อพัฒนาโปรเจกต์และค่ายตามแผนงาน
            </p>
          </div>

          <div className="mt-9 grid gap-5 md:grid-cols-2">
            <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Rocket size={22} /></div>
              <h2 className="mt-5 text-xl font-bold text-slate-900">ลงขายโปรเจกต์</h2>
              <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">
                แสดงข้อมูลเบื้องต้น ราคา และช่องทางติดต่อ ให้ผู้สนใจสอบถามรายละเอียดและซอร์สโค้ดกับผู้ขายโดยตรง
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link href="/sell" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700">ลงประกาศขาย <ArrowRight size={16} /></Link>
                <Link href="/marketplace" className="text-sm font-bold text-blue-700 hover:underline">ดูโปรเจกต์ที่เปิดขาย</Link>
              </div>
            </article>

            <article className="flex flex-col rounded-2xl border border-blue-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Handshake size={22} /></div>
              <h2 className="mt-5 text-xl font-bold text-slate-900">ขอรับการสนับสนุน</h2>
              <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">
                เลือกขอสนับสนุนโปรเจกต์ครั้งเดียว หรือขอสนับสนุนค่ายเป็นบาทพร้อมคำขอถึงผู้จัด
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link href="/create" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700">เลือกประเภทคำขอ <ArrowRight size={16} /></Link>
                <a href="#explore-projects" className="text-sm font-bold text-blue-700 hover:underline">ดูโครงการที่เปิดรับ</a>
              </div>
            </article>
          </div>
        </div>
      </section>
      {/* 2. Platform Real-time Metrics Banner */}
      <section className="px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 border border-slate-200 shadow-xs">
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">ยอดทุนที่ระดมได้แล้ว</div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {totalRaised.toFixed(2)} <span className="text-blue-600 text-lg font-bold">ETH</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">≈ {(totalRaised * 120000).toLocaleString('en-US')} THB</div>
          </div>

          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">ผู้สนับสนุน & แบรนด์</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
              {totalSponsors} <span className="text-sm font-semibold text-slate-500">ผู้สนับสนุน</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">บน Base Sepolia Network</div>
          </div>

          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">โปรเจกต์นวัตกรรม</div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {projects.length} <span className="text-sm font-semibold text-slate-500">โครงการ</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">จาก 5 มหาวิทยาลัยชั้นนำ</div>
          </div>

          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">ส่งมอบสำเร็จ</div>
            <div className="text-2xl sm:text-3xl font-black text-blue-600 mt-1">
              87% <span className="text-sm font-semibold text-slate-500">Success Rate</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">ส่งมอบผลงานจริงตามสัญญา</div>
          </div>
        </div>
      </section>

      {/* 3. Explore & Filter Section */}
      <section id="explore-projects" className="px-4 lg:px-8 max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <span>●</span> Student Innovation Projects
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              โปรเจกต์นวัตกรรมที่เปิดรับการสนับสนุน
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              เลือกสนับสนุนโปรเจกต์ที่คุณเชื่อมั่น และร่วมเป็นผู้ร่วมสร้างผลงานกับนักศึกษา
            </p>
            <Link href="/subscription" className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline">เพิ่มการมองเห็นโปรเจกต์ <ArrowRight size={13} /></Link>
          </div>

          {/* Search Box */}
          <div className="w-full md:w-72">
            <input
              type="text"
              placeholder="ค้นหาชื่อโปรเจกต์ หรือนวัตกรรม..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {getCategoryIcon(cat.id)}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const isCamp = Boolean(project.isCampProject || project.category === 'Camp');
            const goal = isCamp ? (project.campGoalTHB ?? Math.round(project.goalAmount * 120000)) : project.goalAmount;
            const raised = isCamp ? (project.campRaisedTHB ?? Math.round(project.raisedAmount * 120000)) : project.raisedAmount;
            const percent = Math.min(100, Math.round((raised / (goal || 1)) * 100));
            const boosted = isBoostedProject(project);

            return (
              <div
                key={project.id}
                className={`clean-card rounded-2xl overflow-hidden flex flex-col group border hover:border-blue-400 ${boosted ? 'border-blue-400 ring-1 ring-blue-100' : 'border-slate-200'}`}
              >
                {/* Cover Image Container */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  
                  {/* Category Badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold bg-white/90 backdrop-blur-md text-blue-700 border border-white/40 shadow-xs">
                    {project.category}
                  </span>
                  {boosted && <span className="absolute right-3 top-3 rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-bold text-white">โปรโมต</span>}

                  {/* University */}
                  <span className="absolute bottom-3 left-3 text-xs text-white font-semibold drop-shadow">
                    🏛️ {project.university}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {project.tagline}
                    </p>
                  </div>

                  {/* Camp Project Directive Badge */}
                  {(project.isCampProject || project.category === 'Camp') && (
                    <div className="flex items-center justify-between gap-1.5 text-[11px] text-blue-700 font-bold bg-blue-50/90 px-2.5 py-1.5 rounded-xl border border-blue-200">
                      <div className="flex items-center gap-1.5 truncate">
                        <Tent className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">ค่ายกิจกรรม: เสนอคำขอทิศทางได้</span>
                      </div>
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-black shrink-0">
                        {project.campDirectives?.length || 0} คำขอ
                      </span>
                    </div>
                  )}

                  {/* Project Custom Agreement Badge */}
                  {project.customAgreement && (
                    <div className="flex items-center justify-between gap-1.5 text-[11px] text-indigo-700 font-bold bg-indigo-50/80 px-2.5 py-1.5 rounded-xl border border-indigo-200/80">
                      <div className="flex items-center gap-1.5 truncate">
                        <Handshake className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="truncate">สัญญาร่วมสนับสนุน: {project.customAgreement.amount} ETH</span>
                      </div>
                      <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-black shrink-0">
                        ครั้งเดียว
                      </span>
                    </div>
                  )}

                  {/* Funding Progress Info */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs pt-0.5">
                      <div>
                         <span className="font-extrabold text-slate-900">{raised.toLocaleString('th-TH')} {isCamp ? 'บาท' : 'ETH'}</span>
                         <span className="text-slate-500 text-[11px]"> / {goal.toLocaleString('th-TH')} {isCamp ? 'บาท' : 'ETH'}</span>
                      </div>
                      <span className="font-black text-blue-600">{percent}%</span>
                    </div>
                  </div>

                  {/* Footer & Action */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-xs text-slate-500 font-medium">
                      👥 {project.sponsorsCount} ผู้สนับสนุน
                    </div>
                    <Link
                      href={`/projects/${project.id}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white text-xs font-bold border border-indigo-200 hover:border-indigo-600 transition-all shadow-2xs"
                    >
                      ดูสัญญา & สนับสนุน
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* 4. How It Works (Clean Slate & Blue Card) */}
      <section className="px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Transparent & Verified
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              กลไกการทำงานของ CampusBoost
            </h2>
            <p className="text-sm text-slate-600">
              ทุกบาททุกสตางค์โปร่งใส ตรวจสอบได้ และปล่อยเงินตามความคืบหน้าที่เกิดขึ้นจริงเท่านั้น
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="space-y-3 p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-blue-600/30">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base">สร้างโปรเจกต์ & กำหนดข้อเสนอสัญญา</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                ทีมนักศึกษาระบุเป้าหมาย นวัตกรรม และร่างข้อเสนอสัญญาร่วมสนับสนุน พร้อมระบุผลงานและสิทธิประโยชน์ที่จะส่งมอบ
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-indigo-600/30">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base">ลงนามสัญญา & ล็อกเงินใน Escrow</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                ผู้สนับสนุนลงนามและสนับสนุนตามสัญญาร่วมสนับสนุนของแต่ละโปรเจกต์ เงินจะถูกล็อกไว้ใน Escrow Smart Contract ปลอดภัย โดยมีเงื่อนไขตามสัญญา
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-emerald-600/30">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base">ส่งมอบผลงานตามสัญญา & รับเงินทุน</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                นักศึกษาส่งมอบผลงานตามเงื่อนไขสัญญา เมื่อผ่านการตรวจรับ Smart Contract จะโอนเงินทุนจาก Escrow ให้อย่างโปร่งใส
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Agreement-Based Sponsorship Model */}
      <section className="px-4 lg:px-8 max-w-7xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
            <Handshake className="w-3.5 h-3.5 text-indigo-600" />
            Project Sponsorship Model
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            การสนับสนุนด้วย &quot;สัญญาร่วมสนับสนุน&quot; ประจำโครงการ
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            ไม่มีแพ็กเกจสำเร็จรูป ทุกการสนับสนุนดำเนินการผ่านข้อเสนอสัญญาที่เจ้าของโครงการระบุในใบประกาศ สนับสนุนครั้งเดียว และล็อกเงินใน Escrow คุ้มครองความคืบหน้า 100%
          </p>
        </div>

        {/* 4 Core Pillars of Agreement Sponsorship */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">1. ข้อเสนอกำหนดโดยนักศึกษา</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              ผู้ริเริ่มโครงการเป็นผู้เสนอเงื่อนไข ยอดเงินสนับสนุน และสิ่งที่ส่งมอบในใบประกาศอย่างชัดเจน
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Handshake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">2. สนับสนุนครั้งเดียวตามสัญญา</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              เป็นพันธมิตรโดยตรงในมูลค่าที่กำหนด ไม่ผูกมัดระยะยาว โอนครั้งเดียวจบสู่ Escrow
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">3. ล็อกใน Escrow 100%</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              เงินจะถูกล็อกใน Escrow Smart Contract และจะถูกปล่อยเมื่อส่งมอบงานตามเงื่อนไขข้อตกลงสัญญาที่ระบุไว้
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">4. สิทธิ์พันธมิตร & Co-Creator</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              ได้รับสิทธิ์ใช้งานเทคโนโลยี โลโก้ในงานสาธิตผลงาน และการบันทึกเกียรติยศถาวรบนบล็อกเชน
            </p>
          </div>
        </div>

        {/* Active Project Agreements Showcase Grid */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>ข้อเสนอสัญญาที่เปิดรับการสนับสนุนในขณะนี้</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {activeProjects.filter(p => p.customAgreement?.enabled).length} สัญญา
              </span>
            </h3>
            <a href="#explore-projects" className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
              ดูทั้งหมด <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {activeProjects
              .filter(p => p.customAgreement?.enabled)
              .map((p) => {
                const ag = p.customAgreement!;
                const remaining = ag.quota ? Math.max(0, ag.quota - (ag.claimedCount || 0)) : null;

                return (
                  <div
                    key={p.id}
                    className="p-5 rounded-2xl clean-card border border-indigo-100/90 shadow-2xs hover:border-indigo-300 transition-all flex flex-col justify-between space-y-4 bg-gradient-to-br from-indigo-50/30 via-white to-blue-50/20"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-500">🏛️ {p.university}</span>
                        {remaining !== null && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            เหลือ {remaining}/{ag.quota} สิทธิ์
                          </span>
                        )}
                      </div>

                      <div>
                        <div className="text-[11px] text-slate-500 font-medium truncate">โครงการ: {p.title}</div>
                        <h4 className="font-bold text-sm text-slate-900 line-clamp-2 mt-0.5 leading-snug">
                          {ag.title}
                        </h4>
                        <div className="text-xl font-black text-indigo-700 mt-2">
                          {ag.amount} <span className="text-xs font-bold text-slate-500">ETH (ครั้งเดียว)</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed border-t border-slate-100 pt-2.5">
                        {ag.summary}
                      </p>

                      <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                        {ag.perks.slice(0, 2).map((perk, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-[11px] text-slate-700 leading-tight">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-slate-100">
                      <Link
                        href={`/projects/${p.id}`}
                        className="w-full block py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-center text-xs font-bold shadow-xs transition-colors"
                      >
                        อ่านสัญญาและสนับสนุน
                      </Link>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

    </div>
  );
}
