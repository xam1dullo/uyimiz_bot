import { useEffect, useMemo, type CSSProperties } from 'react';
import {
  bindMiniAppCssVars,
  bindThemeParamsCssVars,
  bindViewportCssVars,
  expandViewport,
  hapticFeedbackImpactOccurred,
  hapticFeedbackNotificationOccurred,
  hapticFeedbackSelectionChanged,
  hideBackButton,
  init,
  isBackButtonMounted,
  isBackButtonSupported,
  isMiniAppCssVarsBound,
  isMiniAppMounted,
  isThemeParamsCssVarsBound,
  isThemeParamsDark,
  isThemeParamsMounted,
  isViewportCssVarsBound,
  isViewportMounted,
  isViewportMounting,
  miniAppReady,
  mountBackButton,
  mountMiniAppSync,
  mountThemeParamsSync,
  mountViewport,
  onBackButtonClick,
  retrieveRawInitData,
  showBackButton,
  themeParamsBackgroundColor,
  themeParamsBottomBarBgColor,
  themeParamsButtonColor,
  themeParamsButtonTextColor,
  themeParamsDestructiveTextColor,
  themeParamsHintColor,
  themeParamsLinkColor,
  themeParamsSecondaryBackgroundColor,
  themeParamsSectionBackgroundColor,
  themeParamsSectionSeparatorColor,
  themeParamsSubtitleTextColor,
  themeParamsTextColor,
  useSignal,
  viewportContentSafeAreaInsetBottom,
  viewportContentSafeAreaInsetLeft,
  viewportContentSafeAreaInsetRight,
  viewportContentSafeAreaInsetTop,
  viewportHeight,
  viewportSafeAreaInsetBottom,
  viewportSafeAreaInsetLeft,
  viewportSafeAreaInsetRight,
  viewportSafeAreaInsetTop,
  viewportStableHeight,
  viewportWidth,
  type ImpactHapticFeedbackStyle,
  type NotificationHapticFeedbackType,
} from '@telegram-apps/sdk-react';

export type ThemeStyle = CSSProperties & Record<`--${string}`, string | undefined>;

let sdkInitialized = false;

function safeCall(action: () => void) {
  try {
    action();
  } catch {
    // Telegram SDK calls are progressive enhancement outside the Mini App shell.
  }
}

function safeInitTelegramSdk() {
  if (sdkInitialized) {
    return;
  }

  sdkInitialized = true;
  safeCall(() => {
    init({ acceptCustomStyles: true });
  });
}

function persistRawInitData() {
  try {
    const rawInitData = retrieveRawInitData();

    if (rawInitData) {
      localStorage.setItem('telegram_init_data', rawInitData);
      return;
    }
  } catch {
    // Outside Telegram there is no launch data to persist.
  }

  localStorage.removeItem('telegram_init_data');
}

export function useTelegramThemeStyle(): ThemeStyle {
  useEffect(() => {
    safeInitTelegramSdk();
    persistRawInitData();

    const cleanups: VoidFunction[] = [];

    safeCall(() => {
      if (mountMiniAppSync.isAvailable() && !isMiniAppMounted()) {
        mountMiniAppSync();
      }

      if (mountThemeParamsSync.isAvailable() && !isThemeParamsMounted()) {
        mountThemeParamsSync();
      }

      if (bindMiniAppCssVars.isAvailable() && !isMiniAppCssVarsBound()) {
        cleanups.push(bindMiniAppCssVars());
      }

      if (bindThemeParamsCssVars.isAvailable() && !isThemeParamsCssVarsBound()) {
        cleanups.push(bindThemeParamsCssVars());
      }

      if (miniAppReady.isAvailable()) {
        miniAppReady();
      }

      if (expandViewport.isAvailable()) {
        expandViewport();
      }

      if (mountViewport.isAvailable() && !isViewportMounted() && !isViewportMounting()) {
        void mountViewport().then(() => {
          safeCall(() => {
            if (bindViewportCssVars.isAvailable() && !isViewportCssVarsBound()) {
              cleanups.push(bindViewportCssVars());
            }
          });
        });
      }

      if (isViewportMounted() && bindViewportCssVars.isAvailable() && !isViewportCssVarsBound()) {
        cleanups.push(bindViewportCssVars());
      }
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
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
  const linkColor = useSignal(themeParamsLinkColor);
  const destructiveTextColor = useSignal(themeParamsDestructiveTextColor);
  const bottomBarBgColor = useSignal(themeParamsBottomBarBgColor);
  const safeAreaTop = useSignal(viewportSafeAreaInsetTop);
  const safeAreaRight = useSignal(viewportSafeAreaInsetRight);
  const safeAreaBottom = useSignal(viewportSafeAreaInsetBottom);
  const safeAreaLeft = useSignal(viewportSafeAreaInsetLeft);
  const contentSafeAreaTop = useSignal(viewportContentSafeAreaInsetTop);
  const contentSafeAreaRight = useSignal(viewportContentSafeAreaInsetRight);
  const contentSafeAreaBottom = useSignal(viewportContentSafeAreaInsetBottom);
  const contentSafeAreaLeft = useSignal(viewportContentSafeAreaInsetLeft);
  const viewportCurrentHeight = useSignal(viewportHeight);
  const viewportCurrentStableHeight = useSignal(viewportStableHeight);
  const viewportCurrentWidth = useSignal(viewportWidth);

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';

    const themeColorMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (themeColorMeta && buttonColor) {
      themeColorMeta.content = buttonColor;
    }
  }, [buttonColor, isDark]);

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
      '--tg-theme-link-color': linkColor,
      '--tg-theme-destructive-text-color': destructiveTextColor,
      '--tg-theme-bottom-bar-bg-color': bottomBarBgColor,
      '--tg-viewport-safe-area-inset-top': `${safeAreaTop}px`,
      '--tg-viewport-safe-area-inset-right': `${safeAreaRight}px`,
      '--tg-viewport-safe-area-inset-bottom': `${safeAreaBottom}px`,
      '--tg-viewport-safe-area-inset-left': `${safeAreaLeft}px`,
      '--tg-viewport-content-safe-area-inset-top': `${contentSafeAreaTop}px`,
      '--tg-viewport-content-safe-area-inset-right': `${contentSafeAreaRight}px`,
      '--tg-viewport-content-safe-area-inset-bottom': `${contentSafeAreaBottom}px`,
      '--tg-viewport-content-safe-area-inset-left': `${contentSafeAreaLeft}px`,
      '--tg-viewport-height': `${viewportCurrentHeight}px`,
      '--tg-viewport-stable-height': `${viewportCurrentStableHeight}px`,
      '--tg-viewport-width': `${viewportCurrentWidth}px`,
      colorScheme: isDark ? 'dark' : 'light',
    }),
    [
      bgColor,
      bottomBarBgColor,
      buttonColor,
      buttonTextColor,
      contentSafeAreaBottom,
      contentSafeAreaLeft,
      contentSafeAreaRight,
      contentSafeAreaTop,
      destructiveTextColor,
      isDark,
      lineColor,
      linkColor,
      mutedColor,
      safeAreaBottom,
      safeAreaLeft,
      safeAreaRight,
      safeAreaTop,
      secondaryBgColor,
      subtitleColor,
      surfaceColor,
      textColor,
      viewportCurrentHeight,
      viewportCurrentStableHeight,
      viewportCurrentWidth,
    ],
  );
}

export function useTelegramBackButton(canGoBack: boolean, onBack: () => void) {
  useEffect(() => {
    safeInitTelegramSdk();

    let cleanup: VoidFunction | undefined;

    safeCall(() => {
      if (isBackButtonSupported() && mountBackButton.isAvailable() && !isBackButtonMounted()) {
        mountBackButton();
      }

      if (onBackButtonClick.isAvailable()) {
        cleanup = onBackButtonClick(onBack);
      }
    });

    return () => cleanup?.();
  }, [onBack]);

  useEffect(() => {
    safeCall(() => {
      if (!isBackButtonSupported()) {
        return;
      }

      if (canGoBack && showBackButton.isAvailable()) {
        showBackButton();
        return;
      }

      if (hideBackButton.isAvailable()) {
        hideBackButton();
      }
    });
  }, [canGoBack]);
}

export function triggerImpact(style: ImpactHapticFeedbackStyle = 'light') {
  safeCall(() => {
    if (hapticFeedbackImpactOccurred.isAvailable()) {
      hapticFeedbackImpactOccurred(style);
    }
  });
}

export function triggerSelection() {
  safeCall(() => {
    if (hapticFeedbackSelectionChanged.isAvailable()) {
      hapticFeedbackSelectionChanged();
    }
  });
}

export function triggerNotification(type: NotificationHapticFeedbackType) {
  safeCall(() => {
    if (hapticFeedbackNotificationOccurred.isAvailable()) {
      hapticFeedbackNotificationOccurred(type);
    }
  });
}
