import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Web3Provider } from "@/context/Web3Context";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "CampusBoost | แพลตฟอร์มสนับสนุนโปรเจกต์นักศึกษาบนบล็อกเชน",
  description: "เปลี่ยนไอเดียนวัตกรรมนักศึกษาสู่ความจริงอย่างโปร่งใสด้วยระบบระดมทุนและสนับสนุนแบบ Milestone Escrow Smart Contract",
  keywords: ["CampusBoost", "Web3", "Student Crowdfunding", "Sponsorship", "Escrow Smart Contract", "Blockchain"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-slate-50 text-slate-800 antialiased flex flex-col selection:bg-blue-600 selection:text-white">
        <Web3Provider>
          <Suspense fallback={<div className="h-16 border-b border-slate-200 bg-white" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1">
            <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">กำลังโหลดข้อมูล...</div>}>
              {children}
            </Suspense>
          </main>
          <Footer />
        </Web3Provider>
      </body>
    </html>
  );
}
