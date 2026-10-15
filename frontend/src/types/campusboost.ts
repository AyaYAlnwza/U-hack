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

export interface Project {
  id: string;
  onChainId?: number;
  title: string;
  tagline: string;
  description: string;
  category: 'AI' | 'Environment' | 'Health' | 'Education' | 'Community';
  ownerAddress: string;
  ownerName: string;
  ownerAvatar?: string;
  university: string;
  coverImage: string;
  goalAmount: number;
  raisedAmount: number;
  deadline: string;
  status: ProjectStatus;
  milestones: Milestone[];
  sponsorsCount: number;
  featured?: boolean;
  backersList?: {
    address: string;
    amount: number;
    packageId: number;
    tierName: string;
    timestamp: string;
    txHash?: string;
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
