import { AnimatedPressable } from '@/design-system/components/animated-pressable';
import { TextClassContext } from '@/design-system/components/text';
import { useKeyboardHeight } from '@/design-system/lib/use-keyboard';
import { cn } from '@/design-system/lib/utils';
import * as PopoverPrimitive from '@rn-primitives/popover';
import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { FadeIn, FadeOut, ReduceMotion } from 'react-native-reanimated';
import { FullWindowOverlay as RNFullWindowOverlay } from 'react-native-screens';

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const FullWindowOverlay = Platform.OS === 'ios' ? RNFullWindowOverlay : React.Fragment;

/**
 * Keyboard: the popover stays open (it may host inputs) and moves ABOVE the keyboard. The
 * keyboard height is added to the bottom collision inset of `@rn-primitives/popover`, whose
 * collision handling (`avoidCollisions`, on by default) then caps the content's `top` so its bottom
 * edge sits above the keyboard. Closing on keyboard open is not an option: focusing an input inside
 * the popover opens the keyboard. Content taller than the space above the keyboard is not clamped
 * to the top inset by the primitive; keep popovers with inputs short (use a Dialog otherwise).
 */
function PopoverContent({
  className,
  align = 'center',
  sideOffset = 4,
  portalHost,
  insets,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content> & {
    portalHost?: string;
  }) {
  const keyboardHeight = useKeyboardHeight();
  const avoidInsets =
    keyboardHeight > 0
      ? { ...insets, bottom: Math.max(insets?.bottom ?? 0, keyboardHeight) }
      : insets;
  return (
    <PopoverPrimitive.Portal hostName={portalHost}>
      <FullWindowOverlay>
        <PopoverPrimitive.Overlay style={StyleSheet.absoluteFill} asChild>
          <AnimatedPressable
            entering={FadeIn.duration(200).reduceMotion(ReduceMotion.System)}
            exiting={FadeOut.reduceMotion(ReduceMotion.System)}>
            <TextClassContext.Provider value="text-popover-foreground">
              <PopoverPrimitive.Content
                align={align}
                sideOffset={sideOffset}
                insets={avoidInsets}
                className={cn(
                  'bg-popover border-border z-50 w-72 rounded-md border p-4 shadow-md shadow-black/5',
                  className
                )}
                {...props}
              />
            </TextClassContext.Provider>
          </AnimatedPressable>
        </PopoverPrimitive.Overlay>
      </FullWindowOverlay>
    </PopoverPrimitive.Portal>
  );
}

export { Popover, PopoverContent, PopoverTrigger };
