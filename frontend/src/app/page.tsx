'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useWeb3 } from '@/context/Web3Context';
import { CATEGORIES, SPONSOR_PACKAGES } from '@/lib/constants';
import { ProjectStatus, MilestoneStatus } from '@/types/campusboost';
import { 
  Rocket, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Lock,
  Cpu,
  Leaf,
  Activity,
  GraduationCap
} from 'lucide-react';

export default function HomePage() {
  const { projects } = useWeb3();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Category Icon Map
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'AI': return <Cpu className="w-4 h-4" />;
      case 'Environment': return <Leaf className="w-4 h-4" />;
      case 'Health': return <Activity className="w-4 h-4" />;
      case 'Education': return <GraduationCap className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  // Filter projects
  const activeProjects = projects.filter((p) => p.status === ProjectStatus.Active || p.status === ProjectStatus.Completed);
  const filteredProjects = activeProjects.filter((p) => {
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        p.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Calculate platform stats
  const totalRaised = projects.reduce((acc, p) => acc + p.raisedAmount, 0);
  const totalSponsors = projects.reduce((acc, p) => acc + p.sponsorsCount, 0);

  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. Hero Section (Clean White & Blue, 60-20-20) */}
      <section className="relative pt-12 md:pt-20 px-4 lg:px-8 overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-b border-slate-200/60 pb-16">
        
        {/* Soft background ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-blue-400/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 border border-blue-200 text-blue-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span>นวัตกรรมนักศึกษาที่โปร่งใสที่สุดบน Web3 Smart Contract</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight">
            ปลดล็อกทุนสร้างสรรค์ <br />
            <span className="gradient-text">ด้วย Escrow ตามผลงานจริง</span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            CampusBoost ช่วยให้นักศึกษานำเสนอไอเดียนวัตกรรม และรับการสนับสนุนจากผู้ใช้และแบรนด์ 
            โดยเงินทุนถูกเก็บใน Smart Contract และทยอยปล่อยเป็นงวดตามหลักฐานความคืบหน้าจริง
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/create"
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/35 transition-all transform hover:-translate-y-0.5"
            >
              <Rocket className="w-4 h-4" />
              สร้างโปรเจกต์นักศึกษา
            </Link>
            <a
              href="#explore-projects"
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm border border-slate-300 hover:border-slate-400 shadow-xs transition-all flex items-center gap-2"
            >
              สำรวจและสนับสนุน
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>

          {/* Key Trust Badges */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-500 font-medium">การันตีความปลอดภัย</div>
                <div className="text-sm font-bold text-slate-900">Escrow 100%</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-500 font-medium">ปล่อยเงินเป็นงวด</div>
                <div className="text-sm font-bold text-slate-900">Milestone Proof</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-500 font-medium">สิทธิประโยชน์แบรนด์</div>
                <div className="text-sm font-bold text-slate-900">Brand Visibility</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-500 font-medium">ปกป้องผู้สนับสนุน</div>
                <div className="text-sm font-bold text-slate-900">Dispute & Refund</div>
              </div>
            </div>
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
            <div className="text-[11px] text-slate-500 mt-0.5">≈ {(totalRaised * 120000).toLocaleString()} THB</div>
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
            <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Milestone สำเร็จแล้ว</div>
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
            const percent = Math.min(100, Math.round((project.raisedAmount / project.goalAmount) * 100));
            const releasedMilestones = project.milestones.filter(m => m.status === MilestoneStatus.Released).length;

            return (
              <div
                key={project.id}
                className="clean-card rounded-2xl overflow-hidden flex flex-col group border border-slate-200 hover:border-blue-400"
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

                  {/* Milestone Progress Info */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Milestone เบิกจ่ายแล้ว:</span>
                      <span className="font-bold text-emerald-600">
                        {releasedMilestones} จาก {project.milestones.length} งวด
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs pt-0.5">
                      <div>
                        <span className="font-extrabold text-slate-900">{project.raisedAmount} ETH</span>
                        <span className="text-slate-500 text-[11px]"> / {project.goalAmount} ETH</span>
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
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white text-xs font-bold border border-blue-200 hover:border-blue-600 transition-all shadow-2xs"
                    >
                      ดูรายละเอียด & สนับสนุน
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
              <h3 className="font-bold text-slate-900 text-base">สร้างโปรเจกต์ & กำหนด Milestones</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                ทีมนักศึกษาระบุเป้าหมาย นวัตกรรม และแบ่งงบประมาณออกเป็นงวดงาน (เช่น ออกแบบ, พัฒนา MVP, ทดสอบ) พร้อมเงื่อนไขการส่งมอบหลักฐาน
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-indigo-600/30">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base">เงินทุนถูกล็อกใน Escrow Smart Contract</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Backer และ Sponsor สนับสนุนแพ็กเกจ เงินจะไม่โอนเข้านักศึกษาโดยตรง แต่ถูกล็อกไว้ใน Contract ปลอดภัย ไร้ความเสี่ยง
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-emerald-600/30">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base">ปล่อยเงินเมื่อส่งงาน & ผ่านการตรวจรับ</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                นักศึกษาส่งหลักฐาน (GitHub, วิดีโอ, Figma) เมื่อ Sponsor หรือ Admin กดอนุมัติ Smart Contract จะโอนเงินงวดนั้นพร้อมหัก 2% Fee อัตโนมัติ
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Sponsorship Tiers Breakdown */}
      <section className="px-4 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Packages & Brand Perks
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            ระดับแพ็กเกจการสนับสนุน (Sponsorship Packages)
          </h2>
          <p className="text-sm text-slate-600">
            เลือกแพ็กเกจที่ตรงกับเป้าหมาย สนับสนุนนักศึกษาพร้อมรับสิทธิ์โปรโมตแบรนด์อย่างคุ้มค่า
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SPONSOR_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`p-6 rounded-2xl clean-card flex flex-col justify-between border ${
                pkg.popular
                  ? 'border-blue-500 ring-2 ring-blue-500/10 shadow-lg shadow-blue-500/10'
                  : 'border-slate-200'
              }`}
            >
              <div className="space-y-4">
                {pkg.popular && (
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase bg-blue-600 text-white shadow-xs">
                    Most Popular
                  </span>
                )}
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{pkg.name}</h3>
                  <div className="text-2xl font-black text-blue-600 mt-1">
                    {pkg.minAmount} ETH
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">ขั้นต่ำต่อโปรเจกต์</div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {pkg.description}
                </p>

                <ul className="space-y-2 text-xs text-slate-600 pt-2">
                  {pkg.perks.map((perk, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100">
                <a
                  href="#explore-projects"
                  className="w-full block py-2.5 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-center text-xs font-bold text-slate-700 transition-colors"
                >
                  เลือกสนับสนุนแพ็กเกจนี้
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
