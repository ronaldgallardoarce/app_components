import { cn } from '@/design-system/lib/utils';
import * as ProgressPrimitive from '@rn-primitives/progress';
import * as React from 'react';
import { I18nManager } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

function Progress({
  className,
  value,
  indicatorClassName,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
    indicatorClassName?: string;
  }) {
  return (
    <ProgressPrimitive.Root
      className={cn('bg-primary/20 relative h-2 w-full overflow-hidden rounded-full', className)}
      // Root reads `value` for aria-valuenow / accessibilityValue.
      value={value}
      {...props}>
      <Indicator value={value} className={indicatorClassName} />
    </ProgressPrimitive.Root>
  );
}

export { Progress };

type IndicatorProps = {
  value: number | undefined | null;
  className?: string;
};

/** The bar grows from the start edge (left in LTR, right in RTL). */
const TRANSFORM_ORIGIN = I18nManager.isRTL ? 'right' : 'left';

const SPRING = { overshootClamping: true, reduceMotion: ReduceMotion.System };

/** Fraction of the track filled (0.01 - 1): an empty bar still shows a sliver, like RNR. */
const toScale = (value: number | undefined | null) =>
  interpolate(value ?? 0, [0, 100], [0.01, 1], Extrapolation.CLAMP);

/**
 * The indicator is always full width and scaled horizontally from the start edge. `transform`
 * animates on the UI thread without a layout pass per frame (animating `width` relayouts the bar
 * on every frame).
 */
function Indicator({ value, className }: IndicatorProps) {
  const scale = useSharedValue(toScale(value));

  React.useEffect(() => {
    scale.set(withSpring(toScale(value), SPRING));
  }, [scale, value]);

  const indicator = useAnimatedStyle(() => ({
    transform: [{ scaleX: scale.get() }],
  }));

  return (
    <ProgressPrimitive.Indicator asChild>
      <Animated.View
        style={[{ transformOrigin: TRANSFORM_ORIGIN }, indicator]}
        className={cn('bg-foreground h-full w-full', className)}
      />
    </ProgressPrimitive.Indicator>
  );
}
