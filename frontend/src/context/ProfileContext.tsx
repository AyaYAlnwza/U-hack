'use client';

import { createContext, useContext, useSyncExternalStore } from 'react';
import type { ProfileTheme, SubscriptionLevel } from '@/types/subscription';

export type InstitutionType = 'university' | 'school';

export interface UserProfile {
  fullName: string;
  displayName: string;
  institutionType: InstitutionType;
  institution: string;
  fieldOfStudy: string;
  yearLevel: string;
  interests: string[];
  skills: string[];
  bio: string;
  achievements: string;
  portfolioUrl: string;
  githubUrl: string;
}

export const EMPTY_PROFILE: UserProfile = {
  fullName: '',
  displayName: '',
  institutionType: 'university',
  institution: '',
  fieldOfStudy: '',
  yearLevel: '',
  interests: [],
  skills: [],
  bio: '',
  achievements: '',
  portfolioUrl: '',
  githubUrl: '',
};

interface ProfileContextValue {
  ready: boolean;
  isLoggedIn: boolean;
  profile: UserProfile;
  profileId: string;
  subscriptionLevel: SubscriptionLevel;
  profileTheme: ProfileTheme;
  profileHeadline: string;
  loginDemo: () => void;
  logoutDemo: () => void;
  saveProfile: (profile: UserProfile) => void;
  ensureProfileId: () => string;
  changeSubscription: (level: SubscriptionLevel) => Promise<void>;
  saveAppearance: (theme: ProfileTheme, headline: string) => void;
}

const STORAGE_KEY = 'campusboost_thaid_demo_v1';
const CHANGE_EVENT = 'campusboost-profile-change';
let memorySnapshot = '';
const ProfileContext = createContext<ProfileContextValue | null>(null);

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function getSnapshot() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? memorySnapshot;
  } catch {
    return memorySnapshot;
  }
}

function getServerSnapshot() {
  return null;
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = snapshot !== null;
  let isLoggedIn = false;
  let profile = EMPTY_PROFILE;
  let profileId = '';
  let subscriptionLevel: SubscriptionLevel = 0;
  let profileTheme: ProfileTheme = 'classic';
  let profileHeadline = '';
  if (snapshot) {
    try {
      const data = JSON.parse(snapshot) as { isLoggedIn?: boolean; profile?: Partial<UserProfile>; profileId?: string; subscriptionLevel?: number; profileTheme?: string; profileHeadline?: string };
      isLoggedIn = data.isLoggedIn === true;
      profileId = typeof data.profileId === 'string' ? data.profileId : '';
      subscriptionLevel = data.subscriptionLevel === 1 || data.subscriptionLevel === 2 ? data.subscriptionLevel : 0;
      profileTheme = data.profileTheme === 'sky' || data.profileTheme === 'indigo' ? data.profileTheme : 'classic';
      profileHeadline = typeof data.profileHeadline === 'string' ? data.profileHeadline : '';
      if (data.profile && typeof data.profile === 'object') {
        profile = {
          ...EMPTY_PROFILE,
          ...data.profile,
          interests: Array.isArray(data.profile.interests) ? data.profile.interests : [],
          skills: Array.isArray(data.profile.skills) ? data.profile.skills : [],
        };
      }
    } catch {
      // Ignore malformed demo data.
    }
  }

  const persist = (loggedIn: boolean, nextProfile: UserProfile, nextProfileId = profileId, nextLevel = subscriptionLevel, nextTheme = profileTheme, nextHeadline = profileHeadline) => {
    memorySnapshot = JSON.stringify({ isLoggedIn: loggedIn, profile: nextProfile, profileId: nextProfileId, subscriptionLevel: nextLevel, profileTheme: nextTheme, profileHeadline: nextHeadline });
    try {
      localStorage.setItem(STORAGE_KEY, memorySnapshot);
    } catch {
      // Keep the current tab usable when browser storage is unavailable.
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  const loginDemo = () => {
    persist(true, profile, profileId || crypto.randomUUID());
  };

  const logoutDemo = () => {
    persist(false, profile);
  };

  const saveProfile = (nextProfile: UserProfile) => {
    persist(isLoggedIn, nextProfile);
  };

  const ensureProfileId = () => {
    if (profileId) return profileId;
    const nextProfileId = crypto.randomUUID();
    persist(isLoggedIn, profile, nextProfileId);
    return nextProfileId;
  };

  const changeSubscription = async (level: SubscriptionLevel) => {
    if (!isLoggedIn) throw new Error('กรุณาเข้าสู่ระบบเดโมก่อน');
    const id = ensureProfileId();
    const response = await fetch('/api/subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: id, level }),
    });
    if (!response.ok) throw new Error('เปลี่ยนระดับสมาชิกไม่สำเร็จ');
    persist(true, profile, id, level);
  };

  const saveAppearance = (theme: ProfileTheme, headline: string) => {
    if (!isLoggedIn || subscriptionLevel !== 2) return;
    persist(true, profile, profileId, subscriptionLevel, theme, headline.trim().slice(0, 80));
  };

  return (
    <ProfileContext.Provider value={{ ready, isLoggedIn, profile, profileId, subscriptionLevel, profileTheme, profileHeadline, loginDemo, logoutDemo, saveProfile, ensureProfileId, changeSubscription, saveAppearance }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('useProfile must be used within ProfileProvider');
  return context;
}
