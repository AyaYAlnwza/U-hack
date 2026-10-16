'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, ProjectStatus, MilestoneStatus, DirectiveStatus, SponsorCampDirective } from '@/types/campusboost';
import { INITIAL_PROJECTS, SPONSOR_PACKAGES } from '@/lib/constants';
import confetti from 'canvas-confetti';

export type UserRole = 'student' | 'sponsor' | 'admin' | 'backer';

interface WalletAccount {
  address: string;
  name: string;
  role: UserRole;
  balance: number; // in ETH
  avatar: string;
}

export const DEMO_ACCOUNTS: Record<UserRole, WalletAccount> = {
  student: {
    address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    name: 'ธนกฤต (Student Lead)',
    role: 'student',
    balance: 1.25,
    avatar: '👨‍🎓',
  },
  sponsor: {
    address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    name: 'SCB 10X Ventures / Brand Sponsor',
    role: 'sponsor',
    balance: 50.0,
    avatar: '🏢',
  },
  admin: {
    address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    name: 'University Innovation Hub (Admin)',
    role: 'admin',
    balance: 100.0,
    avatar: '🏛️',
  },
  backer: {
    address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    name: 'ณิชาภัทร (Community Backer)',
    role: 'backer',
    balance: 5.4,
    avatar: '🚀',
  },
};

interface Web3ContextType {
  account: WalletAccount;
  isConnected: boolean;
  switchRole: (role: UserRole) => void;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  projects: Project[];
  supportProject: (
    projectId: string,
    packageId: number,
    customAmount?: number,
    options?: {
      isCustomAgreement?: boolean;
      agreementTitle?: string;
    }
  ) => Promise<boolean>;
  submitMilestoneEvidence: (projectId: string, milestoneIndex: number, evidenceURI: string, evidenceTitle: string) => Promise<boolean>;
  approveMilestone: (projectId: string, milestoneIndex: number) => Promise<boolean>;
  releaseMilestoneFunds: (projectId: string, milestoneIndex: number) => Promise<boolean>;
  approveProjectAdmin: (projectId: string) => Promise<boolean>;
  openDispute: (projectId: string, milestoneIndex: number, reason: string) => Promise<boolean>;
  resolveDispute: (projectId: string, milestoneIndex: number, releaseFunds: boolean) => Promise<boolean>;
  submitCampDirective: (
    projectId: string,
    directiveData: {
      amountTHB: number;
      title: string;
      directionRequest: string;
      expectedOutcomes: string;
      sponsorPerksOffered?: string;
    }
  ) => Promise<boolean>;
  respondToCampDirective: (
    projectId: string,
    directiveId: string,
    action: 'accept' | 'decline',
    responseNote?: string
  ) => Promise<boolean>;
  createNewProject: (newProjectData: Partial<Project>) => Promise<string>;
  resetToDefault: () => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

const STORAGE_KEY = 'campusboost_projects_v3';

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [account, setAccount] = useState<WalletAccount>(DEMO_ACCOUNTS['student']);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setProjects(JSON.parse(saved));
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS));
      }
    } catch {
      setProjects(INITIAL_PROJECTS);
    }
  }, []);

  const saveProjects = (updatedProjects: Project[]) => {
    setProjects(updatedProjects);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects));
    } catch {
      // LocalStorage error fallback
    }
  };

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    setAccount(DEMO_ACCOUNTS[role]);
    setIsConnected(true);
  };

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && (window as unknown as { ethereum?: unknown }).ethereum) {
      try {
        const eth = (window as unknown as { ethereum: { request: (args: { method: string }) => Promise<string[]> } }).ethereum;
        const accounts = await eth.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts[0]) {
          setAccount({
            address: accounts[0],
            name: `${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
            role: currentRole,
            balance: 10.0,
            avatar: '🦊',
          });
          setIsConnected(true);
          return;
        }
      } catch (e) {
        console.warn("Wallet connect failed, fallback to simulator", e);
      }
    }
    // Fallback
    setIsConnected(true);
  };

  const disconnectWallet = () => {
    setIsConnected(false);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'],
      });
    } catch {
      // ignore
    }
  };

  // Support Project
  const supportProject = async (
    projectId: string,
    packageId: number,
    customAmount?: number,
    options?: {
      isCustomAgreement?: boolean;
      agreementTitle?: string;
    }
  ): Promise<boolean> => {
    const pkg = SPONSOR_PACKAGES.find((p) => p.id === packageId);
    const amount = customAmount || pkg?.minAmount || 0.05;
    const isCustom = options?.isCustomAgreement || packageId === 99;
    const tierName = isCustom
      ? (options?.agreementTitle ? `สัญญาร่วมสนับสนุน: ${options.agreementTitle}` : 'สัญญาร่วมสนับสนุนเฉพาะโครงการ')
      : (pkg?.name || 'Supporter');

    const updated = projects.map((p) => {
      if (p.id === projectId) {
        const newRaised = +(p.raisedAmount + amount).toFixed(4);
        const newBacker = {
          address: account.address,
          amount,
          packageId,
          tierName,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          txHash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
          isCustomAgreement: isCustom,
          agreementTitle: options?.agreementTitle || p.customAgreement?.title,
        };

        let updatedAgreement = p.customAgreement;
        if (isCustom && updatedAgreement) {
          updatedAgreement = {
            ...updatedAgreement,
            claimedCount: (updatedAgreement.claimedCount || 0) + 1,
          };
        }

        return {
          ...p,
          raisedAmount: newRaised,
          sponsorsCount: p.sponsorsCount + 1,
          customAgreement: updatedAgreement,
          backersList: [newBacker, ...(p.backersList || [])],
        };
      }
      return p;
    });

    saveProjects(updated);
    triggerConfetti();
    return true;
  };

  // Submit Milestone Evidence
  const submitMilestoneEvidence = async (
    projectId: string,
    milestoneIndex: number,
    evidenceURI: string,
    evidenceTitle: string
  ): Promise<boolean> => {
    if (projects.find((p) => p.id === projectId)?.isCampProject || projects.find((p) => p.id === projectId)?.category === 'Camp') return false;
    const updated = projects.map((p) => {
      if (p.id === projectId) {
        const updatedMilestones = p.milestones.map((m, idx) => {
          if (idx === milestoneIndex) {
            return {
              ...m,
              status: MilestoneStatus.Submitted,
              evidenceURI,
              evidenceTitle,
              submittedAt: new Date().toISOString().slice(0, 10),
            };
          }
          return m;
        });
        return { ...p, milestones: updatedMilestones };
      }
      return p;
    });

    saveProjects(updated);
    return true;
  };

  // Approve Milestone
  const approveMilestone = async (projectId: string, milestoneIndex: number): Promise<boolean> => {
    if (projects.find((p) => p.id === projectId)?.isCampProject || projects.find((p) => p.id === projectId)?.category === 'Camp') return false;
    const updated = projects.map((p) => {
      if (p.id === projectId) {
        const updatedMilestones = p.milestones.map((m, idx) => {
          if (idx === milestoneIndex) {
            return {
              ...m,
              status: MilestoneStatus.Approved,
            };
          }
          return m;
        });
        return { ...p, milestones: updatedMilestones };
      }
      return p;
    });

    saveProjects(updated);
    return true;
  };

  // Release Milestone Funds
  const releaseMilestoneFunds = async (projectId: string, milestoneIndex: number): Promise<boolean> => {
    const target = projects.find((p) => p.id === projectId);
    if (!target || target.isCampProject || target.category === 'Camp' || target.milestones[milestoneIndex]?.status !== MilestoneStatus.Approved) return false;
    const updated = projects.map((p) => {
      if (p.id === projectId) {
        const updatedMilestones = p.milestones.map((m, idx) => {
          if (idx === milestoneIndex) {
            return {
              ...m,
              status: MilestoneStatus.Released,
            };
          }
          return m;
        });

        const allReleased = updatedMilestones.every((m) => m.status === MilestoneStatus.Released);

        return {
          ...p,
          milestones: updatedMilestones,
          status: allReleased ? ProjectStatus.Completed : p.status,
        };
      }
      return p;
    });

    saveProjects(updated);
    triggerConfetti();
    return true;
  };

  // Approve Project (Admin)
  const approveProjectAdmin = async (projectId: string): Promise<boolean> => {
    const updated = projects.map((p) => {
      if (p.id === projectId) {
        return { ...p, status: ProjectStatus.Active };
      }
      return p;
    });
    saveProjects(updated);
    return true;
  };

  // Open Dispute
  const openDispute = async (projectId: string, milestoneIndex: number, reason: string): Promise<boolean> => {
    const updated = projects.map((p) => {
      if (p.id === projectId) {
        return { ...p, status: ProjectStatus.Disputed };
      }
      return p;
    });
    saveProjects(updated);
    return true;
  };

  // Resolve Dispute
  const resolveDispute = async (projectId: string, milestoneIndex: number, releaseFunds: boolean): Promise<boolean> => {
    const updated = projects.map((p) => {
      if (p.id === projectId) {
        if (releaseFunds) {
          const updatedMilestones = p.milestones.map((m, idx) => {
            if (idx === milestoneIndex) {
              return { ...m, status: MilestoneStatus.Released };
            }
            return m;
          });
          return { ...p, status: ProjectStatus.Active, milestones: updatedMilestones };
        } else {
          return { ...p, status: ProjectStatus.Cancelled };
        }
      }
      return p;
    });
    saveProjects(updated);
    return true;
  };

  // Submit Camp Directive from Sponsor
  const submitCampDirective = async (
    projectId: string,
    directiveData: {
      amountTHB: number;
      title: string;
      directionRequest: string;
      expectedOutcomes: string;
      sponsorPerksOffered?: string;
    }
  ): Promise<boolean> => {
    if (!Number.isSafeInteger(directiveData.amountTHB) || directiveData.amountTHB < 1) return false;
    if (!projects.some((p) => p.id === projectId && (p.isCampProject || p.category === 'Camp') && p.status === ProjectStatus.Active)) return false;
    const newDirective: SponsorCampDirective = {
      id: `dir-${Date.now()}`,
      sponsorAddress: account.address,
      sponsorName: account.name,
      sponsorAvatar: account.avatar,
      amount: 0,
      amountTHB: directiveData.amountTHB,
      title: directiveData.title,
      directionRequest: directiveData.directionRequest,
      expectedOutcomes: directiveData.expectedOutcomes,
      sponsorPerksOffered: directiveData.sponsorPerksOffered,
      status: DirectiveStatus.Pending,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    const updated = projects.map((p) => {
      if (p.id === projectId) {
        return {
          ...p,
          campDirectives: [newDirective, ...(p.campDirectives || [])],
        };
      }
      return p;
    });

    saveProjects(updated);
    triggerConfetti();
    return true;
  };

  // Respond to Camp Directive (Student/Organizer accepts or declines)
  const respondToCampDirective = async (
    projectId: string,
    directiveId: string,
    action: 'accept' | 'decline',
    responseNote?: string
  ): Promise<boolean> => {
    const updated = projects.map((p) => {
      if (p.id === projectId) {
        const targetDir = p.campDirectives?.find((d) => d.id === directiveId);
        if (!targetDir || targetDir.status !== DirectiveStatus.Pending) return p;

        const isAccept = action === 'accept';
        const updatedDirectives = (p.campDirectives || []).map((d) => {
          if (d.id === directiveId) {
            return {
              ...d,
              status: isAccept ? DirectiveStatus.Accepted : DirectiveStatus.Declined,
              reviewedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
              responseNote:
                responseNote ||
                (isAccept
                  ? 'ทีมงานผู้จัดค่ายยินดีตอบรับคำขอนี้ และนำเข้าสู่กำหนดการกิจกรรมค่ายเรียบร้อยครับ'
                  : 'ทีมงานต้องขออภัยที่ไม่สามารถจัดทำตามเงื่อนไขนี้ได้เนื่องจากข้อจำกัดด้านเวลาและทรัพยากร'),
            };
          }
          return d;
        });

        if (isAccept) {
          const newBacker = {
            address: targetDir.sponsorAddress,
            amount: targetDir.amount,
            amountTHB: targetDir.amountTHB ?? Math.round(targetDir.amount * 120000),
            packageId: 4,
            tierName: 'Directive Sponsor (คำขอทิศทาง)',
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
            txHash: targetDir.txHash,
            isDirective: true,
            directiveTitle: targetDir.title,
          };

          return {
            ...p,
            campRaisedTHB: (p.campRaisedTHB ?? Math.round(p.raisedAmount * 120000)) + (targetDir.amountTHB ?? Math.round(targetDir.amount * 120000)),
            sponsorsCount: p.sponsorsCount + 1,
            campDirectives: updatedDirectives,
            backersList: [newBacker, ...(p.backersList || [])],
          };
        } else {
          return {
            ...p,
            campDirectives: updatedDirectives,
          };
        }
      }
      return p;
    });

    saveProjects(updated);
    if (action === 'accept') {
      triggerConfetti();
    }
    return true;
  };

  // Create Project
  const createNewProject = async (newProjectData: Partial<Project>): Promise<string> => {
    const newId = `proj-${Date.now()}`;
    const fullProject: Project = {
      id: newId,
      creatorProfileId: newProjectData.creatorProfileId,
      onChainId: projects.length + 1,
      title: newProjectData.title || 'Untitled Project',
      tagline: newProjectData.tagline || '',
      description: newProjectData.description || '',
      category: newProjectData.category || 'AI',
      ownerAddress: account.address,
      ownerName: newProjectData.ownerName || account.name,
      university: newProjectData.university || 'สถาบันการศึกษา',
      coverImage: newProjectData.coverImage || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
      goalAmount: newProjectData.isCampProject ? 0 : (Number(newProjectData.goalAmount) || 1.0),
      raisedAmount: 0,
      campGoalTHB: newProjectData.campGoalTHB,
      campRaisedTHB: newProjectData.isCampProject ? 0 : undefined,
      deadline: newProjectData.deadline || '2026-12-31',
      status: ProjectStatus.PendingReview, // Need admin approval
      milestones: newProjectData.milestones || [],
      sponsorsCount: 0,
      isCampProject: newProjectData.isCampProject || newProjectData.category === 'Camp',
      campDetails: newProjectData.campDetails,
      campDirectives: newProjectData.campDirectives || [],
      customAgreement: newProjectData.customAgreement,
      backersList: [],
    };

    saveProjects([fullProject, ...projects]);
    return newId;
  };

  const resetToDefault = () => {
    setProjects(INITIAL_PROJECTS);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS));
    } catch {
      // ignore
    }
  };

  return (
    <Web3Context.Provider
      value={{
        account,
        isConnected,
        switchRole,
        connectWallet,
        disconnectWallet,
        projects,
        supportProject,
        submitMilestoneEvidence,
        approveMilestone,
        releaseMilestoneFunds,
        approveProjectAdmin,
        openDispute,
        resolveDispute,
        submitCampDirective,
        respondToCampDirective,
        createNewProject,
        resetToDefault,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}
