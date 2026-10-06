import type { ThemePreference, ThemePreferenceStorage } from './theme-preference';

export const DEFAULT_THEME_PREFERENCE: ThemePreference = 'system';

type Listener = () => void;

export interface ThemePreferenceStore {
  getThemePreference(): ThemePreference;
  setThemePreference(preference: ThemePreference): void;
  subscribe(listener: Listener): () => void;
}

interface ThemePreferenceStoreDeps {
  storage: ThemePreferenceStorage;
  apply: (preference: ThemePreference) => void;
}

/** Observable store over the storage port; compatible with `useSyncExternalStore`. */
export function createThemePreferenceStore({ storage, apply }: ThemePreferenceStoreDeps): ThemePreferenceStore {
  let current: ThemePreference = storage.get() ?? DEFAULT_THEME_PREFERENCE;
  const listeners = new Set<Listener>();

  return {
    getThemePreference: () => current,
    setThemePreference(preference) {
      if (preference === current) {
        return;
      }
      storage.set(preference);
      apply(preference);
      current = preference;
      listeners.forEach((listener) => listener());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
