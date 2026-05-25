// ─── Telegram User Hook ───
export function useTelegramUser() {
  try {
    const wp = (window as any).Telegram?.WebApp;
    return wp?.initDataUnsafe?.user ?? null;
  } catch {
    return null;
  }
}

export function useFamilyId(): string | null {
  const { familyId } = (() => {
    try { return JSON.parse(localStorage.getItem('family_context') ?? '{}'); } catch { return {}; }
  })();
  return familyId ?? null;
}
