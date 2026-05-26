import { useEffect, useMemo, type CSSProperties } from 'react';
import {
  bindThemeParamsCssVars,
  hapticFeedbackImpactOccurred,
  hapticFeedbackNotificationOccurred,
  hapticFeedbackSelectionChanged,
  isThemeParamsCssVarsBound,
  isThemeParamsDark,
  isThemeParamsMounted,
  mountThemeParamsSync,
  themeParamsBackgroundColor,
  themeParamsButtonColor,
  themeParamsButtonTextColor,
  themeParamsHintColor,
  themeParamsSecondaryBackgroundColor,
  themeParamsSectionBackgroundColor,
  themeParamsSectionSeparatorColor,
  themeParamsSubtitleTextColor,
  themeParamsTextColor,
  useSignal,
  type ImpactHapticFeedbackStyle,
  type NotificationHapticFeedbackType,
} from '@telegram-apps/sdk-react';

export type ThemeStyle = CSSProperties & Record<`--${string}`, string | undefined>;

export function useTelegramThemeStyle(): ThemeStyle {
  useEffect(() => {
    let cleanup: VoidFunction | undefined;

    try {
      if (mountThemeParamsSync.isAvailable() && !isThemeParamsMounted()) {
        mountThemeParamsSync();
      }

      if (bindThemeParamsCssVars.isAvailable() && !isThemeParamsCssVarsBound()) {
        cleanup = bindThemeParamsCssVars();
      }
    } catch {
      cleanup = undefined;
    }

    return () => cleanup?.();
  }, []);

  const isDark = useSignal(isThemeParamsDark);
  const bgColor = useSignal(themeParamsBackgroundColor);
  const surfaceColor = useSignal(themeParamsSectionBackgroundColor);
  const secondaryBgColor = useSignal(themeParamsSecondaryBackgroundColor);
  const textColor = useSignal(themeParamsTextColor);
  const mutedColor = useSignal(themeParamsHintColor);
  const subtitleColor = useSignal(themeParamsSubtitleTextColor);
  const lineColor = useSignal(themeParamsSectionSeparatorColor);
  const buttonColor = useSignal(themeParamsButtonColor);
  const buttonTextColor = useSignal(themeParamsButtonTextColor);

  return useMemo(
    () => ({
      '--tg-theme-bg-color': bgColor,
      '--tg-theme-section-bg-color': surfaceColor,
      '--tg-theme-secondary-bg-color': secondaryBgColor,
      '--tg-theme-text-color': textColor,
      '--tg-theme-hint-color': mutedColor,
      '--tg-theme-subtitle-text-color': subtitleColor,
      '--tg-theme-section-separator-color': lineColor,
      '--tg-theme-button-color': buttonColor,
      '--tg-theme-button-text-color': buttonTextColor,
      colorScheme: isDark ? 'dark' : 'light',
    }),
    [
      bgColor,
      buttonColor,
      buttonTextColor,
      isDark,
      lineColor,
      mutedColor,
      secondaryBgColor,
      subtitleColor,
      surfaceColor,
      textColor,
    ],
  );
}

export function triggerImpact(style: ImpactHapticFeedbackStyle = 'light') {
  try {
    if (hapticFeedbackImpactOccurred.isAvailable()) {
      hapticFeedbackImpactOccurred(style);
    }
  } catch {
    // Telegram haptics are progressive enhancement outside the Mini App shell.
  }
}

export function triggerSelection() {
  try {
    if (hapticFeedbackSelectionChanged.isAvailable()) {
      hapticFeedbackSelectionChanged();
    }
  } catch {
    // Telegram haptics are progressive enhancement outside the Mini App shell.
  }
}

export function triggerNotification(type: NotificationHapticFeedbackType) {
  try {
    if (hapticFeedbackNotificationOccurred.isAvailable()) {
      hapticFeedbackNotificationOccurred(type);
    }
  } catch {
    // Telegram haptics are progressive enhancement outside the Mini App shell.
  }
}
