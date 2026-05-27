import { beforeEach, describe, expect, it } from 'vitest';
import { useStore, type FamilyMember } from '../index';

function resetStore() {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  useStore.setState({
    token: null,
    familyId: null,
    familyName: '',
    familyCode: '',
    members: [],
    memberCount: 0,
    theme: 'light',
    language: 'uz',
  });
}

describe('miniapp store', () => {
  beforeEach(() => {
    resetStore();
  });

  it('persists and clears the access token', () => {
    useStore.getState().setToken('access.jwt');

    expect(useStore.getState().token).toBe('access.jwt');
    expect(localStorage.getItem('access_token')).toBe('access.jwt');

    useStore.getState().setToken(null);

    expect(useStore.getState().token).toBeNull();
    expect(localStorage.getItem('access_token')).toBeNull();
  });

  it('persists the active family id while keeping family display data in state', () => {
    useStore.getState().setFamilyId('family-1');
    useStore.getState().setFamily('Karimovlar', 'UZ1234');

    expect(useStore.getState().familyId).toBe('family-1');
    expect(useStore.getState().familyName).toBe('Karimovlar');
    expect(useStore.getState().familyCode).toBe('UZ1234');
    expect(localStorage.getItem('familyId')).toBe('family-1');
  });

  it('derives member count from the visible family members list', () => {
    const members: FamilyMember[] = [
      { id: '1', name: 'Zarina', initials: 'ZI', role: 'admin', points: 18 },
      { id: '2', name: 'Jasur', initials: 'JA', role: 'child', points: 7 },
    ];

    useStore.getState().setMembers(members);

    expect(useStore.getState().members).toEqual(members);
    expect(useStore.getState().memberCount).toBe(2);
  });

  it('toggles theme and mirrors it to localStorage and the document theme', () => {
    useStore.getState().toggleTheme();

    expect(useStore.getState().theme).toBe('dark');
    expect(localStorage.getItem('uyimiz-theme')).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    useStore.getState().toggleTheme();

    expect(useStore.getState().theme).toBe('light');
    expect(localStorage.getItem('uyimiz-theme')).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('persists language changes for the next miniapp session', () => {
    useStore.getState().setLanguage('ru');

    expect(useStore.getState().language).toBe('ru');
    expect(localStorage.getItem('uyimiz-lang')).toBe('ru');
  });
});
