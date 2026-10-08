import * as React from 'react';
import type { BlurEvent, FocusEvent } from 'react-native';

type FocusHandler<E> = ((event: E) => void) | null | undefined;

type FocusProps = {
  onFocus?: FocusHandler<FocusEvent>;
  onBlur?: FocusHandler<BlurEvent>;
};

/**
 * Focus indicator drawn with the `--color-ring` token: a 2dp outline 2dp outside the control, so it
 * never changes the layout. Applied only while the control has focus (see `useFocusRing`).
 */
const FOCUS_RING_CLASS_NAME = 'outline-solid outline-2 outline-offset-2 outline-ring';

/**
 * Tracks a Pressable's focus through `onFocus` / `onBlur` so it can draw `FOCUS_RING_CLASS_NAME`.
 *
 * Free-tier replacement for `focus-visible:`: React Native's Pressable does not expose a `focused`
 * render state, so Uniwind's `focus:` variant never matches on it. On Android a Pressable only
 * receives focus from a hardware keyboard, D-pad or Switch Access (never from touch), so the ring
 * appears exactly when it is needed. The caller's own handlers are still invoked.
 */
function useFocusRing({ onFocus, onBlur }: FocusProps) {
  const [focused, setFocused] = React.useState(false);
  return {
    focused,
    focusHandlers: {
      onFocus: (event: FocusEvent) => {
        setFocused(true);
        onFocus?.(event);
      },
      onBlur: (event: BlurEvent) => {
        setFocused(false);
        onBlur?.(event);
      },
    },
  };
}

export { FOCUS_RING_CLASS_NAME, useFocusRing };
