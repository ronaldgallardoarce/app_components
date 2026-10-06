// Must stay first: Uniwind CSS entry, then the stored theme applied before the first render.
import '@/global.css';
import '@/design-system/preference/apply-stored-theme-preference';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { PortalHost } from '@rn-primitives/portal';
import { Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useNavigationTheme } from '@/design-system/lib/navigation-theme';
import { ThemeToggle } from '@/design-system/preference/theme-toggle';
import { CATALOG_GROUPS } from '@/features/catalog/catalog-groups';

// Keep the native splash visible until the root layout has rendered (expo-splash-screen docs).
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const navigationTheme = useNavigationTheme();

  useEffect(() => {
    // The stored theme is applied synchronously at import time, so the first frame is ready.
    SplashScreen.hide();
  }, []);

  return (
    // Required by @gorhom/bottom-sheet: gestures need the root view, modal sheets need the provider.
    <GestureHandlerRootView style={styles.root}>
      <ThemeProvider value={navigationTheme}>
        <BottomSheetModalProvider>
          <StatusBar style={navigationTheme.dark ? 'light' : 'dark'} />
          {/* The theme toggle lives in every header, so switching never requires the catalog. */}
          <Stack screenOptions={{ headerRight: () => <ThemeToggle /> }}>
            <Stack.Screen name="index" options={{ title: 'Home' }} />
            <Stack.Screen name="catalog/index" options={{ title: 'Catalog' }} />
            {CATALOG_GROUPS.map((group) => (
              <Stack.Screen
                key={group.route}
                name={`catalog/${group.route}`}
                options={{ title: group.title }}
              />
            ))}
          </Stack>
        </BottomSheetModalProvider>
        {/* Required by RNR overlays (Dialog, Popover, dropdown menu...). Must stay last:
            after the bottom sheet host, so RNR overlays also render above open sheets. */}
        <PortalHost />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
