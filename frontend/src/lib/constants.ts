import { Project, ProjectStatus, MilestoneStatus, SponsorPerk, DirectiveStatus } from '@/types/campusboost';

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CAMPUSBOOST_CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const USDC_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS || "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

export const SPONSOR_PACKAGES: SponsorPerk[] = [
  {
    id: 1,
    name: "Supporter",
    minAmount: 0.01, // ~500 THB equivalent in demo ETH
    description: "สำหรับบุคคลทั่วไปที่ต้องการสนับสนุนไอเดียของนักศึกษา",
    perks: [
      "ชื่อของคุณใน Hall of Backers ของโปรเจกต์",
      "รับตราประทับดิจิทัล On-chain Supporter Badge",
      "รับการแจ้งเตือนอัปเดตความคืบหน้าแบบ Exclusive",
    ],
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  },
  {
    id: 2,
    name: "Booster",
    minAmount: 0.05, // ~2,500 THB
    description: "สำหรับกลุ่มหรือร้านค้าขนาดเล็กที่ต้องการร่วมผลักดันนวัตกรรม",
    perks: [
      "สิทธิ์ของ Supporter ทั้งหมด",
      "แสดงโลโก้/รูปโปรไฟล์ขนาดเล็กบนหน้าโปรเจกต์",
      "ได้รับสินค้าตัวอย่างหรือสิทธิ์ทดลองใช้ Beta Version ก่อนใคร",
      "โหวตฟีเจอร์สำหรับ Milestone ถัดไป",
    ],
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    popular: true,
  },
  {
    id: 3,
    name: "Sponsor",
    minAmount: 0.2, // ~10,000 - 50,000 THB
    description: "สำหรับองค์กรและแบรนด์ที่ต้องการการมองเห็นสูงและสนับสนุน talent",
    perks: [
      "สิทธิ์ของ Booster ทั้งหมด",
      "โลโก้ขนาดเด่นชัดบนหน้าโปรเจกต์และแบนเนอร์กิจกรรม",
      "สิทธิ์โหวตตรวจสอบและอนุมัติ Milestone (Milestone Verifier)",
      "โพสต์ขอบคุณพร้อมแท็กแบรนด์ใน Social Media ทุกช่องทาง",
      "ติดป้ายแบรนด์ในงาน Demo Day ของมหาวิทยาลัย",
    ],
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  },
  {
    id: 4,
    name: "Title Sponsor",
    minAmount: 0.5, // 50,000+ THB
    description: "สิทธิ์สนับสนุนระดับสูงสุด สร้างภาพลักษณ์ผู้นำนวัตกรรม",
    perks: [
      "สิทธิ์สูงสุดทุกรายการ",
      "พ่วงชื่อแบรนด์ในชื่อโปรเจกต์ (e.g., 'Powered by [Brand]')",
      "สิทธิ์คัดเลือกนักศึกษาเข้าสู่ Fast-track Internship / Job Offer",
      "กล่าวเปิดงานหรือส่งตัวแทนร่วมตัดสินในวัน Demo Day",
      "บันทึกเครดิตแบรนด์ถาวรในรายงานวิจัยและ Metadata บล็อกเชน",
    ],
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
];

export const CATEGORIES = [
  { id: 'All', name: 'ทั้งหมด', icon: 'Sparkles' },
  { id: 'Camp', name: 'ค่ายและกิจกรรมเยาวชน (Camp & Hackathon)', icon: 'Tent' },
  { id: 'AI', name: 'ปัญญาประดิษฐ์ (AI)', icon: 'Cpu' },
  { id: 'Environment', name: 'สิ่งแวดล้อม (Green)', icon: 'Leaf' },
  { id: 'Health', name: 'สุขภาพ (HealthTech)', icon: 'Activity' },
  { id: 'Education', name: 'การศึกษา (EdTech)', icon: 'GraduationCap' },
  { id: 'Community', name: 'ชุมชนและเมือง (Smart City)', icon: 'Users' },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-camp-1',
    onChainId: 5,
    title: 'TechYouth Camp 2026: ค่ายปั้นเยาวชนสู่นวัตกรเทคโนโลยีเพื่อสังคม (3 วัน 2 คืน)',
    tagline: 'ค่ายอบรมและ Mini-Hackathon สำหรับเยาวชน 120 คน เปิดรับสปอนเซอร์ร่วมสนับสนุนและเสนอคำขอทิศทาง Track กิจกรรม',
    description: `ทีมนิสิตนักศึกษาชมรมนวัตกรรมและเทคโนโลยี ร่วมกับเครือข่ายสโมสรนิสิต จัดทำโครงการค่ายอบรมเชิงปฏิบัติการ "TechYouth Camp 2026"

เป้าหมายคือการเปิดพื้นที่การเรียนรู้ฟรีแก่นักเรียนระดับมัธยมปลายและนิสิตปี 1 จำนวน 120 คนจากทั่วประเทศ ได้มาร่วมเรียนรู้ทักษะเทคโนโลยีสมัยใหม่ การเขียนโปรแกรม AI และร่วมแข่งขัน Mini-Hackathon 3 วัน 2 คืน เพื่อสร้างโซลูชันแก้ไขปัญหาสังคมจริง

🎯 **ระบบสนับสนุนค่ายพร้อมคำขอ:**
องค์กรและผู้สนับสนุนระบุจำนวนบาทที่ต้องการให้พร้อม "คำขอทิศทางการจัดกิจกรรม" (เช่น เพิ่มหัวข้อเวิร์กช็อป กำหนดโจทย์การแข่งขัน หรือสนับสนุนโควตานักเรียนต่างจังหวัด) ทีมผู้จัดพิจารณาคำขอและตอบรับได้ โดยรายการนี้เป็นข้อมูลจำลอง ยังไม่มีการชำระเงินจริง`,
    category: 'Camp',
    ownerAddress: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    ownerName: 'กิตติคุณ & ชมรมนวัตกรรมเยาวชน TechYouth',
    university: 'จุฬาลงกรณ์มหาวิทยาลัย & ม.เกษตรศาสตร์',
    coverImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    goalAmount: 1.2,
    raisedAmount: 0.75,
    campGoalTHB: 144000,
    campRaisedTHB: 90000,
    deadline: '2026-11-20',
    status: ProjectStatus.Active,
    sponsorsCount: 8,
    featured: true,
    isCampProject: true,
    campDetails: {
      targetAudience: 'นักเรียนมัธยมปลายและนิสิตปี 1 จำนวน 120 คน (มีโควตานักเรียนต่างจังหวัด)',
      duration: '3 วัน 2 คืน (15-17 พฤศจิกายน 2026)',
      location: 'อาคารวิศวฯ 100 ปี จุฬาลงกรณ์มหาวิทยาลัย',
      openForDirectives: true,
    },
    campDirectives: [
      {
        id: 'dir-1',
        sponsorAddress: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
        sponsorName: 'SCB 10X Ventures',
        sponsorAvatar: '🏢',
        amount: 0.45,
        amountTHB: 54000,
        title: 'ขอเพิ่ม Track: AI & FinTech for Sustainable Community และช่วง Pitching มอบรางวัล',
        directionRequest: 'ขอให้ทีมงานจัดให้มี Track การแข่งขัน Mini-Hackathon และ Hands-on Workshop เจาะลึกเรื่อง AI & Financial Literacy ในวันที่ 2 ของค่าย (เวลา 13:00 - 17:00 น.) พร้อมเปิดช่วง Pitching และมอบเงินรางวัลในนามแบรนด์ SCB 10X',
        expectedOutcomes: 'เยาวชน 40 คนได้ฝึกสร้าง Prototype แอป AI แก้ปัญหาการเงินชุมชน และได้รับคำแนะนำจากผู้เชี่ยวชาญด้าน Tech Startup',
        sponsorPerksOffered: 'ส่ง Senior AI Engineer & Product Manager มาร่วมเป็นวิทยากรและ Mentor ตลอดทั้งวัน + เสื้อค่ายและของที่ระลึกพิเศษ 120 ชุด',
        status: DirectiveStatus.Accepted,
        createdAt: '2026-10-12 10:30',
        reviewedAt: '2026-10-13 14:00',
        responseNote: 'ทีมผู้จัดค่ายยินดีตอบรับคำขอนี้เป็นอย่างยิ่ง โดยได้บรรจุ Track นี้เข้าสู่กำหนดการวันที่ 2 และจัดเตรียมโค้ชดูแลน้องๆ เรียบร้อยแล้วครับ ขอบพระคุณสำหรับการสนับสนุนครับ!',
        txHash: '0x9a8b7...11cd',
      },
      {
        id: 'dir-2',
        sponsorAddress: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
        sponsorName: 'GreenTech Solutions & Community',
        sponsorAvatar: '🚀',
        amount: 0.3,
        amountTHB: 36000,
        title: 'ขอเพิ่ม Track: Green IoT & Hardware Sensor Kit และโควตานักเรียนต่างจังหวัด 20 คน',
        directionRequest: 'ต้องการให้มีช่วง Hands-on Workshop ต่อยอดบอร์ด Microcontroller และเซนเซอร์วัดค่าฝุ่น PM2.5 / คุณภาพน้ำ พร้อมสนับสนุนโควตาที่พักและค่าเดินทางแก่นักเรียนจากโรงเรียนต่างจังหวัด 20 คน',
        expectedOutcomes: 'น้องๆ ได้ทดลองต่อวงจรเซนเซอร์จริง และนำชิ้นงานต้นแบบกลับไปติดตั้งวัดผลต่อยอดที่โรงเรียนตนเอง',
        sponsorPerksOffered: 'จัดเตรียมชุดบอร์ด ESP32 และเซนเซอร์ 25 ชุด สนับสนุนฟรีตลอดค่าย',
        status: DirectiveStatus.Pending,
        createdAt: '2026-10-14 16:45',
        txHash: '0x5e2c1...89ff',
      },
    ],
    milestones: [],
    backersList: [
      {
        address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
        amount: 0.45,
        amountTHB: 54000,
        packageId: 4,
        tierName: 'Directive Sponsor (คำขอทิศทาง)',
        timestamp: '2026-10-12 10:30',
        txHash: '0x9a8b7...11cd',
        isDirective: true,
        directiveTitle: 'ขอเพิ่ม Track: AI & FinTech for Sustainable Community',
      },
      {
        address: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
        amount: 0.2,
        amountTHB: 24000,
        packageId: 3,
        tierName: 'Sponsor',
        timestamp: '2026-10-13 11:20',
        txHash: '0x1a2b3...4455',
      },
      {
        address: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
        amount: 0.1,
        amountTHB: 12000,
        packageId: 2,
        tierName: 'Booster',
        timestamp: '2026-10-14 09:40',
        txHash: '0x77889...aabb',
      },
    ],
  },
  {
    id: 'proj-1',
    onChainId: 1,
    title: 'CampusRent: แพลตฟอร์มหาหอพักนักศึกษาพร้อมสัญญาดิจิทัลและรีวิวโปร่งใส',
    tagline: 'ระบบค้นหาหอพักและค้ำประกันเงินมัดจำด้วย Smart Contract หมดปัญหาโดนยึดเงินมัดจำไม่เป็นธรรม',
    description: `ทีมนักศึกษาวิศวกรรมคอมพิวเตอร์และสถาปัตยกรรมศาสตร์ รวมตัวกันเพื่อแก้ปัญหาใหญ่ของนักศึกษามหาวิทยาลัยทั่วประเทศ: การถูกเอาเปรียบเรื่องสัญญาเช่าและการยึดเงินประกันมัดจำหอพักอย่างไม่เป็นธรรม

**CampusRent** คือแพลตฟอร์มที่รวมหอพักรอบมหาวิทยาลัย พร้อมระบบตรวจสอบตัวตนหอพักจริง และนำระบบ Digital Lease Agreement มาช่วยล็อกเงินมัดจำใน Smart Contract ซึ่งจะคืนให้อัตโนมัติเมื่อสิ้นสุดสัญญาโดยไม่มีข้อพิพาท พร้อมรีวิวจากผู้เช่าจริงผ่านการ Verify ตัวตน`,
    category: 'Community',
    ownerAddress: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    ownerName: 'ธนกฤต & ทีม DevChula',
    university: 'จุฬาลงกรณ์มหาวิทยาลัย',
    coverImage: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
    goalAmount: 1.0,
    raisedAmount: 0.85,
    deadline: '2026-11-30',
    status: ProjectStatus.Active,
    sponsorsCount: 12,
    featured: true,
    customAgreement: {
      enabled: true,
      title: 'สัญญาร่วมสนับสนุนเพื่อการพัฒนาระบบค้ำประกันหอพักและสิทธิ์ Exclusive Strategic Partner',
      amount: 0.25,
      summary: 'ข้อเสนอพิเศษจากทีมนักศึกษา DevChula ในใบประกาศระดมทุน สำหรับผู้สนับสนุนที่ต้องการเป็น Strategic Partner ร่วมนำระบบ Smart Contract ไปเชื่อมต่อกับหอพักเครือข่าย พร้อมสิทธิ์ทดสอบระบบ และบันทึกเครดิต Co-Founding Partner ถาวร',
      perks: [
        'สิทธิ์เชื่อมต่อ CampusRent Smart Contract Gateway สำหรับหอพักในสังกัดฟรี 1 ปีเต็ม',
        'บันทึกชื่อและตราประทับเกียรติยศ Co-Founding Partner ถาวรบนบล็อกเชน (On-chain Metadata)',
        'สิทธิ์เข้าทดสอบระบบ Close-Beta พร้อมร่วมประชุม Product Roadmap ประจำไตรมาสกับทีมนักศึกษา',
        'พื้นที่แสดงโลโก้และบูธประชาสัมพันธ์ในกิจกรรม Onboarding นักศึกษา 500 คนแรกของจุฬาฯ',
        'รับเอกสารสรุปผลวิจัยพฤติกรรมผู้เช่าหอพักและรายงานทางเทคนิคฉบับสมบูรณ์ (Tech Whitepaper)'
      ],
      contractTerms: `ข้อตกลงสนับสนุนเฉพาะโครงการ (Project Sponsorship & Strategic Partnership Agreement)
ทำขึ้นระหว่าง: ทีมพัฒนา CampusRent (ผู้เสนอโครงการ) และ ผู้สนับสนุนผู้ลงนาม (Strategic Partner)

ข้อ 1. วัตถุประสงค์แห่งสัญญา:
ผู้สนับสนุนตกลงมอบเงินทุนสนับสนุนจำนวน 0.25 ETH เพื่อร่วมสนับสนุนการพัฒนาต้นแบบและระบบ Smart Contract Escrow สำหรับการเช่าหอพักนักศึกษา โดยเงินทุนจะถูกนำเข้าสู่ระบบ Escrow Contract ของแพลตฟอร์ม CampusBoost และจะทยอยเบิกจ่ายตามงวดงานจริง (Milestones) 3 งวดที่กำหนดไว้ในใบประกาศ

ข้อ 2. สิทธิประโยชน์และการตอบแทนของผู้สนับสนุน:
(1) สิทธิ์ในการนำซอฟต์แวร์และ Smart Contract Gateway ไปประยุกต์ใช้กับกิจการหอพักหรือธุรกิจของผู้สนับสนุนโดยไม่มีค่าธรรมเนียมใบอนุญาตเป็นเวลา 1 ปี
(2) สิทธิ์ในการได้รับเครดิตถาวรในฐานะ "Co-Founding Innovation Partner" ใน Metadata ของระบบและสื่อประชาสัมพันธ์ทุกช่องทาง
(3) สิทธิ์ในการร่วมเสนอความคิดเห็นและร่วมทดสอบระบบก่อนเผยแพร่สู่สาธารณะ

ข้อ 3. การคุ้มครองเงินทุนผ่าน Smart Contract Escrow:
เงินสนับสนุนจะได้รับการคุ้มครองผ่าน Escrow Smart Contract บนบล็อกเชน จะไม่มีการโอนเข้ากระเป๋าส่วนตัวของนักศึกษาในทันที แต่จะปล่อยเป็นงวดตามหลักฐานความคืบหน้าที่ส่งมอบ หากนักศึกษาไม่สามารถส่งมอบงานได้ตามสัญญา ผู้สนับสนุนมีสิทธิ์ใช้กลไก Dispute & Refund เพื่อรับเงินคืนตามสัดส่วน

ข้อ 4. การรับทราบเงื่อนไข:
สัญญาฉบับนี้เป็นการร่วมสนับสนุนเพื่อสิทธิประโยชน์ทางนวัตกรรมและพันธมิตรเชิงกลยุทธ์ตามเงื่อนไขที่เจ้าของโปรเจกต์กำหนดในใบประกาศ ไม่มีการแบ่งผลตอบแทนทางการเงิน`,
      quota: 3,
      claimedCount: 1,
    },
    milestones: [
      {
        id: 'm1',
        index: 0,
        title: 'Milestone 1: ออกแบบ Figma & UX Journey ครบวงจร',
        description: 'ทำ User Research สัมภาษณ์นักศึกษา 50 คน และส่งมอบไฟล์ Figma Design System ฉบับสมบูรณ์',
        amount: 0.3,
        deadline: '2026-10-25',
        status: MilestoneStatus.Released,
        evidenceURI: 'https://figma.com/@campusrent-demo-prototype',
        evidenceTitle: 'Figma Prototype v1.0 & Interview Synthesis Report',
        submittedAt: '2026-10-10',
      },
      {
        id: 'm2',
        index: 1,
        title: 'Milestone 2: พัฒนา MVP Smart Contract Escrow และ Frontend',
        description: 'ปล่อยเวอร์ชันทดสอบบน Base Sepolia พร้อมฟังก์ชันมัดจำห้องและแสดงผลหอพัก 20 แห่งแรก',
        amount: 0.4,
        deadline: '2026-11-15',
        status: MilestoneStatus.Submitted,
        evidenceURI: 'https://github.com/campusboost/campusrent-mvp',
        evidenceTitle: 'GitHub Repo & Vercel Live Demo Preview',
        submittedAt: '2026-10-14',
      },
      {
        id: 'm3',
        index: 2,
        title: 'Milestone 3: Pilot Launch & ผู้ใช้งานจริง 200 คนแรก',
        description: 'จัดกิจกรรม Onboarding รอบมหาวิทยาลัยและเก็บ Feedback จากผู้ใช้งานจริง',
        amount: 0.3,
        deadline: '2026-11-30',
        status: MilestoneStatus.Pending,
      },
    ],
    backersList: [
      {
        address: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
        amount: 0.25,
        packageId: 99,
        tierName: 'สัญญาร่วมสนับสนุน: Exclusive Strategic Partner',
        timestamp: '2026-10-14 11:05',
        txHash: '0x3d9a1...55bc',
        isCustomAgreement: true,
        agreementTitle: 'สัญญาร่วมสนับสนุนเพื่อการพัฒนาระบบค้ำประกันหอพักและสิทธิ์ Exclusive Strategic Partner',
      },
      {
        address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
        amount: 0.5,
        packageId: 4,
        tierName: 'Title Sponsor',
        timestamp: '2026-10-12 14:22',
        txHash: '0x8f3c7...9102',
      },
      {
        address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
        amount: 0.2,
        packageId: 3,
        tierName: 'Sponsor',
        timestamp: '2026-10-13 09:15',
        txHash: '0x2a1b4...78cd',
      },
      {
        address: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
        amount: 0.05,
        packageId: 2,
        tierName: 'Booster',
        timestamp: '2026-10-14 18:30',
        txHash: '0x7e8f1...34ab',
      },
    ],
  },
  {
    id: 'proj-2',
    onChainId: 2,
    title: 'EcoSort: ถังขยะแยกอัจฉริยะพลัง AI ตรวจจับพลาสติกและอะลูมิเนียมอัตโนมัติ',
    tagline: 'ใช้อุปกรณ์ Edge AI และโมเดล Computer Vision แยกขยะรีไซเคิลพร้อมให้ Token สะสมแต้มสำหรับโรงอาหาร',
    description: `ปัญหาขยะล้นมหาวิทยาลัยเกิดจากการที่คนทิ้งขยะปนกันทำให้ไม่สามารถนำไปรีไซเคิลต่อได้

**EcoSort** พัฒนาฝาถังขยะอัจฉริยะที่ใช้ Raspberry Pi + กล้อง AI ตรวจจับประเภทขยะใน 0.5 วินาที แล้วกลไกเซอร์โวมอเตอร์จะเปิดช่องแยกขยะให้ถูกต้องอัตโนมัติ พร้อมหน้าจอแสดงปริมาณ Carbon Footprint ที่ลดได้ทันที`,
    category: 'Environment',
    ownerAddress: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4df',
    ownerName: 'กานต์ & GreenKU Lab',
    university: 'มหาวิทยาลัยเกษตรศาสตร์',
    coverImage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80',
    goalAmount: 1.5,
    raisedAmount: 1.5,
    deadline: '2026-12-10',
    status: ProjectStatus.Active,
    sponsorsCount: 18,
    featured: true,
    customAgreement: {
      enabled: true,
      title: 'สัญญาร่วมสนับสนุนวิจัยและสิทธิ์นำร่องฮาร์ดแวร์ EcoSort AI Smart Bin',
      amount: 0.4,
      summary: 'ข้อเสนอสัญญาร่วมสนับสนุนจาก GreenKU Lab ในใบประกาศ เพื่อสนับสนุนการผลิตถังขยะอัจฉริยะ 3 จุดแรก พร้อมสิทธิ์รับมอบเครื่องต้นแบบ 1 ชุด และสิทธิ์การเข้าถึง Dataset ขยะ AI',
      perks: [
        'รับมอบถังขยะ EcoSort Smart Bin รุ่นต้นแบบ 1 ชุด นำไปติดตั้งใช้งานในองค์กร',
        'สิทธิ์เข้าถึงชุดข้อมูลภาพขยะ 10,000 ภาพ และโมเดล Edge AI สำหรับต่อยอดภายใน',
        'หนังสือรับรองการสนับสนุน ESG & Carbon Offset จากคณะสิ่งแวดล้อม',
        'ติดป้ายสปอนเซอร์ผู้ร่วมสนับสนุนวิจัยขนาดใหญ่บนตัวถังขยะทุกจุดติดตั้ง'
      ],
      contractTerms: `ข้อตกลงสนับสนุนการวิจัยเทคโนโลยี EcoSort (Project Sponsorship Agreement)
คู่สัญญา: GreenKU Lab (ผู้พัฒนา) และ ผู้สนับสนุนผู้ลงนาม
เงินทุนสนับสนุน 0.4 ETH จะถูกควบคุมด้วยระบบ Milestone Escrow ของแพลตฟอร์ม CampusBoost และจะเบิกจ่ายเมื่อผ่านการตรวจสอบโมเดล AI และการติดตั้งจริงตามเงื่อนไข`,
      quota: 2,
      claimedCount: 0,
    },
    milestones: [
      {
        id: 'm2-1',
        index: 0,
        title: 'Milestone 1: ออกแบบโครงสร้างและ 3D Printing Prototype',
        description: 'ประกอบชุดกลไกคัดแยกและเชื่อมต่อเซนเซอร์น้ำหนัก',
        amount: 0.5,
        deadline: '2026-10-20',
        status: MilestoneStatus.Released,
        evidenceURI: 'https://youtube.com/watch?v=ecosort-proto1',
        evidenceTitle: 'วิดีโอสาธิตกลไกการแยกขยะและผลทดสอบ 3D Print',
        submittedAt: '2026-10-05',
      },
      {
        id: 'm2-2',
        index: 1,
        title: 'Milestone 2: Train โมเดล AI ให้มีความแม่นยำ > 95%',
        description: 'เก็บชุดข้อมูลขยะ 10,000 ภาพ และ deploy โมเดลลง Edge Device',
        amount: 0.5,
        deadline: '2026-11-10',
        status: MilestoneStatus.Approved,
        evidenceURI: 'https://huggingface.co/models/ecosort-ku',
        evidenceTitle: 'Model Benchmark & Confusion Matrix Report',
        submittedAt: '2026-10-13',
      },
      {
        id: 'm2-3',
        index: 2,
        title: 'Milestone 3: ติดตั้งทดสอบจริง 3 จุดในโรงอาหารกลาง',
        description: 'ทดสอบการใช้งานจริง 1 เดือน พร้อมจัดทำรายงานปริมาณขยะที่แยกได้',
        amount: 0.5,
        deadline: '2026-12-10',
        status: MilestoneStatus.Pending,
      },
    ],
  },
  {
    id: 'proj-3',
    onChainId: 3,
    title: 'SignBridge: ถุงมืออัจฉริยะแปลภาษามือเป็นเสียงพูดและข้อความ Real-time',
    tagline: 'ลดช่องว่างการสื่อสารของผู้บกพร่องทางการได้ยินด้วยเทคโนโลยี Flex Sensor และ AI Gesture Recognition',
    description: `โครงการนวัตกรรมเพื่อสังคมที่ช่วยให้ผู้พิการทางการได้ยินสามารถสื่อสารกับบุคคลทั่วไปได้อย่างคล่องแคล่ว โดยตัวถุงมือจะจับท่วงท่าการขยับนิ้วและแปลเป็นเสียงพูดภาษาไทยผ่านแอปพลิเคชันบนมือถือ`,
    category: 'Health',
    ownerAddress: '0x976EA74026E72CD113c5742211516e8FEc9be3F3',
    ownerName: 'นภัสสร & KMITL Assistive Tech',
    university: 'สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง',
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    goalAmount: 0.8,
    raisedAmount: 0.42,
    deadline: '2026-11-20',
    status: ProjectStatus.Active,
    sponsorsCount: 8,
    customAgreement: {
      enabled: true,
      title: 'สัญญาร่วมสนับสนุนเพื่อสังคมและสิทธิ์นวัตกรรม SignBridge Assistive Glove',
      amount: 0.35,
      summary: 'ข้อเสนอสัญญาจาก KMITL Assistive Tech ในใบประกาศ เพื่อสนับสนุนการผลิตถุงมือต้นแบบ พร้อมสิทธิ์นำระบบไปใช้ในศูนย์การเรียนรู้ผู้พิการและสลักชื่อแบรนด์ถาวร',
      perks: [
        'รับมอบถุงมือ SignBridge Prototype รุ่นแรกพร้อมกล่องควบคุม 1 ชุด',
        'สิทธิ์ใช้งานแอปพลิเคชันแปลภาษามือ Real-time API ตลอดชีพ',
        'สลักชื่อองค์กรผู้ร่วมสนับสนุนบนบอร์ด PCB และสายรัดถุงมือ',
        'สิทธิ์นำผลงานไปจัดแสดงในงานนิทรรศการ CSR ขององค์กร'
      ],
      contractTerms: `ข้อตกลงสนับสนุนการพัฒนานวัตกรรม SignBridge (Sponsorship & Social Impact Agreement)
คู่สัญญา: ทีมวิจัย KMITL Assistive Tech และ ผู้สนับสนุนผู้ลงนาม
เงินทุนสนับสนุนจำนวน 0.35 ETH ถูกคุ้มครองใน Escrow Smart Contract และจะถูกปล่อยตามผลงานการทดสอบแผงวงจรและแอปพลิเคชันมือถือ`,
      quota: 2,
      claimedCount: 0,
    },
    milestones: [
      {
        id: 'm3-1',
        index: 0,
        title: 'Milestone 1: ออกแบบวงจรอิเล็กทรอนิกส์และเซนเซอร์ถุงมือ',
        description: 'จัดทำบอร์ด PCB และประกอบเซนเซอร์ Flex + Gyroscope',
        amount: 0.4,
        deadline: '2026-10-30',
        status: MilestoneStatus.Submitted,
        evidenceURI: 'https://signbridge.dev/schematics.pdf',
        evidenceTitle: 'Hardware Schematics & PCB Gerbers',
        submittedAt: '2026-10-14',
      },
      {
        id: 'm3-2',
        index: 1,
        title: 'Milestone 2: แอปพลิเคชันมือถือและการเชื่อมต่อ Bluetooth LE',
        description: 'แอป Android/iOS สำหรับเปล่งเสียงคำศัพท์ 500 คำแรก',
        amount: 0.4,
        deadline: '2026-11-20',
        status: MilestoneStatus.Pending,
      },
    ],
  },
  {
    id: 'proj-4',
    onChainId: 4,
    title: 'EduPrompt: แพลตฟอร์มติวสอบแบบ Adaptive AI สำหรับโรงเรียนในพื้นที่ห่างไกล',
    tagline: 'ระบบปรับระดับโจทย์ข้อสอบตามความถนัดของนักเรียนรายบุคคล ใช้งานได้แม้มีสัญญาณอินเทอร์เน็ตจำกัด',
    description: `การศึกษาที่มีคุณภาพควรเข้าถึงได้ทุกคน EduPrompt พัฒนาขึ้นโดยกลุ่มนักศึกษาคณะครุศาสตร์และไอที เพื่อนำ generative AI มาทำหน้าที่เป็นติวเตอร์ส่วนตัวที่คอยอธิบายวิธีคิดข้อสอบคณิตศาสตร์และวิทยาศาสตร์ทีละสเต็ป`,
    category: 'Education',
    ownerAddress: '0xBcd4042DE499D14e55001CcbB24a551F3b954096',
    ownerName: 'ปัณณวิชญ์ & EduTech Gang',
    university: 'มหาวิทยาลัยเชียงใหม่',
    coverImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    goalAmount: 0.6,
    raisedAmount: 0.6,
    deadline: '2026-12-01',
    status: ProjectStatus.Active,
    sponsorsCount: 15,
    customAgreement: {
      enabled: true,
      title: 'สัญญาร่วมสนับสนุนเพื่อการศึกษาและสิทธิ์ติดตั้งระบบโรงเรียนนำร่อง',
      amount: 0.2,
      summary: 'ข้อเสนอจาก EduTech Gang ในใบประกาศ มอบสิทธิ์การเป็นพันธมิตรโรงเรียนนำร่อง สามารถนำระบบคลังข้อสอบและ Adaptive AI ไปใช้งานในโรงเรียนที่ท่านอุปถัมภ์ฟรีตลอดไป',
      perks: [
        'สิทธิ์ License ใช้งาน EduPrompt ระบบเต็มสำหรับโรงเรียนอุปถัมภ์ 3 แห่งฟรีตลอดไป',
        'ตราประทับ Educational Excellence Partner ในข้อสอบและหน้าแรกของระบบ',
        'แดชบอร์ดสรุปสถิติคะแนนสอบและรายงานผลสัมฤทธิ์ทางการศึกษา'
      ],
      contractTerms: `สัญญาร่วมสนับสนุนเพื่อการศึกษา EduPrompt (Education Sponsorship Agreement)
คู่สัญญา: คณะทำงาน EduTech Gang และ ผู้สนับสนุนผู้ลงนาม
เงินสนับสนุน 0.2 ETH บริหารผ่าน Escrow Smart Contract ตามงวดงานคลังข้อสอบและการทดสอบโรงเรียนนำร่อง`,
      quota: 5,
      claimedCount: 2,
    },
    milestones: [
      {
        id: 'm4-1',
        index: 0,
        title: 'Milestone 1: คลังข้อสอบ 5,000 ข้อพร้อมเฉลยละเอียด',
        description: 'รวบรวมและจัดหมวดหมู่ข้อสอบตามมาตรฐาน สพฐ.',
        amount: 0.3,
        deadline: '2026-11-05',
        status: MilestoneStatus.Approved,
        evidenceURI: 'https://eduprompt.cmu.ac.th/curriculum',
        evidenceTitle: 'Curriculum & Question Bank Verification',
      },
      {
        id: 'm4-2',
        index: 1,
        title: 'Milestone 2: ทดสอบกับโรงเรียนนำร่อง 5 แห่งในภาคเหนือ',
        description: 'ประเมินผลการเรียนรู้ของนักเรียน 300 คน',
        amount: 0.3,
        deadline: '2026-12-01',
        status: MilestoneStatus.Pending,
      },
    ],
  },
];
