// Side-effect module: import it FIRST in src/app/_layout.tsx.
//
// The store reads the stored preference synchronously (expo-sqlite kv-store) when it is created; applying it
// here, at module evaluation and before the first render, avoids a light/dark flash on startup.
// Uniwind otherwise starts adaptive (follows the system scheme) until `setTheme` is called.
import { Uniwind } from 'uniwind';

import { applyThemePreference } from './apply-theme-preference';
import { themePreferenceStore } from './theme-preference-store';

applyThemePreference(themePreferenceStore.getThemePreference(), Uniwind);
