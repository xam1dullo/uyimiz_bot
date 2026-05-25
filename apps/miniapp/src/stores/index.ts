// ─── Zustand: UI State ───
import { create } from 'zustand';

interface UIState {
  activeTab: 'dashboard' | 'budget' | 'tasks' | 'reminders' | 'birthdays';
  setTab: (tab: UIState['activeTab']) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'dashboard',
  setTab: (tab) => set({ activeTab: tab }),
}));

// ─── Family Context ───
interface FamilyState {
  familyId: string | null;
  familyName: string | null;
  role: string | null;
  setFamily: (id: string, name: string, role: string) => void;
  clearFamily: () => void;
}

export const useFamilyStore = create<FamilyState>((set) => ({
  familyId: null,
  familyName: null,
  role: null,
  setFamily: (id, name, role) => set({ familyId: id, familyName: name, role }),
  clearFamily: () => set({ familyId: null, familyName: null, role: null }),
}));
