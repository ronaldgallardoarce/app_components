import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';

/** Reanimated-enabled `Pressable`, so overlays can take `entering` / `exiting` layout animations. */
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export { AnimatedPressable };
