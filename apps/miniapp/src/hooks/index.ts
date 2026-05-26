interface TelegramUser {
  id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramWebApp {
  initDataUnsafe?: {
    user?: TelegramUser;
  };
}

interface TelegramWindow {
  Telegram?: {
    WebApp?: TelegramWebApp;
  };
}

interface StoredFamilyContext {
  familyId?: string;
}

function getTelegramWebApp() {
  return (window as Window & TelegramWindow).Telegram?.WebApp ?? null;
}

export function useTelegramUser() {
  return getTelegramWebApp()?.initDataUnsafe?.user ?? null;
}

export function useFamilyId(): string | null {
  try {
    const stored = JSON.parse(localStorage.getItem('family_context') ?? '{}') as StoredFamilyContext;
    return stored.familyId ?? null;
  } catch {
    return null;
  }
}
