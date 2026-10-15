# AGENTS.md — CampusBoost System Context & AI Agent Directives

> **เอกสารคู่มือบริบทและแนวทางปฏิบัติสำหรับ AI Coding Assistants & Autonomous Agents**  
> (รองรับ Cursor, Claude Code, Windsurf, Copilot, ChatGPT, Gemini, และ AI Agents ทุกแพลตฟอร์ม)

---

## 1. ข้อมูลภาพรวมโครงการ (Project Overview)

**CampusBoost** คือแพลตฟอร์มระดมทุนและสนับสนุนโปรเจกต์นักศึกษาแบบ **Milestone-based Escrow บนบล็อกเชน (Web3 dApp)**  
แก้ปัญหา Pain Point สำคัญของวงการสตาร์ทอัพนักศึกษา:
1. **นักศึกษา (Student Lead):** มีไอเดียนวัตกรรมแต่ขาดเงินทุนเริ่มต้น ไม่มีเครดิตทางการเงิน
2. **สปอนเซอร์และแบรนด์ (Corporate Sponsor):** ต้องการสนับสนุนเด็กรุ่นใหม่ แต่กลัวเงินสูญเปล่าหรือถูกใช้ผิดวัตถุประสงค์
3. **ความโปร่งใส (Transparency):** ใช้ Smart Contract ล็อกเงินสนับสนุนไว้ใน Escrow และจะทยอยเบิกจ่ายเป็นงวดๆ เมื่อส่งมอบหลักฐานผลงานจริง (GitHub, Figma, Demo) และผ่านการตรวจรับ

---

## 2. กฎเหล็กที่ AI ทุกตัวต้องปฏิบัติตามอย่างเคร่งครัด (Inviolable Rules)

1. **ห้ามใช้คำว่า "ลงทุน" (Investment / Share / Equity / Dividend):**
   - แพลตฟอร์มนี้เป็น **"Sponsorship" (การสนับสนุนแลกสิทธิ์การโปรโมตแบรนด์ / เครดิต / Badge)** เท่านั้น
   - ห้ามเขียนข้อความสัญญาผลตอบแทนทางการเงิน การแบ่งกำไร หรือการถือหุ้นโดยเด็ดขาด เพื่อความถูกต้องตามกฎหมาย
2. **กฎความปลอดภัย Escrow (Escrow Security):**
   - เงินสนับสนุนต้องถูกล็อกไว้ใน Contract เท่านั้น ห้ามโอนเข้ากระเป๋านักศึกษาในทันที
   - การปล่อยเงินต้องผ่านสถานะ `Approved` จาก Sponsor หรือ Admin ก่อนเสมอ
   - ต้องมีระบบหักค่าธรรมเนียม 2% ให้แพลตฟอร์ม (`feeRecipient`) เมื่อปล่อยเงินงวด
3. **กฎการออกแบบ UI: ธีม 60-20-20 คลีน ขาว-น้ำเงิน (Clean White & Blue):**
   - **60% Dominant (ขาว/สว่าง):** พื้นหลัง `bg-slate-50` หรือ `bg-white`, การ์ด `clean-card bg-white border border-slate-200 shadow-xs`
   - **20% Secondary (น้ำเงินเข้ม/Deep Navy):** หัวข้อ `text-slate-900`, คอนเทนเนอร์ `bg-blue-50/70`, `text-slate-700`
   - **20% Accent (น้ำเงินสดใส):** ปุ่มหลัก `bg-blue-600 hover:bg-blue-700 text-white`, แถบความคืบหน้า `from-blue-600 to-indigo-600`, ไฮไลต์ `text-blue-600`
   - **ห้ามเปลี่ยนกลับเป็น Dark Mode มืดทึบ** ยกเว้นผู้ใช้จะสั่งชัดเจน
4. **สถาปัตยกรรม Next.js 16 (App Router with Turbopack):**
   - ห้ามใช้ `export const dynamic = 'force-dynamic'` ใน Client Components เพราะไม่รองรับกับ `cacheComponents` ของ Next.js 16
   - Client Component ใดที่เรียกใช้ `useParams()`, `usePathname()`, หรือ `useSearchParams()` **ต้องหุ้มด้วย `<Suspense fallback={...}>` เสมอ** เพื่อป้องกัน Prerender Blocking Error

---

## 3. Tech Stack & โครงสร้างสถาปัตยกรรม

| เลเยอร์ | เทคโนโลยีที่ใช้ | วัตถุประสงค์ |
|---|---|---|
| **Smart Contract** | Solidity 0.8.20, Hardhat, OpenZeppelin v5 | `CampusBoost.sol` (Escrow logic, ReentrancyGuard, Ownable, Pausable) |
| **Testing** | Hardhat, Mocha, Chai, Ethers.js v6 | 5/5 Passing Unit Tests ครอบคลุมทุก Flow |
| **Frontend Framework** | Next.js 16.4+ (App Router, Turbopack) | React 19, TypeScript, Tailwind CSS v4 |
| **Icons & Visuals** | `lucide-react`, `canvas-confetti` | ไอคอนมินิมอล เอฟเฟกต์ Confetti เมื่อทำธุรกรรมสำเร็จ |
| **Web3 State** | Custom `Web3Context` (React Context) | เชื่อมต่อ Web3 Wallet จริง + มี Interactive Role Simulator ในตัว |

---

## 4. แผนผังโฟลเดอร์โครงการ (Project Directory Structure)

```text
U-hack/
├── contracts/                        # ส่วนบล็อกเชนและ Smart Contract
│   ├── contracts/
│   │   ├── CampusBoost.sol          # สัญญาหลัก Escrow, Milestone, Dispute, 2% Fee
│   │   └── MockUSDC.sol             # ERC-20 Mock Token สำหรับทดสอบ Testnet
│   ├── test/
│   │   └── CampusBoost.test.js      # Unit Tests ครอบคลุมทุกกรณี (Passing 100%)
│   ├── scripts/
│   │   └── deploy.js                # สคริปต์ Deploy ขึ้นเครือข่าย Base Sepolia / Polygon Amoy
│   ├── hardhat.config.js            # การตั้งค่า Hardhat & Solidity Compiler
│   └── package.json
│
├── frontend/                         # ส่วนเว็บแอปพลิเคชัน Next.js 16
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx           # Root Layout (Suspense, Web3Provider, Clean Theme)
│   │   │   ├── page.tsx             # 7.1 หน้าแรก: Hero, Metrics, Categories, Project Cards
│   │   │   ├── projects/[id]/page.tsx # 7.2 หน้ารายละเอียด: Milestone Timeline, Support Modal
│   │   │   ├── create/page.tsx      # 7.3 หน้าสร้างโปรเจกต์: Dynamic Milestone Builder
│   │   │   ├── dashboard/
│   │   │   │   ├── sponsor/page.tsx # 7.4 Sponsor Dashboard: Brand Reach, Verification Queue
│   │   │   │   └── admin/page.tsx   # 7.5 Admin Dashboard: Project Approvals, Dispute Desk
│   │   │   └── globals.css          # CSS Variables 60-20-20 White & Blue, Utility Classes
│   │   ├── components/
│   │   │   └── layout/
│   │   │       ├── Navbar.tsx       # แถบนำทาง + Quick Demo Role Switcher
│   │   │       └── Footer.tsx       # ท้ายหน้าเว็บ + กล่องข้อชี้แจงกฎหมาย (Disclaimer)
│   │   ├── context/
│   │   │   └── Web3Context.tsx      # State Machine จัดการสลับบทบาท, สนับสนุน, ส่งงาน, อนุมัติ
│   │   ├── lib/
│   │   │   └── constants.ts         # แพ็กเกจสปอนเซอร์, ข้อมูลจำลอง 4 โครงการ, ที่อยู่ Contract
│   │   └── types/
│   │       └── campusboost.ts       # TypeScript Interfaces (Project, Milestone, Tier)
│   └── package.json
│
├── README.md                         # ข้อกำหนดโครงการฉบับภาษาไทย
└── AGENTS.md                         # เอกสารฉบับนี้สำหรับสั่งการ AI
```

---

## 5. คำสั่งที่ใช้ในการพัฒนาและทดสอบ (CLI Commands)

### 5.1 Smart Contract Layer
```bash
# ย้ายเข้าโฟลเดอร์ contracts
cd contracts

# คอมไพล์ Solidity contracts
npx hardhat compile

# รันชุดทดสอบ Unit Tests
npx hardhat test

# รัน Deploy สคริปต์บน Local Hardhat Node
npx hardhat run scripts/deploy.js
```

### 5.2 Frontend Layer
```bash
# ย้ายเข้าโฟลเดอร์ frontend
cd frontend

# รันเซิร์ฟเวอร์สำหรับพัฒนา (Dev Server)
npm run dev

# ทดสอบตรวจสอบความถูกต้องและคอมไพล์ Production Build
npm run build
```

---

## 6. โครงสร้างสถานะโครงการและ Milestones (State Machine)

### 6.1 สถานะโครงการ (ProjectStatus)
- `Draft (0)`: กำลังร่างข้อมูล
- `PendingReview (1)`: ส่งมายัง Admin กำลังรอการตรวจสอบอนุมัติ
- `Active (2)`: ผ่านการอนุมัติแล้ว เปิดรับเงินสนับสนุนเข้า Escrow และส่งมอบงานได้
- `Completed (3)`: ส่งมอบและเบิกจ่ายงวดงานครบ 100%
- `Cancelled (4)`: โครงการถูกยกเลิก ผู้สนับสนุนสามารถกดรับเงินคืน (Refund)
- `Disputed (5)`: เกิดข้อพิพาท ระงับการปล่อยเงินชั่วคราวเพื่อให้ Admin เข้ามาไกล่เกลี่ย

### 6.2 สถานะงวดงาน (MilestoneStatus)
- `Pending (0)`: อยู่ระหว่างดำเนินการ (นักศึกษากำลังพัฒนา)
- `Submitted (1)`: นักศึกษาส่งหลักฐานความคืบหน้าแล้ว (GitHub, Figma, Video) รอตักเตือน/ตรวจรับ
- `Approved (2)`: Sponsor หรือ Admin ตรวจสอบหลักฐานแล้วอนุมัติ
- `Rejected (3)`: หลักฐานไม่ผ่านเกณฑ์ ให้นักศึกษาส่งใหม่
- `Released (4)`: เงินงวดนั้นถูกปล่อยโอนเข้ากระเป๋านักศึกษาเรียบร้อย พร้อมหัก 2% Platform Fee

---

## 7. บทบาทผู้ใช้และการจำลองระบบ (Demo Role Simulator)

ใน Navbar ด้านบนขวามีเมนูสลับบทบาทจำลอง ซึ่ง AI ตัวถัดไปสามารถอ้างอิงเพื่อพัฒนาฟังก์ชันเฉพาะกลุ่มได้:
1. **👨‍🎓 Student Lead (`student`):**
   - มีสิทธิ์สร้างโครงการใหม่ (`/create`)
   - มีสิทธิ์กดส่งหลักฐานความคืบหน้า (`submitMilestoneEvidence`) ในหน้ารายละเอียด
2. **🏢 Brand / Corporate Sponsor (`sponsor`):**
   - มีสิทธิ์เลือกซื้อ Sponsor Packages (Supporter, Booster, Sponsor, Title Sponsor)
   - มีสิทธิ์กดอนุมัติตรวจรับงาน (`approveMilestone`) เมื่อนักศึกษาส่งหลักฐาน
   - เข้าถึงหน้า `/dashboard/sponsor` เพื่อดูตัวเลข Brand Impressions
3. **🏛️ University Admin (`admin`):**
   - ตรวจสอบและกดอนุมัติโครงการใหม่ในคิว (`approveProjectAdmin`)
   - มีอำนาจตัดสินข้อพิพาท Dispute: ให้ปล่อยเงินงวด หรือสั่งยกเลิกเพื่อคืนเงิน Backers
   - เข้าถึงหน้า `/dashboard/admin` ดูสถิติรายได้ค่าธรรมเนียม 2%
4. **🚀 General Backer (`backer`):**
   - ผู้สนับสนุนรายย่อย ติดตามความคืบหน้า และสามารถเปิดข้อพิพาท Dispute ได้หากโครงการไม่คืบหน้า

---

## 8. คำแนะนำสำหรับ AI ในการต่อยอดฟีเจอร์ในอนาคต (Future Enhancements)

หากต้องการสั่ง AI ให้พัฒนาฟีเจอร์เพิ่มเติม แนะนำให้ทำตามลำดับดังนี้:
1. **เชื่อมต่อ IPFS Pinata จริง:**
   - ใน `src/app/api/ipfs/route.ts` สำหรับรับไฟล์อัปโหลด PDF/รูปภาพ แล้วส่งต่อให้ Pinata API เพื่อนำ IPFS Hash มาเก็บใน `evidenceURI`
2. **เชื่อมต่อ Wagmi / RainbowKit จริงกับ Testnet:**
   - นำ ABI จาก `contracts/artifacts/contracts/CampusBoost.sol/CampusBoost.json` ไปผูกกับ Hook `useWriteContract` ของ Wagmi
   - กำหนดค่าเครือข่าย Base Sepolia (Chain ID: 84532) หรือ Polygon Amoy (Chain ID: 80002)
3. **ระบบแจ้งเตือน Web3 Toast:**
   - เพิ่ม Toast Notification แจ้งสถานะขณะทำธุรกรรม (Pending, Confirmed, Failed)

---
*เอกสารนี้จัดทำขึ้นเพื่อใช้เป็น Master Context สำหรับ AI ทุกโมเดล เมื่อได้รับคำสั่งให้แก้ไขโค้ด กรุณาอ่านและรักษาโครงสร้างตามข้อกำหนดข้างต้นเสมอ*
