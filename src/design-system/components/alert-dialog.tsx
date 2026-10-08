import {
  buttonTextVariants,
  buttonVariants,
  type ButtonVariant,
} from '@/design-system/components/button';
import { AnimatedPressable } from '@/design-system/components/animated-pressable';
import { renderTextChildren, TextClassContext } from '@/design-system/components/text';
import { useKeyboardAvoidingStyle } from '@/design-system/lib/use-keyboard';
import { FOCUS_RING_CLASS_NAME, useFocusRing } from '@/design-system/lib/use-focus-ring';
import { usePressed } from '@/design-system/lib/use-pressed';
import { cn } from '@/design-system/lib/utils';
import * as AlertDialogPrimitive from '@rn-primitives/alert-dialog';
import * as React from 'react';
import { Platform, ScrollView, View, type ViewProps } from 'react-native';
import Animated, { FadeIn, FadeOut, ReduceMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FullWindowOverlay as RNFullWindowOverlay } from 'react-native-screens';

const AlertDialog = AlertDialogPrimitive.Root;

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = AlertDialogPrimitive.Portal;

const FullWindowOverlay = Platform.OS === 'ios' ? RNFullWindowOverlay : React.Fragment;

/**
 * Full-window backdrop; children are centered above the keyboard and inside the safe area
 * (see `DialogOverlay`).
 */
function AlertDialogOverlay({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof AlertDialogPrimitive.Overlay>, 'asChild'> & {
    children?: React.ReactNode;
  }) {
  const insets = useSafeAreaInsets();
  const { ref: keyboardRef, style: keyboardStyle } = useKeyboardAvoidingStyle({
    minBottom: insets.bottom,
  });
  return (
    <FullWindowOverlay>
      <AlertDialogPrimitive.Overlay
        className={cn(
          'absolute bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black/50 p-2',
          className
        )}
        {...props}
        asChild>
        <AnimatedPressable
          entering={FadeIn.duration(200).delay(50).reduceMotion(ReduceMotion.System)}
          exiting={FadeOut.duration(150).reduceMotion(ReduceMotion.System)}>
          <Animated.View
            ref={keyboardRef}
            className="w-full flex-1 items-center justify-center"
            style={[
              { paddingTop: insets.top, paddingLeft: insets.left, paddingRight: insets.right },
              keyboardStyle,
            ]}>
            <>{children}</>
          </Animated.View>
        </AnimatedPressable>
      </AlertDialogPrimitive.Overlay>
    </FullWindowOverlay>
  );
}

/**
 * `className` styles the frame; the children are laid out by `contentContainerClassName`. Like
 * `DialogContent`, the frame is capped at 85% of the space above the keyboard and scrolls, so an
 * alert dialog that hosts an input (e.g. "type DELETE to confirm") stays usable.
 */
function AlertDialogContent({
  className,
  contentContainerClassName,
  portalHost,
  children,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content> & {
    /** Classes for the scrollable children container (defaults: `gap-4 p-6`). */
    contentContainerClassName?: string;
    portalHost?: string;
  }) {
  return (
    <AlertDialogPortal hostName={portalHost}>
      <AlertDialogOverlay>
        <AlertDialogPrimitive.Content
          className={cn(
            'bg-background border-border z-50 flex max-h-[85%] shrink flex-col rounded-lg border shadow-lg shadow-black/5 sm:max-w-lg',
            className
          )}
          {...props}>
          <ScrollView
            className="grow-0"
            contentContainerClassName={cn('flex flex-col gap-4 p-6', contentContainerClassName)}
            keyboardShouldPersistTaps="handled">
            <>{children}</>
          </ScrollView>
        </AlertDialogPrimitive.Content>
      </AlertDialogOverlay>
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({ className, ...props }: ViewProps) {
  return (
    <TextClassContext.Provider value="text-center sm:text-left">
      <View className={cn('flex flex-col gap-2', className)} {...props} />
    </TextClassContext.Provider>
  );
}

function AlertDialogFooter({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  );
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      className={cn('text-foreground text-lg font-semibold', className)}
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

type AlertDialogActionProps = React.ComponentProps<typeof AlertDialogPrimitive.Action> & {
  /** Button style of the confirm action, e.g. `danger` for destructive confirmations. */
  variant?: ButtonVariant;
};

/**
 * Strings and numbers are wrapped in `Text` (like `Button`). Render-function children (Pressable
 * state) and `asChild` elements are passed through untouched.
 */
function renderActionChildren(
  children: React.ComponentProps<typeof AlertDialogPrimitive.Action>['children'],
  asChild: boolean | undefined
) {
  return typeof children === 'function' || asChild ? children : renderTextChildren(children);
}

// Free tier: the pressed state (`usePressed`) feeds `buttonTextVariants` instead of
// `group-active:`, matching Button. `className` styles the container only.
function AlertDialogAction({
  className,
  variant = 'primary',
  onPressIn,
  onPressOut,
  onFocus,
  onBlur,
  children,
  ...props
}: AlertDialogActionProps) {
  const { pressed, pressHandlers } = usePressed({ onPressIn, onPressOut });
  const { focused, focusHandlers } = useFocusRing({ onFocus, onBlur });
  return (
    <TextClassContext.Provider value={buttonTextVariants({ variant, pressed })}>
      <AlertDialogPrimitive.Action
        className={cn(buttonVariants({ variant }), focused && FOCUS_RING_CLASS_NAME, className)}
        {...props}
        {...pressHandlers}
        {...focusHandlers}>
        {renderActionChildren(children, props.asChild)}
      </AlertDialogPrimitive.Action>
    </TextClassContext.Provider>
  );
}

function AlertDialogCancel({
  className,
  onPressIn,
  onPressOut,
  onFocus,
  onBlur,
  children,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  const { pressed, pressHandlers } = usePressed({ onPressIn, onPressOut });
  const { focused, focusHandlers } = useFocusRing({ onFocus, onBlur });
  return (
    <TextClassContext.Provider value={buttonTextVariants({ variant: 'outline', pressed })}>
      <AlertDialogPrimitive.Cancel
        className={cn(
          buttonVariants({ variant: 'outline' }),
          focused && FOCUS_RING_CLASS_NAME,
          className
        )}
        {...props}
        {...pressHandlers}
        {...focusHandlers}>
        {renderActionChildren(children, props.asChild)}
      </AlertDialogPrimitive.Cancel>
    </TextClassContext.Provider>
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
