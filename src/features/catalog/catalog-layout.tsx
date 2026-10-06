import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { KeyboardAwareScreen } from '@/design-system/components/keyboard-aware-screen';
import { Text } from '@/design-system/components/text';

// Shared building blocks for the dev catalog screens.

export function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="gap-6">
      <Text variant="h2" className="text-left">
        {title}
      </Text>
      {children}
    </View>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="gap-3">
      <Text variant="h4">{title}</Text>
      {children}
    </View>
  );
}

export function Row({ children }: { children: ReactNode }) {
  return <View className="flex-row flex-wrap items-center gap-2">{children}</View>;
}

/** Native overlays need the safe-area insets to avoid notches and the home indicator. */
export function useContentInsets() {
  const insets = useSafeAreaInsets();
  return { top: insets.top, bottom: insets.bottom, left: 12, right: 12 };
}

/** Scrollable screen shell for one catalog group; only one group is mounted at a time. */
export function CatalogScreen({ children }: { children: ReactNode }) {
  return (
    <KeyboardAwareScreen contentContainerClassName="gap-10 px-4 pt-6">{children}</KeyboardAwareScreen>
  );
}
