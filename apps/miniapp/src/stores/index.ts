// ─── Mini App Store (Zustand) ───
import { create } from 'zustand';

export interface FamilyMember {
  id: string; name: string; initials: string; role: 'owner' | 'admin' | 'member' | 'child';
  points: number; email?: string;
}

interface AppState {
  // Auth
  token: string | null;
  familyId: string | null;
  
  // Family
  familyName: string;
  familyCode: string;
  members: FamilyMember[];
  memberCount: number;

  // UI
  theme: 'light' | 'dark';
  language: 'uz' | 'ru' | 'en';

  // Actions
  setToken: (t: string | null) => void;
  setFamilyId: (id: string) => void;
  setFamily: (name: string, code: string) => void;
  setMembers: (m: FamilyMember[]) => void;
  toggleTheme: () => void;
  setLanguage: (l: 'uz' | 'ru' | 'en') => void;
}

export const useStore = create<AppState>((set) => ({
  token: localStorage.getItem('access_token'),
  familyId: localStorage.getItem('familyId'),
  familyName: '',
  familyCode: '',
  members: [],
  memberCount: 0,
  theme: (localStorage.getItem('uyimiz-theme') as AppState['theme']) ?? 'light',
  language: (localStorage.getItem('uyimiz-lang') as AppState['language']) ?? 'uz',

  setToken: (token) => {
    if (token) localStorage.setItem('access_token', token);
    else localStorage.removeItem('access_token');
    set({ token });
  },
  setFamilyId: (id) => { localStorage.setItem('familyId', id); set({ familyId: id }); },
  setFamily: (familyName, familyCode) => set({ familyName, familyCode }),
  setMembers: (members) => set({ members, memberCount: members.length }),
  toggleTheme: () => set((s) => {
    const next = s.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('uyimiz-theme', next);
    document.documentElement.setAttribute('data-theme', next);
    return { theme: next };
  }),
  setLanguage: (language) => {
    localStorage.setItem('uyimiz-lang', language);
    set({ language });
  },
}));
