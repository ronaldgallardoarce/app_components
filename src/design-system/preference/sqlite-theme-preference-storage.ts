import Storage from 'expo-sqlite/kv-store';

import { isThemePreference, type ThemePreference, type ThemePreferenceStorage } from './theme-preference';

const THEME_PREFERENCE_KEY = 'theme-preference';

/** expo-sqlite key-value adapter (synchronous API, included in Expo Go). */
export class SqliteThemePreferenceStorage implements ThemePreferenceStorage {
  get(): ThemePreference | null {
    const value = Storage.getItemSync(THEME_PREFERENCE_KEY);
    return isThemePreference(value) ? value : null;
  }

  set(value: ThemePreference): void {
    Storage.setItemSync(THEME_PREFERENCE_KEY, value);
  }
}
