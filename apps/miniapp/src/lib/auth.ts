// ─── Auth: initData → JWT exchange ───
import { apiClient } from './api';

export async function authenticate(): Promise<string | null> {
  const stored = localStorage.getItem('access_token');
  if (stored) return stored;

  try {
    // In Telegram Mini App, initData is injected by Telegram
    const wp = (window as any).Telegram?.WebApp;
    if (!wp?.initData) return null;

    const { data } = await apiClient.post('/auth/telegram', { initData: wp.initData });
    if (data?.access_token) {
      localStorage.setItem('access_token', data.access_token);
      if (data.refresh_token) localStorage.setItem('refresh_token', data.refresh_token);
      return data.access_token;
    }
    return null;
  } catch {
    return null;
  }
}

export function getStoredToken(): string | null {
  return localStorage.getItem('access_token');
}

export function clearAuth(): void {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}
