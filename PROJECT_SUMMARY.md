# CampusBoost — เอกสารสรุปโครงการ (Project Executive Summary)

> **แพลตฟอร์มระดมทุนและสนับสนุนโปรเจกต์นักศึกษาแบบ Milestone-based Escrow บนบล็อกเชน**  
> *Campus Innovation & Web3 Milestone Escrow Sponsorship Platform*

---

## 1. บทสรุปผู้บริหาร (Executive Summary)

**CampusBoost** คือแพลตฟอร์มนวัตกรรม Web3 dApp ที่สร้างขึ้นเพื่อเชื่อมโยงพลังความคิดสร้างสรรค์ของนักศึกษามหาวิทยาลัยเข้ากับแบรนด์ ผู้สนับสนุน และชุมชน โดยเปลี่ยนรูปแบบการระดมทุนแบบเดิมที่ไม่มีการรับประกันผลงาน มาเป็นระบบ **Milestone-based Escrow บน Smart Contract** 

### ปัญหาที่พบ (Pain Points):
1. **นักศึกษา (Student Lead):** มีไอเดียนวัตกรรมที่ยอดเยี่ยม แต่ขาดเงินทุนเริ่มต้นในการสร้างต้นแบบ และไม่มีประวัติเครดิตทางการเงิน
2. **แบรนด์และสปอนเซอร์ (Corporate Sponsors):** ต้องการสนับสนุนกิจกรรมและเยาวชนรุ่นใหม่ แต่กังวลเรื่องความคุ้มค่า กลัวเงินสูญเปล่า หรือถูกนำไปใช้ผิดวัตถุประสงค์
3. **ความโปร่งใส (Transparency & Accountability):** การให้ทุนแบบเดิมมักขาดการติดตามผลงานที่เป็นรูปธรรม ไม่สามารถตรวจสอบย้อนหลังได้

### โซลูชันของ CampusBoost (The Solution):
- **เงินทุนถูกล็อกใน Smart Contract:** ผู้สนับสนุนโอนเงินเข้า Escrow Contract โดยเงินจะไม่โอนเข้ากระเป๋านักศึกษาในทันที
- **ทยอยปล่อยเงินตามงวดงานจริง (Milestone Proof):** เมื่อนักศึกษาส่งมอบหลักฐานความคืบหน้า (เช่น ลิงก์ Figma, ซอร์สโค้ด GitHub หรือวิดีโอสาธิต) และได้รับการตรวจสอบอนุมัติจาก Sponsor หรือมหาวิทยาลัย สัญญาอัจฉริยะจึงจะโอนเงินงวดนั้นให้โดยอัตโนมัติ
- **ระบบปกป้องผู้สนับสนุน (Dispute & Refund):** หากผลงานไม่ตรงตามสัญญา ผู้สนับสนุนสามารถเปิดข้อพิพาทเพื่อให้ Admin ไกล่เกลี่ย หรือสั่งยกเลิกเพื่อคืนเงิน (Refund) ได้ทันที

---

## 2. กลุ่มผู้ใช้งานหลัก (Target Personas & Roles)

| บทบาท | หน้าที่และความรับผิดชอบในระบบ | สิทธิประโยชน์ที่ได้รับ |
|---|---|---|
| **👨‍🎓 นักศึกษา (Student Lead)** | • สร้างหน้าโปรเจกต์และกำหนดงวดงาน (Milestones)<br>• พัฒนานวัตกรรมและส่งมอบหลักฐานความคืบหน้า<br>• รับเงินสนับสนุนตามงวดงานที่ผ่านการตรวจรับ | ได้รับเงินทุนพัฒนาโปรเจกต์จริง สร้างเครดิตผลงานบนบล็อกเชน และมีโอกาสเข้าถึงงาน/ฝึกงานจากแบรนด์ |
| **🏢 แบรนด์ / องค์กร (Corporate Sponsor)** | • เลือกสนับสนุนโปรเจกต์ผ่าน Sponsorship Packages<br>• ตรวจสอบหลักฐานและกดอนุมัติปล่อยเงินงวดงาน<br>• ติดตามผลลัพธ์ผ่าน Sponsor Dashboard | ได้รับ Brand Impressions, โลโก้เด่นบนระบบและงาน Demo Day, สิทธิ์ดึงตัว Talent นักศึกษาฝึกงาน Fast-track |
| **🚀 ผู้สนับสนุนทั่วไป (Backer)** | • ร่วมสนับสนุนโปรเจกต์ในระดับบุคคลทั่วไป<br>• ติดตามความคืบหน้านวัตกรรม<br>• มีสิทธิ์เปิดข้อพิพาทหากงานไม่คืบหน้า | ได้รับ Digital Supporter Badge บันทึกชื่อใน Hall of Backers และได้ทดลองใช้ผลงานเวอร์ชัน Beta |
| **🏛️ ผู้ดูแลระบบ / มหาวิทยาลัย (Admin)** | • ตรวจสอบและอนุมัติโปรเจกต์ก่อนเปิดระดมทุน<br>• ทำหน้าที่คนกลางตัดสินข้อพิพาท Dispute (ปล่อยเงิน หรือ คืนเงิน)<br>• ดูแลรายงานภาพรวมและค่าธรรมเนียม 2% | ยกระดับระบบนิเวศนวัตกรรมของมหาวิทยาลัย เพิ่มอัตราความสำเร็จของโปรเจกต์นักศึกษาอย่างเป็นรูปธรรม |

---

## 3. สถาปัตยกรรมและเทคโนโลยีที่ใช้ (Tech Stack & Architecture)

ระบบถูกออกแบบในลักษณะ **Hybrid Web3 + Modern Web2** เพื่อให้ได้ทั้งความปลอดภัยสูงสุดของธุรกรรมทางการเงิน และประสบการณ์ผู้ใช้งาน (UX) ที่รวดเร็ว ลื่นไหล สบายตา

```
[ผู้ใช้งาน: Student / Sponsor / Admin / Backer]
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│    Frontend: Next.js 16 (App Router + Turbopack)            │
│    React 19 | TypeScript | Tailwind CSS v4 | Lucide Icons   │
│    ธีมออกแบบ: 60-20-20 Clean White & Blue สไตล์ FinTech     │
└──────────────┬───────────────────────────────┬──────────────┘
               │ Web3 Call / State Sync        │ Cache & Local Storage
               ▼                               ▼
┌──────────────────────────────┐  ┌───────────────────────────┐
│  Smart Contract Layer        │  │  Web3 Role Simulator      │
│  - CampusBoost.sol (Escrow)  │  │  - One-Click Switcher     │
│  - MockUSDC.sol (ERC-20)     │  │  - In-Memory State Sync   │
│  - OpenZeppelin Security     │  │  - Confetti Animations    │
│  (Base Sepolia/Polygon Amoy) │  │  (Zero-Lag Hackathon Demo)│
└──────────────────────────────┘  └───────────────────────────┘
```

### รายละเอียดเทคโนโลยี:
- **Smart Contract:** Solidity 0.8.20, OpenZeppelin v5 (`ReentrancyGuard`, `Ownable`, `Pausable`), Hardhat
- **Unit Testing:** Mocha, Chai, Ethers.js v6 (**ผ่านการทดสอบ 100% ครบทุก 5/5 Test Cases**)
- **Frontend Framework:** Next.js 16.4+, React 19, TypeScript
- **Styling Design:** Tailwind CSS v4 ภายใต้หลักการ **60-20-20 Clean White & Blue Theme** (ขาวสว่าง 60%, น้ำเงินเข้ม 20%, น้ำเงินสดใส 20%)

---

## 4. ภาพรวมหน้าจอระบบ (5 Core Pages Breakdown)

### 4.1 หน้าแรก (Home Page — `/`)
- **Hero Section:** พาดหัวสร้างความมั่นใจ พร้อมจุดเน้นความโปร่งใสของ Web3 Escrow
- **Platform Metrics:** แสดงสถิติสดของระบบ (ยอดเงินระดมทุนรวม, จำนวนผู้สนับสนุน, จำนวนโครงการ, อัตราความสำเร็จ)
- **Category Filter:** ค้นหาโครงการตามหมวดหมู่: AI, สิ่งแวดล้อม (Green Tech), สุขภาพ (HealthTech), การศึกษา (EdTech), ชุมชน (Smart City)
- **Project Cards:** การ์ดโครงการแสดงหลอดความคืบหน้า Milestone, ข้อมูลมหาวิทยาลัย และจำนวนผู้สนับสนุน
- **How It Works & Sponsorship Matrix:** อธิบายกลไก 3 ขั้นตอน และเปรียบเทียบระดับแพ็กเกจสนับสนุน

### 4.2 หน้ารายละเอียดโปรเจกต์ (Project Detail — `/projects/[id]`)
- **ข้อมูลโครงการ:** ปัญหา ที่มา นวัตกรรม และทีมผู้พัฒนา
- **Interactive Milestone Timeline:** ไทม์ไลน์งวดงานแสดงสถานะเรียลไทม์ (ปล่อยเงินแล้ว / รอตรวจรับ / อยู่ระหว่างทำ)
- **Evidence Review:** แสดงลิงก์หลักฐานงานจริง (GitHub, Figma, Video)
- **Interactive Action Buttons:**
  - *Student:* ปุ่ม "ส่งหลักฐานงาน" (Submit Deliverable)
  - *Sponsor / Admin:* ปุ่ม "อนุมัติตรวจรับงาน" (Approve Milestone)
  - *Admin:* ปุ่ม "ปล่อยเงินงวดนี้" (Release Funds) พร้อมหักค่าธรรมเนียม 2%
  - *Backer:* ปุ่ม "เปิดข้อพิพาท" (Open Dispute)
- **Sponsorship Modal:** โมดอลเลือกแพ็กเกจ (Supporter, Booster, Sponsor, Title Sponsor) พร้อมคำนวณเงินเข้า Escrow
- **Hall of Backers:** รายชื่อผู้สนับสนุนพร้อมประวัติ Transaction Hash บนบล็อกเชน

### 4.3 หน้าสร้างโปรเจกต์ (Create Project — `/create`)
- **Multi-section Form:** ข้อมูลทั่วไป, หมวดหมู่, สถาบัน, รูปภาพหน้าปก, รายละเอียดที่มา
- **Dynamic Milestone Builder:** สามารถเพิ่ม/ลบงวดงานได้อิสระ กำหนดชื่องวดงาน รายละเอียดงาน และกำหนดวันส่งมอบ
- **Automated Validation:** ระบบตรวจสอบว่ายอดรวมงบประมาณของทุกงวดต้องเท่ากับเป้าหมาย 100% ก่อนส่งเข้าคิวรอ Admin อนุมัติ

### 4.4 พอร์ทัลสปอนเซอร์ (Sponsor Dashboard — `/dashboard/sponsor`)
- **Brand Reach Analytics:** สรุปตัวเลขผลตอบแทนของแบรนด์ (ยอด Brand Impressions, จำนวนโครงการในพอร์ต)
- **Milestone Verifications Queue:** คิวตรวจรับงวดงานที่นักศึกษาส่งมอบ พร้อมปุ่มกดอนุมัติ On-chain
- **Brand Perks & Deliverables Showcase:** แสดงสถานะการได้รับสิทธิ์ประโยชน์ (โลโก้บนระบบ, บูธในงาน Demo Day, สิทธิ์เข้าถึง Talent นักศึกษาฝึกงาน)

### 4.5 โต๊ะทำงานผู้ดูแลระบบ (Admin Dashboard — `/dashboard/admin`)
- **Platform Governance Metrics:** สถิติค่าธรรมเนียมสะสม 2% ที่แพลตฟอร์มได้รับ, โครงการที่สำเร็จ
- **Project Approval Queue:** คิวตรวจสอบและกดอนุมัติโครงการใหม่ก่อนเปิดรับเงิน
- **Dispute Resolution Desk:** เครื่องมือไกล่เกลี่ยข้อพิพาท 2 ทางเลือก:
  1. *คำตัดสินที่ 1:* หลักฐานผ่านเกณฑ์ ให้ปล่อยเงินงวดงาน
  2. *คำตัดสินที่ 2:* ยกเลิกโครงการและคืนเงินให้ผู้สนับสนุนทั้งหมด (Refund Backers)
- **All Projects Registry:** ตารางสรุปสถานะโครงการทั้งหมดในระบบ

---

## 5. การวิเคราะห์โมเดลธุรกิจและความถูกต้องทางกฎหมาย (Business Model & Compliance)

### 5.1 ไม่ใช่การลงทุน (Sponsorship over Investment)
- แพลตฟอร์มระบุชัดเจนทั้งในหน้าเว็บและสัญญา Smart Contract ว่าเป็น **"การสนับสนุนแลกสิทธิ์การโปรโมตแบรนด์ / เครดิต / Badge"**
- **ไม่มีการเสนอขายหลักทรัพย์ หุ้น สิทธิการแบ่งกำไร หรือเงินปันผลใดๆ ทั้งสิ้น** ทำให้ถูกต้องตามกฎหมายคุ้มครองผู้บริโภคและกฎหมายหลักทรัพย์

### 5.2 ช่องทางรายได้ของแพลตฟอร์ม (Revenue Streams)
1. **2% Milestone Release Fee:** หักค่าธรรมเนียม 2% ทุกครั้งที่มีการปล่อยเงินงวดงานจาก Escrow เข้ากระเป๋านักศึกษา
2. **Sponsorship Matching & Verification Service:** ค่าบริการจัดกิจกรรมจับคู่แบรนด์กับมหาวิทยาลัย (Corporate Demo Day)
3. **University Enterprise Dashboard:** บริการระบบติดตามทุนวิจัยและนวัตกรรมภายในสำหรับมหาวิทยาลัย

---

## 6. ผลการทดสอบระบบ (Quality Assurance & Test Results)

### 6.1 Smart Contract Unit Tests (Hardhat / Chai)
```text
  CampusBoost Smart Contract
    1. Project Creation & Admin Approval
      ✔ Should allow student to create a project with milestones
      ✔ Should allow admin to approve a pending project
    2. Funding & Milestone Release Flow
      ✔ Should allow backer and sponsor to fund project (Escrow)
      ✔ Should execute complete Milestone Submit -> Approve -> Release cycle with 2% fee
    3. Dispute & Refund Flow
      ✔ Should allow backer to open dispute and admin to resolve by cancelling for refund

  5 passing (913ms)
```

### 6.2 Frontend Production Build (Next.js 16 Turbopack)
- **Static Pages Generation:** 8/8 Routes Compiled Successfully
- **Type Checking:** 0 TypeScript Errors
- **Linting:** Passed

---

## 7. คู่มือการเปิดใช้งานและทดสอบ (Quickstart Guide)

### คำสั่งรันในเครื่อง (Local Environment)
```bash
# 1. เข้าสู่โฟลเดอร์ frontend และรัน Dev Server
cd frontend
npm run dev
# เปิดเบราว์เซอร์ไปที่: http://localhost:3000

# 2. รันชุดทดสอบ Smart Contract
cd contracts
npx hardhat test
```

### วิธีการสาธิตระบบ (One-Click Demo Walkthrough)
1. เปิดหน้าเว็บ [http://localhost:3000](http://localhost:3000)
2. คลิกเลือกโครงการ **"CampusRent"**
3. คลิกปุ่ม **"สนับสนุนโปรเจกต์นี้"** เพื่อทดลองเลือกแพ็กเกจ Sponsor
4. สลับบทบาทที่แถบเมนูด้านบนขวา (Quick Role Switcher):
   - สลับเป็น **"Student Lead"** เพื่อส่งหลักฐานงวดงาน
   - สลับเป็น **"Brand Sponsor"** เพื่อกดอนุมัติตรวจรับงาน
   - สลับเป็น **"University Admin"** เพื่อปล่อยเงินงวดพร้อมหัก 2% Fee หรือตรวจสอบโครงการใหม่ในหน้า Admin Dashboard
