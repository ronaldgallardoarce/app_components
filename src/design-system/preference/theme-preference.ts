export type ThemePreference = 'light' | 'dark' | 'system';

export const THEME_PREFERENCES: readonly ThemePreference[] = ['light', 'dark', 'system'];

export const isThemePreference = (value: unknown): value is ThemePreference =>
  typeof value === 'string' && (THEME_PREFERENCES as readonly string[]).includes(value);

/** Synchronous storage port for the user's theme preference. */
export interface ThemePreferenceStorage {
  get(): ThemePreference | null;
  set(value: ThemePreference): void;
}
