import { FOCUS_RING_CLASS_NAME, useFocusRing } from '@/design-system/lib/use-focus-ring';
import { cn } from '@/design-system/lib/utils';
import * as SwitchPrimitives from '@rn-primitives/switch';
import * as React from 'react';
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

/**
 * The track is 32 x 18.4dp (RNR visual size); the slop grows the touch target to 48 x 48dp.
 * Per the React Native docs it never extends past the parent view, so give the row vertical room.
 */
const SWITCH_HIT_SLOP = { top: 15, bottom: 15, left: 8, right: 8 } as const;

/**
 * Thumb travel: 32dp track - 2 x 1dp border - 16dp thumb = 14dp (RNR's `translate-x-3.5`).
 * Animated with Reanimated on the UI thread: `transition-transform` needs Uniwind Pro, so a class
 * swap would make the thumb jump. Reduce motion (system setting) skips the animation.
 */
const THUMB_TRAVEL = 14;
const THUMB_TIMING = { duration: 150, reduceMotion: ReduceMotion.System };

function Switch({
  className,
  hitSlop = SWITCH_HIT_SLOP,
  onFocus,
  onBlur,
  ...props
}: React.ComponentProps<typeof SwitchPrimitives.Root>) {
  const { focused, focusHandlers } = useFocusRing({ onFocus, onBlur });
  const offset = useSharedValue(props.checked ? THUMB_TRAVEL : 0);

  React.useEffect(() => {
    offset.set(withTiming(props.checked ? THUMB_TRAVEL : 0, THUMB_TIMING));
  }, [offset, props.checked]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.get() }],
  }));

  return (
    <SwitchPrimitives.Root
      className={cn(
        'flex h-[1.15rem] w-8 shrink-0 flex-row items-center rounded-full border border-transparent shadow-sm shadow-black/5',

        // Unchecked track uses the `input-border` token; its value (see global.css) sets the contrast.
        props.checked ? 'bg-primary' : 'bg-input-border',
        props.disabled && 'opacity-50',
        focused && FOCUS_RING_CLASS_NAME,
        className
      )}
      hitSlop={hitSlop}
      {...props}
      {...focusHandlers}>
      <SwitchPrimitives.Thumb asChild>
        <Animated.View
          style={thumbStyle}
          className={cn(
            'bg-background size-4 rounded-full',
            props.checked ? 'dark:bg-primary-foreground' : 'dark:bg-foreground'
          )}
        />
      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
  );
}

export { Switch };
