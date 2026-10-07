import { Icon } from '@/design-system/components/icon';
import { AnimatedPressable } from '@/design-system/components/animated-pressable';
import { useKeyboardAvoidingStyle } from '@/design-system/lib/use-keyboard';
import { cn } from '@/design-system/lib/utils';
import * as DialogPrimitive from '@rn-primitives/dialog';
import { X } from 'lucide-react-native';
import * as React from 'react';
import { Platform, ScrollView, Text, View, type ViewProps } from 'react-native';
import Animated, { FadeIn, FadeOut, ReduceMotion } from 'react-native-reanimated';
import { FullWindowOverlay as RNFullWindowOverlay } from 'react-native-screens';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const FullWindowOverlay = Platform.OS === 'ios' ? RNFullWindowOverlay : React.Fragment;

/**
 * Full-window backdrop. Its children are centered in the area ABOVE the keyboard: the inner
 * wrapper fills the overlay and is padded by the part the keyboard covers (animated on the UI
 * thread, see `useKeyboardAvoidingStyle`). The wrapper has no touch handlers, so presses on the
 * empty area still reach the overlay and close the dialog.
 */
function DialogOverlay({
  className,
  children,
  onPress,
  ...props
}: Omit<React.ComponentProps<typeof DialogPrimitive.Overlay>, 'asChild'> & {
  children?: React.ReactNode;
}) {
  const { ref: keyboardRef, style: keyboardStyle } = useKeyboardAvoidingStyle();
  return (
    <FullWindowOverlay>
      <DialogPrimitive.Overlay
        className={cn(
          'absolute bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black/50 p-2',
          className
        )}
        {...props}
        onPress={onPress}
        asChild>
        <AnimatedPressable
          entering={FadeIn.duration(200).reduceMotion(ReduceMotion.System)}
          exiting={FadeOut.duration(150).reduceMotion(ReduceMotion.System)}>
          <Animated.View
            ref={keyboardRef}
            className="w-full flex-1 items-center justify-center"
            style={keyboardStyle}
            entering={FadeIn.delay(50).reduceMotion(ReduceMotion.System)}
            exiting={FadeOut.duration(150).reduceMotion(ReduceMotion.System)}>
            <>{children}</>
          </Animated.View>
        </AnimatedPressable>
      </DialogPrimitive.Overlay>
    </FullWindowOverlay>
  );
}

/**
 * `className` styles the dialog frame (width, border, background); the children are laid out by
 * `contentContainerClassName` (padding, gap). The frame is capped at 85% of the space above the
 * keyboard and the children scroll inside it, so tall content and focused inputs stay reachable.
 */
function DialogContent({
  className,
  contentContainerClassName,
  portalHost,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  /** Classes for the scrollable children container (defaults: `gap-4 p-6`). */
  contentContainerClassName?: string;
  portalHost?: string;
}) {
  return (
    <DialogPortal hostName={portalHost}>
      <DialogOverlay>
        <DialogPrimitive.Content
          className={cn(
            'bg-background border-border z-50 mx-auto flex max-h-[85%] w-full shrink flex-col rounded-lg border shadow-lg shadow-black/5 sm:max-w-lg',
            className
          )}
          {...props}>
          <ScrollView
            className="grow-0"
            contentContainerClassName={cn('flex flex-col gap-4 p-6', contentContainerClassName)}
            keyboardShouldPersistTaps="handled">
            <>{children}</>
          </ScrollView>
          <DialogPrimitive.Close
            className="absolute right-4 top-4 rounded opacity-70 active:opacity-100"
            // 16pt icon + 16pt on each side = 48dp target; it ends at the frame edge (16pt inset),
            // so it is never clipped by the frame.
            hitSlop={16}>
            <Icon as={X} className="text-accent-foreground size-4 shrink-0" />
            <Text className="sr-only">Close</Text>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogOverlay>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: ViewProps) {
  return (
    <View className={cn('flex flex-col gap-2 text-center sm:text-left', className)} {...props} />
  );
}

function DialogFooter({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn('text-foreground text-lg font-semibold leading-snug', className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
