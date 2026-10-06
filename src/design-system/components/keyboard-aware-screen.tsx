import { cn } from '@/design-system/lib/utils';
import * as React from 'react';
import type { ReactNode } from 'react';
import { Keyboard, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type KeyboardAwareScreenProps = {
  children: ReactNode;
  /** Classes for the screen container that wraps the scroll view (background, flex). */
  className?: string;
  /** Classes for the content container (padding, gaps). */
  contentContainerClassName?: string;
  /** Extra space below the content, added on top of the bottom safe-area inset. */
  bottomSpacing?: number;
};

/**
 * Height of the part of `ref`'s view covered by the Android keyboard (0 elsewhere).
 *
 * Expo SDK 54+ enforces Android edge-to-edge (`setDecorFitsSystemWindows(false)`), and under
 * edge-to-edge `softwareKeyboardLayoutMode: "resize"` no longer resizes the window, so the keyboard
 * simply covers the bottom of the screen. RN still emits `keyboardDidShow` with the keyboard top
 * (`endCoordinates.screenY`, from the window's visible frame); the overlap is the distance from that
 * line to the bottom of the view. If the window ever does resize, the view already ends above the
 * keyboard and the overlap is 0, so the two mechanisms never add up.
 */
function useAndroidKeyboardOverlap(ref: React.RefObject<View | null>) {
  const [overlap, setOverlap] = React.useState(0);

  React.useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }
    const show = Keyboard.addListener('keyboardDidShow', (event) => {
      ref.current?.measureInWindow((_x, y, _width, height) => {
        setOverlap(Math.max(0, y + height - event.endCoordinates.screenY));
      });
    });
    const hide = Keyboard.addListener('keyboardDidHide', () => setOverlap(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, [ref]);

  return overlap;
}

/**
 * Scrollable screen that keeps the focused input visible above the keyboard.
 *
 * Every screen with text inputs must use this instead of a bare `ScrollView`, so the keyboard
 * strategy lives in one place. Current implementation (Expo Go compatible, React Native only):
 * - iOS: `automaticallyAdjustKeyboardInsets` insets the content by the keyboard height and scrolls
 *   the focused input into view.
 * - Android (edge-to-edge, the window does NOT resize): the wrapper is padded by the measured
 *   keyboard overlap, so the ScrollView shrinks to the area above the keyboard; Android's ScrollView
 *   then keeps the focused input visible when its size changes.
 *
 * Moving to a development build: swap the `ScrollView` for `KeyboardAwareScrollView` from
 * `react-native-keyboard-controller` (and add its `KeyboardProvider` to the root layout). Screens
 * keep using this component unchanged.
 */
function KeyboardAwareScreen({
  children,
  className,
  contentContainerClassName,
  bottomSpacing = 32,
}: KeyboardAwareScreenProps) {
  const insets = useSafeAreaInsets();
  const containerRef = React.useRef<View>(null);
  const keyboardOverlap = useAndroidKeyboardOverlap(containerRef);

  return (
    <View
      ref={containerRef}
      className={cn('bg-background flex-1', className)}
      style={{ paddingBottom: keyboardOverlap }}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName={contentContainerClassName}
        contentContainerStyle={{ paddingBottom: insets.bottom + bottomSpacing }}
        automaticallyAdjustKeyboardInsets
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
