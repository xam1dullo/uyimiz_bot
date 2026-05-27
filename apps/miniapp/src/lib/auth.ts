// ─── Mini App Auth ───
import { getToken, refreshToken } from './api';

interface TelegramWebAppUser {
  id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramWebApp {
  initData?: string;
  initDataUnsafe?: {
    user?: TelegramWebAppUser;
  };
}

interface TelegramWindow extends Window {
  Telegram?: {
    WebApp?: TelegramWebApp;
  };
}

function getTelegramWebApp() {
  return (window as TelegramWindow).Telegram?.WebApp;
}

export async function authenticate(): Promise<boolean> {
  try {
    // Get initData from Telegram Mini App SDK
    const WebApp = getTelegramWebApp();
    if (!WebApp?.initData) {
      console.warn('Not running inside Telegram Mini App');
      return false;
    }

    // Try to get token from backend using Telegram initData
    const res = await getToken(WebApp.initData);
    if (res?.accessToken) {
      localStorage.setItem('access_token', res.accessToken);
      localStorage.setItem('refresh_token', res.refreshToken);
      return true;
    }
    
    return false;
  } catch (e) {
    console.error('Auth failed:', e);
    return false;
  }
}

export async function ensureAuth(): Promise<boolean> {
  // Try refresh if we have a stored token
  const stored = localStorage.getItem('refresh_token');
  if (stored) {
    try {
      const res = await refreshToken(stored);
      if (res?.accessToken) {
        localStorage.setItem('access_token', res.accessToken);
        return true;
      }
    } catch {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  return authenticate();
}

export function getTelegramUser() {
  const WebApp = getTelegramWebApp();
  return WebApp?.initDataUnsafe?.user ?? null;
}
