import * as React from 'react';
import type { GestureResponderEvent } from 'react-native';

type PressInOutHandler = ((event: GestureResponderEvent) => void) | null | undefined;

type PressInOutProps = {
  onPressIn?: PressInOutHandler;
  onPressOut?: PressInOutHandler;
};

/**
 * Tracks a Pressable's pressed state through `onPressIn` / `onPressOut`.
 *
 * Free-tier replacement for Uniwind Pro's `group-active:` variant: components that need to
 * restyle descendant text while pressed read `pressed` and feed it to `TextClassContext`.
 * Use it when the Pressable is owned by a primitive (e.g. `@rn-primitives/*` items) and a
 * `children` render function is not an option. The caller's own handlers are still invoked.
 */
function usePressed({ onPressIn, onPressOut }: PressInOutProps) {
  const [pressed, setPressed] = React.useState(false);
  return {
    pressed,
    pressHandlers: {
      onPressIn: (event: GestureResponderEvent) => {
        setPressed(true);
        onPressIn?.(event);
      },
      onPressOut: (event: GestureResponderEvent) => {
        setPressed(false);
        onPressOut?.(event);
      },
    },
  };
}

export { usePressed };
