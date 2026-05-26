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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseStoredFamilyContext(value: string | null): StoredFamilyContext {
  if (!value) {
    return {};
  }

  const parsed: unknown = JSON.parse(value);

  if (!isRecord(parsed)) {
    return {};
  }

  return typeof parsed.familyId === 'string' ? { familyId: parsed.familyId } : {};
}

function getTelegramWebApp(): TelegramWebApp | null {
  return (window as Window & TelegramWindow).Telegram?.WebApp ?? null;
}

export function useTelegramUser(): TelegramUser | null {
  return getTelegramWebApp()?.initDataUnsafe?.user ?? null;
}

export function useFamilyId(): string | null {
  try {
    const stored = parseStoredFamilyContext(localStorage.getItem('family_context'));
    return stored.familyId ?? null;
  } catch {
    return null;
  }
}
