'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, BookOpen, ExternalLink, GraduationCap, Palette, Pencil, Save, ShieldAlert, Sparkles, UserRound } from 'lucide-react';
import { EMPTY_PROFILE, UserProfile, useProfile } from '@/context/ProfileContext';
import type { ProfileTheme } from '@/types/subscription';

const fieldClass = 'mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100';
const labelClass = 'block text-sm font-semibold text-slate-700';

function splitTags(value: string) {
  return [...new Set(value.split(',').map((item) => item.trim()).filter(Boolean))].slice(0, 12);
}

function safeUrl(value: string) {
  if (!value.trim()) return '';
  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : '';
  } catch {
    return '';
  }
}

function AppearanceEditor({ theme, headline, onSave }: { theme: ProfileTheme; headline: string; onSave: (theme: ProfileTheme, headline: string) => void }) {
  const [selectedTheme, setSelectedTheme] = useState<ProfileTheme>(theme);
  const [draftHeadline, setDraftHeadline] = useState(headline);
  const themes: { value: ProfileTheme; label: string; className: string }[] = [
    { value: 'classic', label: 'คลาสสิก', className: 'bg-blue-600' },
    { value: 'sky', label: 'สกาย', className: 'bg-sky-500' },
    { value: 'indigo', label: 'อินดิโก', className: 'bg-indigo-600' },
  ];

  return <section className="clean-card p-6">
    <div className="mb-4 flex items-center gap-2"><Palette className="h-5 w-5 text-blue-600" /><h3 className="font-bold text-slate-900">ตกแต่งโปรไฟล์ · ระดับ 2</h3></div>
    <div className="flex flex-wrap gap-2">
      {themes.map(item => <button key={item.value} type="button" onClick={() => setSelectedTheme(item.value)} aria-pressed={selectedTheme === item.value} className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold ${selectedTheme === item.value ? 'border-blue-500 bg-blue-50 text-blue-800' : 'border-slate-200 text-slate-600'}`}><span className={`h-4 w-4 rounded-full ${item.className}`} />{item.label}</button>)}
    </div>
    <label className="mt-4 block text-xs font-semibold text-slate-700">ข้อความบนหน้าปกโปรไฟล์
      <input value={draftHeadline} onChange={event => setDraftHeadline(event.target.value)} maxLength={80} placeholder="เช่น สร้างเทคโนโลยีเพื่อชุมชน" className={fieldClass} />
    </label>
    <button type="button" onClick={() => onSave(selectedTheme, draftHeadline)} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700"><Save size={15} /> บันทึกการตกแต่ง</button>
  </section>;
}

export default function ProfilePage() {
  const router = useRouter();
  const { ready, isLoggedIn, profile, saveProfile, logoutDemo, subscriptionLevel, profileTheme, profileHeadline, saveAppearance } = useProfile();
  const [draft, setDraft] = useState<UserProfile>(EMPTY_PROFILE);
  const [interestsText, setInterestsText] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (field: keyof UserProfile, value: string) => {
    setDraft((previous) => ({ ...previous, [field]: value }));
    setSaved(false);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.fullName.trim() || !draft.institution.trim()) return;
    const nextProfile: UserProfile = {
      ...draft,
      fullName: draft.fullName.trim(),
      displayName: draft.displayName.trim(),
      institution: draft.institution.trim(),
      fieldOfStudy: draft.fieldOfStudy.trim(),
      yearLevel: draft.yearLevel.trim(),
      bio: draft.bio.trim(),
      achievements: draft.achievements.trim(),
      interests: splitTags(interestsText),
      skills: splitTags(skillsText),
      portfolioUrl: safeUrl(draft.portfolioUrl),
      githubUrl: safeUrl(draft.githubUrl),
    };
    saveProfile(nextProfile);
    setEditing(false);
    setSaved(true);
  };

  if (!ready) return <div className="mx-auto max-w-5xl px-4 py-16 text-slate-500">กำลังโหลดโปรไฟล์...</div>;

  if (!isLoggedIn) return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><UserRound className="h-8 w-8" /></div>
      <h1 className="text-3xl font-bold text-slate-900">สร้างโปรไฟล์ของคุณ</h1>
      <p className="mt-3 text-slate-600">เข้าสู่ระบบด้วย ThaiD แบบเดโมก่อน เพื่อบันทึกข้อมูลในเบราว์เซอร์นี้</p>
      <Link href="/login" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700">ไปหน้าเข้าสู่ระบบ <ArrowRight className="h-4 w-4" /></Link>
    </div>
  );

  const displayName = profile.displayName || profile.fullName;
  const completion = [profile.fullName, profile.institution, profile.fieldOfStudy, profile.bio, profile.interests.length, profile.skills.length, profile.achievements, profile.portfolioUrl || profile.githubUrl].filter(Boolean).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-wider text-blue-700">My profile</p>
          <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">โปรไฟล์ของฉัน</h1>
          <p className="mt-2 text-slate-600">เล่าเรื่องของคุณผ่านการศึกษา ความสนใจ และผลงาน</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/subscription" className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-100"><Sparkles className="h-4 w-4" /> {subscriptionLevel > 0 ? `สมาชิกระดับ ${subscriptionLevel}` : 'ระดับสมาชิก'}</Link>
          {!editing && profile.fullName && <button type="button" onClick={() => { setDraft(profile); setInterestsText(profile.interests.join(', ')); setSkillsText(profile.skills.join(', ')); setEditing(true); setSaved(false); }} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"><Pencil className="h-4 w-4" /> แก้ไขโปรไฟล์</button>}
          <button type="button" onClick={() => { logoutDemo(); router.push('/login'); }} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">ออกจากระบบ</button>
        </div>
      </div>

      <div className="mb-7 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
        <span>ThaiD ในหน้านี้เป็นเพียงเดโม และข้อมูลโปรไฟล์เป็นข้อมูลที่ผู้ใช้กรอกเอง ยังไม่ได้รับการตรวจสอบหรือยืนยันตัวตนจริง</span>
      </div>

      {editing || !profile.fullName ? (
        <form onSubmit={submit} className="space-y-6">
          <section className="clean-card p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3"><UserRound className="h-5 w-5 text-blue-600" /><h2 className="text-xl font-bold text-slate-900">ข้อมูลพื้นฐาน</h2></div>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>ชื่อและนามสกุล <span className="text-red-600">*</span><input className={fieldClass} value={draft.fullName} onChange={(e) => update('fullName', e.target.value)} required maxLength={100} placeholder="ชื่อที่ต้องการแสดงในโปรไฟล์" /></label>
              <label className={labelClass}>ชื่อที่ใช้แสดง (ถ้ามี)<input className={fieldClass} value={draft.displayName} onChange={(e) => update('displayName', e.target.value)} maxLength={60} placeholder="เช่น ชื่อเล่นหรือชื่อทีม" /></label>
            </div>
            <label className={`${labelClass} mt-5`}>แนะนำตัว<textarea className={`${fieldClass} min-h-28 resize-y`} value={draft.bio} onChange={(e) => update('bio', e.target.value)} maxLength={600} placeholder="เล่าเกี่ยวกับตัวคุณ เป้าหมาย และสิ่งที่กำลังทำ" /></label>
          </section>

          <section className="clean-card p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3"><GraduationCap className="h-5 w-5 text-blue-600" /><h2 className="text-xl font-bold text-slate-900">การศึกษา</h2></div>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>ประเภทสถานศึกษา<select className={fieldClass} value={draft.institutionType} onChange={(e) => update('institutionType', e.target.value)}><option value="university">มหาวิทยาลัย / วิทยาลัย</option><option value="school">โรงเรียน</option></select></label>
              <label className={labelClass}>ชื่อ{draft.institutionType === 'school' ? 'โรงเรียน' : 'มหาวิทยาลัย / วิทยาลัย'} <span className="text-red-600">*</span><input className={fieldClass} value={draft.institution} onChange={(e) => update('institution', e.target.value)} required maxLength={120} placeholder="ชื่อสถานศึกษาปัจจุบัน" /></label>
              <label className={labelClass}>{draft.institutionType === 'school' ? 'แผนการเรียน / สายการเรียน' : 'คณะ / สาขาวิชา'}<input className={fieldClass} value={draft.fieldOfStudy} onChange={(e) => update('fieldOfStudy', e.target.value)} maxLength={120} placeholder="เช่น วิทยาการคอมพิวเตอร์" /></label>
              <label className={labelClass}>ชั้นปี / ระดับชั้น<input className={fieldClass} value={draft.yearLevel} onChange={(e) => update('yearLevel', e.target.value)} maxLength={40} placeholder="เช่น ปี 3 หรือ ม.6" /></label>
            </div>
          </section>

          <section className="clean-card p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3"><Sparkles className="h-5 w-5 text-blue-600" /><h2 className="text-xl font-bold text-slate-900">ความสนใจและผลงาน</h2></div>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>ความสนใจ<input className={fieldClass} value={interestsText} onChange={(e) => { setInterestsText(e.target.value); setSaved(false); }} maxLength={300} placeholder="เช่น AI, สิ่งแวดล้อม, การศึกษา" /><span className="mt-1 block text-xs font-normal text-slate-500">คั่นแต่ละหัวข้อด้วยเครื่องหมายจุลภาค</span></label>
              <label className={labelClass}>ทักษะ<input className={fieldClass} value={skillsText} onChange={(e) => { setSkillsText(e.target.value); setSaved(false); }} maxLength={300} placeholder="เช่น Python, UX Design, การตลาด" /><span className="mt-1 block text-xs font-normal text-slate-500">คั่นแต่ละทักษะด้วยเครื่องหมายจุลภาค</span></label>
            </div>
            <label className={`${labelClass} mt-5`}>ประสบการณ์ / รางวัล / ผลงานที่เคยทำ<textarea className={`${fieldClass} min-h-28 resize-y`} value={draft.achievements} onChange={(e) => update('achievements', e.target.value)} maxLength={1000} placeholder="อธิบายสิ่งที่ทำจริง พร้อมผลลัพธ์ที่ตรวจสอบได้" /></label>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>ลิงก์ Portfolio<input type="url" className={fieldClass} value={draft.portfolioUrl} onChange={(e) => update('portfolioUrl', e.target.value)} placeholder="https://..." /></label>
              <label className={labelClass}>ลิงก์ GitHub<input type="url" className={fieldClass} value={draft.githubUrl} onChange={(e) => update('githubUrl', e.target.value)} placeholder="https://github.com/..." /></label>
            </div>
          </section>
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"><Save className="h-4 w-4" /> บันทึกโปรไฟล์</button>
            {profile.fullName && <button type="button" onClick={() => { setDraft(profile); setInterestsText(profile.interests.join(', ')); setSkillsText(profile.skills.join(', ')); setEditing(false); }} className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-600 hover:bg-slate-50">ยกเลิก</button>}
          </div>
        </form>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
          <div className="space-y-6">
            {saved && <div role="status" className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800">บันทึกโปรไฟล์แล้ว</div>}
            <section className={`clean-card p-7 sm:p-9 ${subscriptionLevel === 2 ? 'border-blue-300' : ''}`}>
              {subscriptionLevel === 2 && <div className={`mb-6 flex h-16 items-center rounded-xl px-5 text-sm font-bold text-white ${profileTheme === 'sky' ? 'bg-gradient-to-r from-sky-500 to-blue-600' : profileTheme === 'indigo' ? 'bg-gradient-to-r from-indigo-600 to-blue-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`}>CampusBoost Creator</div>}
              <div className="flex flex-wrap items-center gap-5">
                <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-3xl font-extrabold ${subscriptionLevel === 2 && profileTheme === 'sky' ? 'bg-sky-100 text-sky-700' : subscriptionLevel === 2 && profileTheme === 'indigo' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'}`}>{displayName.slice(0, 1)}</div>
                <div><h2 className="text-2xl font-bold text-slate-900">{displayName}</h2><p className="mt-1 text-slate-600">{profile.institution}</p>{subscriptionLevel === 2 && profileHeadline && <p className="mt-1 text-sm font-semibold text-blue-700">{profileHeadline}</p>}<span className="mt-2 inline-block rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">โปรไฟล์สมาชิก · เดโม</span></div>
              </div>
              {profile.bio && <p className="mt-7 whitespace-pre-wrap border-t border-slate-100 pt-6 leading-7 text-slate-700">{profile.bio}</p>}
            </section>
            <section className="clean-card p-7"><div className="mb-4 flex items-center gap-2"><GraduationCap className="h-5 w-5 text-blue-600" /><h3 className="text-lg font-bold text-slate-900">การศึกษา</h3></div><p className="font-semibold text-slate-800">{profile.institution}</p><p className="mt-1 text-sm text-slate-600">{[profile.fieldOfStudy, profile.yearLevel].filter(Boolean).join(' · ') || 'ยังไม่ได้ระบุสาขาหรือระดับชั้น'}</p></section>
            {(profile.interests.length > 0 || profile.skills.length > 0) && <section className="clean-card p-7"><div className="mb-5 flex items-center gap-2"><Sparkles className="h-5 w-5 text-blue-600" /><h3 className="text-lg font-bold text-slate-900">ความสนใจและทักษะ</h3></div>{profile.interests.length > 0 && <div><p className="mb-2 text-sm font-semibold text-slate-600">ความสนใจ</p><div className="flex flex-wrap gap-2">{profile.interests.map((interest) => <span key={interest} className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">{interest}</span>)}</div></div>}{profile.skills.length > 0 && <div className="mt-5"><p className="mb-2 text-sm font-semibold text-slate-600">ทักษะ</p><div className="flex flex-wrap gap-2">{profile.skills.map((skill) => <span key={skill} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">{skill}</span>)}</div></div>}</section>}
            {(profile.achievements || profile.portfolioUrl || profile.githubUrl) && <section className="clean-card p-7"><div className="mb-4 flex items-center gap-2"><BookOpen className="h-5 w-5 text-blue-600" /><h3 className="text-lg font-bold text-slate-900">ผลงานและประสบการณ์</h3></div>{profile.achievements && <p className="whitespace-pre-wrap leading-7 text-slate-700">{profile.achievements}</p>}<div className="mt-4 flex flex-wrap gap-3">{profile.portfolioUrl && <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-blue-600 hover:underline">Portfolio <ExternalLink className="h-4 w-4" /></a>}{profile.githubUrl && <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-blue-600 hover:underline">GitHub <ExternalLink className="h-4 w-4" /></a>}</div></section>}
          </div>
          <aside className="space-y-6">
            {subscriptionLevel === 2 ? <AppearanceEditor theme={profileTheme} headline={profileHeadline} onSave={saveAppearance} /> : <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-6"><h3 className="font-bold text-slate-900">ตกแต่งโปรไฟล์</h3><p className="mt-2 text-sm text-slate-600">เลือกธีมและเพิ่มข้อความบนหน้าปกได้ในสมาชิกระดับ 2</p><Link href="/subscription" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-blue-700 hover:underline">ดูระดับสมาชิก <ArrowRight size={15} /></Link></div>}
            <div className="clean-card p-6"><h3 className="font-bold text-slate-900">ความครบถ้วนของโปรไฟล์</h3><div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600" style={{ width: `${Math.round(completion / 8 * 100)}%` }} /></div><p className="mt-2 text-sm text-slate-600">{completion}/8 หัวข้อที่กรอกแล้ว</p><p className="mt-4 text-sm leading-6 text-slate-600">เพิ่มผลงานและลิงก์ที่เกี่ยวข้อง เพื่อช่วยให้ผู้อื่นรู้จักความสามารถของคุณ</p></div>
            <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-6"><h3 className="font-bold text-slate-900">พร้อมนำเสนอไอเดีย?</h3><p className="mt-2 text-sm leading-6 text-slate-600">โปรไฟล์ของคุณช่วยเล่าตัวตน ส่วนรายละเอียดโปรเจกต์จะช่วยเล่าสิ่งที่คุณกำลังสร้าง</p><Link href="/create" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 hover:underline">สร้างโปรเจกต์ <ArrowRight className="h-4 w-4" /></Link></div>
          </aside>
        </div>
      )}
    </div>
  );
}
