import type { ThemePreference } from './theme-preference';

/**
 * Minimal slice of Uniwind's runtime (`Uniwind` from 'uniwind') needed to apply a preference.
 *
 * Uniwind 1.12.2 `setTheme` already syncs native UI (Alert, Modal, system dialogs):
 * - 'light' | 'dark': disables adaptive themes and calls `Appearance.setColorScheme(theme)`.
 * - 'system': re-enables adaptive themes and calls `Appearance.setColorScheme('unspecified')`
 *   on RN 0.82-0.86 ('auto' on RN >= 0.87), so no extra `Appearance` call is needed.
 * Source: node_modules/uniwind/src/core/config/config.common.ts (`setTheme`).
 */
export interface ThemeRuntime {
  setTheme(theme: ThemePreference): void;
}

/** Applies a preference to the styling runtime (and, through it, to native UI). */
export function applyThemePreference(preference: ThemePreference, themeRuntime: ThemeRuntime): void {
  themeRuntime.setTheme(preference);
}
