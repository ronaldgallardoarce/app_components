import * as React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type OverlayInsets = { top?: number; bottom?: number; left?: number; right?: number };

/**
 * Collision insets of a positioned `@rn-primitives` overlay (popover, dropdown menu): the caller's
 * values, the safe-area inset for every side left undefined, and the bottom raised to the keyboard
 * height. Memoized on the numbers, because the primitive recomputes its position whenever the
 * `insets` object changes.
 */
function useOverlayInsets(insets: OverlayInsets | undefined, keyboardHeight = 0) {
  const safe = useSafeAreaInsets();
  const top = insets?.top ?? safe.top;
  const bottom = Math.max(insets?.bottom ?? safe.bottom, keyboardHeight);
  const left = insets?.left ?? safe.left;
  const right = insets?.right ?? safe.right;
  return React.useMemo(() => ({ top, bottom, left, right }), [top, bottom, left, right]);
}

export { useOverlayInsets };
export type { OverlayInsets };
