import { useStore } from '../stores';

export function useFamilyId() {
  return useStore((s) => s.familyId) ?? localStorage.getItem('familyId') ?? 'unknown';
}

export function useTheme() {
  return useStore((s) => s.theme);
}
