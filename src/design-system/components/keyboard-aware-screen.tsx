import { cn } from '@/design-system/lib/utils';
import type { ReactNode } from 'react';
import { Platform, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';

type KeyboardAwareScreenProps = {
  children: ReactNode;
  /** Classes for the screen container that wraps the scroll view (background, flex). */
  className?: string;
  /** Classes for the content container (padding, gaps). */
  contentContainerClassName?: string;
  /** Extra space below the content, added on top of the bottom safe-area inset. */
  bottomSpacing?: number;
  /** Gap between the focused input's bottom edge and the keyboard. Defaults to 24. */
  keyboardOffset?: number;
};

/** Uniwind maps `className` / `contentContainerClassName` on this third-party scroll view. */
const ScrollView = withUniwind(KeyboardAwareScrollView);

/**
 * Scrollable screen that keeps the focused input visible above the keyboard.
 *
 * Every screen with text inputs must use this instead of a bare `ScrollView`, so the keyboard
 * strategy lives in one place. Built on `react-native-keyboard-controller` (native module, needs a
 * development build and `KeyboardProvider` at the root, see src/app/_layout.tsx): the scroll view
 * follows the keyboard frame by frame on both platforms, including Android edge-to-edge where the
 * window never resizes.
 *
 * Bottom space: while the keyboard is hidden the content ends `insets.bottom + bottomSpacing`
 * above the screen bottom. While it is open the library extends the scrollable area by the
 * keyboard height; `extraKeyboardSpace` takes that static padding back out (the keyboard already
 * covers the navigation bar), leaving exactly `keyboardOffset` below the last input, so the two
 * never stack into a large empty gap.
 */
function KeyboardAwareScreen({
  children,
  className,
  contentContainerClassName,
  bottomSpacing = 32,
  keyboardOffset = 24,
}: KeyboardAwareScreenProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = insets.bottom + bottomSpacing;

  return (
    <View className={cn('bg-background flex-1', className)}>
      <ScrollView
        className="flex-1"
        contentContainerClassName={contentContainerClassName}
        contentContainerStyle={{ paddingBottom: bottomPadding }}
        bottomOffset={keyboardOffset}
        extraKeyboardSpace={keyboardOffset - bottomPadding}
        keyboardShouldPersistTaps="handled"
        // `interactive` is iOS-only; Android supports `none` | `on-drag`.
        keyboardDismissMode={Platform.select({ ios: 'interactive', default: 'on-drag' })}
      >
        {children}
      </ScrollView>
    </View>
  );
}

export { KeyboardAwareScreen };
export type { KeyboardAwareScreenProps };
