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

/**
 * Reads the stored preference without letting a storage failure (corrupt or locked database,
 * low disk) crash the app: the store is created at startup, before the first render, so a
 * throw here would keep the app from launching. The preference is non-critical, so it falls
 * back to the default.
 */
function readStoredPreference(storage: ThemePreferenceStorage): ThemePreference {
  try {
    return storage.get() ?? DEFAULT_THEME_PREFERENCE;
  } catch (error) {
    if (__DEV__) {
      console.warn('Could not read the stored theme preference; using the default.', error);
    }
    return DEFAULT_THEME_PREFERENCE;
  }
}

/** Observable store over the storage port; compatible with `useSyncExternalStore`. */
export function createThemePreferenceStore({ storage, apply }: ThemePreferenceStoreDeps): ThemePreferenceStore {
  let current: ThemePreference = readStoredPreference(storage);
  const listeners = new Set<Listener>();

  return {
    getThemePreference: () => current,
    setThemePreference(preference) {
      if (preference === current) {
        return;
      }
      // Apply first: if it throws, nothing is persisted and the store stays consistent.
      apply(preference);
      current = preference;
      // Persisting is best effort: a storage failure keeps the theme for this session
      // instead of failing the user's action. It runs before notifying listeners so a
      // throwing subscriber cannot skip it.
      try {
        storage.set(preference);
      } catch (error) {
        if (__DEV__) {
          console.warn('Could not persist the theme preference; it applies to this session only.', error);
        }
      }
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
