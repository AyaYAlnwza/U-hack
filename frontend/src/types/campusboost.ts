export enum ProjectStatus {
  Draft = 0,
  PendingReview = 1,
  Active = 2,
  Completed = 3,
  Cancelled = 4,
  Disputed = 5,
}

export enum MilestoneStatus {
  Pending = 0,
  Submitted = 1,
  Approved = 2,
  Rejected = 3,
  Released = 4,
}

export interface Milestone {
  id: string;
  index: number;
  title: string;
  description: string;
  amount: number; // in ETH or USD
  deadline: string;
  status: MilestoneStatus;
  evidenceURI?: string;
  evidenceTitle?: string;
  submittedAt?: string;
}

export interface SponsorPerk {
  id: number;
  name: string;
  minAmount: number;
  description: string;
  perks: string[];
  badgeColor: string;
  popular?: boolean;
}

export enum DirectiveStatus {
  Pending = 'pending',
  Accepted = 'accepted',
  Declined = 'declined',
}

export interface SponsorCampDirective {
  id: string;
  sponsorAddress: string;
  sponsorName: string;
  sponsorAvatar?: string;
  amount: number; // in ETH
  amountTHB?: number; // demo pledge in Thai baht; no payment is processed
  title: string; // เช่น "ขอเพิ่ม Track AI & Data Analytics"
  directionRequest: string; // คำขอทิศทางการจัดกิจกรรมค่าย
  expectedOutcomes: string; // ผลลัพธ์หรือผลสัมฤทธิ์ที่คาดหวังให้เกิดขึ้นกับเยาวชน
  sponsorPerksOffered?: string; // สิ่งที่สปอนเซอร์จะสนับสนุนเพิ่มเติม (เช่น วิทยากร, ของรางวัล, Cloud Credits)
  status: DirectiveStatus;
  createdAt: string;
  reviewedAt?: string;
  responseNote?: string; // คำชี้แจง/การตอบรับจากทีมผู้จัดค่าย
  txHash?: string;
}

export interface CampDetails {
  targetAudience: string; // กลุ่มเป้าหมาย เช่น "นักเรียนมัธยมปลายและนิสิตนักศึกษา 120 คน"
  duration: string; // ระยะเวลา เช่น "3 วัน 2 คืน (15-17 พ.ย. 2026)"
  location: string; // สถานที่จัด เช่น "คณะวิศวกรรมศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย"
  openForDirectives: boolean; // เปิดรับคำขอทิศทางจากสปอนเซอร์
}

export interface ProjectCustomAgreement {
  enabled: boolean;
  title: string;
  amount: number; // in ETH
  summary: string;
  perks: string[];
  contractTerms: string;
  quota?: number;
  claimedCount?: number;
}

export interface Project {
  id: string;
  creatorProfileId?: string;
  onChainId?: number;
  title: string;
  tagline: string;
  description: string;
  category: 'AI' | 'Environment' | 'Health' | 'Education' | 'Community' | 'Camp';
  ownerAddress: string;
  ownerName: string;
  ownerAvatar?: string;
  university: string;
  coverImage: string;
  goalAmount: number;
  raisedAmount: number;
  campGoalTHB?: number;
  campRaisedTHB?: number;
  deadline: string;
  status: ProjectStatus;
  milestones: Milestone[];
  sponsorsCount: number;
  featured?: boolean;
  isCampProject?: boolean;
  campDetails?: CampDetails;
  campDirectives?: SponsorCampDirective[];
  customAgreement?: ProjectCustomAgreement;
  backersList?: {
    address: string;
    amount: number;
    amountTHB?: number;
    packageId: number;
    tierName: string;
    timestamp: string;
    txHash?: string;
    isCustomAgreement?: boolean;
    agreementTitle?: string;
    isDirective?: boolean;
    directiveTitle?: string;
  }[];
  updates?: {
    id: string;
    title: string;
    content: string;
    date: string;
  }[];
}

export interface PlatformStat {
  totalFunded: number;
  activeProjects: number;
  completedProjects: number;
  totalSponsors: number;
}
