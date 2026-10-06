import { useSyncExternalStore } from 'react';

import type { ThemePreference } from './theme-preference';
import { themePreferenceStore } from './theme-preference-store';

const { subscribe, getThemePreference, setThemePreference } = themePreferenceStore;

/** The user's stored preference ('light' | 'dark' | 'system'), not the resolved theme. */
export function useThemePreference(): {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
} {
  const preference = useSyncExternalStore(subscribe, getThemePreference);
  return { preference, setPreference: setThemePreference };
}
