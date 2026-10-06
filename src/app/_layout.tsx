// Must stay first: Uniwind CSS entry, then the stored theme applied before the first render.
import '@/global.css';
import '@/design-system/preference/apply-stored-theme-preference';

import { PortalHost } from '@rn-primitives/portal';
import { Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { useNavigationTheme } from '@/design-system/lib/navigation-theme';

// Keep the native splash visible until the root layout has rendered (expo-splash-screen docs).
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const navigationTheme = useNavigationTheme();

  useEffect(() => {
    // The stored theme is applied synchronously at import time, so the first frame is ready.
    SplashScreen.hide();
  }, []);

  return (
    <ThemeProvider value={navigationTheme}>
      <StatusBar style={navigationTheme.dark ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen name="catalog" options={{ title: 'Catalog' }} />
      </Stack>
      {/* Required by RNR overlays (Dialog, Popover, Select, Tooltip, menus...). Must stay last. */}
      <PortalHost />
    </ThemeProvider>
  );
}
