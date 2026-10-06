// Composition root: the only place where the concrete storage and runtime are wired.
import { Uniwind } from 'uniwind';

import { applyThemePreference } from './apply-theme-preference';
import { createThemePreferenceStore } from './create-theme-preference-store';
import { SqliteThemePreferenceStorage } from './sqlite-theme-preference-storage';

export const themePreferenceStore = createThemePreferenceStore({
  storage: new SqliteThemePreferenceStorage(),
  apply: (preference) => applyThemePreference(preference, Uniwind),
});
