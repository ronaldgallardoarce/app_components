import {
  buttonTextVariants,
  buttonVariants,
  type ButtonVariant,
} from '@/design-system/components/button';
import { AnimatedPressable } from '@/design-system/components/animated-pressable';
import { TextClassContext } from '@/design-system/components/text';
import { usePressed } from '@/design-system/lib/use-pressed';
import { cn } from '@/design-system/lib/utils';
import * as AlertDialogPrimitive from '@rn-primitives/alert-dialog';
import * as React from 'react';
import { Platform, View, type ViewProps } from 'react-native';
import { FadeIn, FadeOut, ReduceMotion } from 'react-native-reanimated';
import { FullWindowOverlay as RNFullWindowOverlay } from 'react-native-screens';

const AlertDialog = AlertDialogPrimitive.Root;

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = AlertDialogPrimitive.Portal;

const FullWindowOverlay = Platform.OS === 'ios' ? RNFullWindowOverlay : React.Fragment;

function AlertDialogOverlay({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof AlertDialogPrimitive.Overlay>, 'asChild'> & {
    children?: React.ReactNode;
  }) {
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
          <>{children}</>
        </AnimatedPressable>
      </AlertDialogPrimitive.Overlay>
    </FullWindowOverlay>
  );
}

function AlertDialogContent({
  className,
  portalHost,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content> & {
    portalHost?: string;
  }) {
  return (
    <AlertDialogPortal hostName={portalHost}>
      <AlertDialogOverlay>
        <AlertDialogPrimitive.Content
          className={cn(
            'bg-background border-border z-50 flex flex-col gap-4 rounded-lg border p-6 shadow-lg shadow-black/5 sm:max-w-lg',
            className
          )}
          {...props}
        />
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

// Free tier: the pressed state (`usePressed`) feeds `buttonTextVariants` instead of
// `group-active:`, matching Button. `className` styles the container only.
function AlertDialogAction({
  className,
  variant = 'primary',
  onPressIn,
  onPressOut,
  ...props
}: AlertDialogActionProps) {
  const { pressed, pressHandlers } = usePressed({ onPressIn, onPressOut });
  return (
    <TextClassContext.Provider value={buttonTextVariants({ variant, pressed })}>
      <AlertDialogPrimitive.Action
        className={cn(buttonVariants({ variant }), className)}
        {...props}
        {...pressHandlers}
      />
    </TextClassContext.Provider>
  );
}

function AlertDialogCancel({
  className,
  onPressIn,
  onPressOut,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  const { pressed, pressHandlers } = usePressed({ onPressIn, onPressOut });
  return (
    <TextClassContext.Provider value={buttonTextVariants({ variant: 'outline', pressed })}>
      <AlertDialogPrimitive.Cancel
        className={cn(buttonVariants({ variant: 'outline' }), className)}
        {...props}
        {...pressHandlers}
      />
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
