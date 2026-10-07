import * as React from 'react';
import { Dimensions, Keyboard, type KeyboardEvent, Platform, type View } from 'react-native';
import {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

/**
 * Keyboard helpers for portal overlays (Dialog, AlertDialog, Popover).
 *
 * Portal content is absolutely positioned over the whole window, and the window does not resize
 * for the keyboard: on iOS it never does, and on Android Expo SDK 54+ enforces edge-to-edge, where
 * `softwareKeyboardLayoutMode: "resize"` no longer resizes it (see `KeyboardAwareScreen`). Without
 * help, the keyboard covers inputs rendered inside overlays.
 *
 * Built on React Native's `Keyboard` events only (no native dependency, Expo Go compatible).
 * Reanimated's `useAnimatedKeyboard` is not used: it is deprecated and, on Android, it takes over
 * the window insets for the whole app, which would change the behavior of every other screen.
 * - iOS emits `keyboardWill*` with the animation `duration`, so the overlay moves with the keyboard.
 * - Android emits only `keyboardDid*`, so the overlay follows right after the keyboard settles.
 */

const SHOW_EVENT = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
const HIDE_EVENT = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

/** Fallback when the platform reports no animation duration (Android `keyboardDid*`). */
const DEFAULT_DURATION = 200;

/** Frames to wait for the measured view's first layout before accepting a 0 size. */
const MAX_MEASURE_RETRIES = 5;

const timing = (duration: number) => ({
  duration: duration > 0 ? duration : DEFAULT_DURATION,
  reduceMotion: ReduceMotion.System,
});

/**
 * Animated bottom padding that keeps an overlay's content above the keyboard.
 *
 * Attach `ref` and `style` to a view that fills the overlay. The padding equals the part of that
 * view covered by the keyboard (measured in window coordinates, so it is 0 if the window ever does
 * resize). The value lives in a shared value: opening or closing the keyboard animates on the UI
 * thread and never re-renders the overlay's React tree. Padding does not change the view's own
 * frame, so measuring it again is not affected by the previous padding.
 */
function useKeyboardAvoidingStyle() {
  const ref = React.useRef<View>(null);
  const inset = useSharedValue(0);

  React.useEffect(() => {
    // `measureInWindow` is async. Every keyboard event bumps `seq`, so a measurement that resolves
    // after a newer event (e.g. a hide landing before a show's measurement) is dropped instead of
    // padding the overlay for a keyboard that is gone.
    let seq = 0;
    let frame: number | undefined;

    const measure = (id: number, keyboardTop: number, duration: number, retries: number) => {
      ref.current?.measureInWindow((_x, y, _width, height) => {
        if (id !== seq) return;
        // Before the first layout (keyboard already open at mount) the view measures 0x0:
        // retry on the next frames instead of settling on a 0 inset.
        if (height === 0 && retries < MAX_MEASURE_RETRIES) {
          frame = requestAnimationFrame(() => measure(id, keyboardTop, duration, retries + 1));
          return;
        }
        inset.set(withTiming(Math.max(0, y + height - keyboardTop), timing(duration)));
      });
    };
    const avoid = (keyboardTop: number, duration: number) => measure(++seq, keyboardTop, duration, 0);

    // The keyboard may already be open when the overlay mounts (e.g. opened from a focused field).
    const metrics = Keyboard.isVisible() ? Keyboard.metrics() : undefined;
    if (metrics) {
      avoid(metrics.screenY, 0);
    }

    const show = Keyboard.addListener(SHOW_EVENT, (event: KeyboardEvent) => {
      avoid(event.endCoordinates.screenY, event.duration);
    });
    // iOS only (Android re-emits `keyboardDidShow` instead): height changes while open, such as
    // switching to the emoji keyboard or rotating. Ignored once hidden so it cannot undo a hide.
    const change = Keyboard.addListener('keyboardWillChangeFrame', (event: KeyboardEvent) => {
      if (Keyboard.isVisible()) avoid(event.endCoordinates.screenY, event.duration);
    });
    const hide = Keyboard.addListener(HIDE_EVENT, (event: KeyboardEvent) => {
      seq++;
      inset.set(withTiming(0, timing(event.duration)));
    });
    return () => {
      seq++;
      if (frame !== undefined) cancelAnimationFrame(frame);
      show.remove();
      change.remove();
      hide.remove();
    };
  }, [inset]);

  const style = useAnimatedStyle(() => ({ paddingBottom: inset.get() }));

  return { ref, style };
}

/**
 * Height of the keyboard measured from the bottom of the screen, as React state (0 when hidden).
 *
 * For positioning that is computed in JS (e.g. `@rn-primitives` popover collision `insets`); it
 * re-renders the caller once per keyboard show / hide. Prefer `useKeyboardAvoidingStyle` when an
 * animated style is enough.
 */
function useKeyboardHeight() {
  const [height, setHeight] = React.useState(() => {
    const metrics = Keyboard.isVisible() ? Keyboard.metrics() : undefined;
    return metrics ? Math.max(0, Dimensions.get('screen').height - metrics.screenY) : 0;
  });

  React.useEffect(() => {
    const update = (event: KeyboardEvent) =>
      setHeight(Math.max(0, Dimensions.get('screen').height - event.endCoordinates.screenY));
    const show = Keyboard.addListener(SHOW_EVENT, update);
    // iOS only: height changes while open (see `useKeyboardAvoidingStyle`).
    const change = Keyboard.addListener('keyboardWillChangeFrame', (event: KeyboardEvent) => {
      if (Keyboard.isVisible()) update(event);
    });
    const hide = Keyboard.addListener(HIDE_EVENT, () => setHeight(0));
    return () => {
      show.remove();
      change.remove();
      hide.remove();
    };
  }, []);

  return height;
}

export { useKeyboardAvoidingStyle, useKeyboardHeight };
