import { Icon } from '@/design-system/components/icon';
import { AnimatedPressable } from '@/design-system/components/animated-pressable';
import { renderTextChildren, TextClassContext } from '@/design-system/components/text';
import { useOverlayInsets } from '@/design-system/lib/use-overlay-insets';
import { usePressed } from '@/design-system/lib/use-pressed';
import { cn } from '@/design-system/lib/utils';
import * as DropdownMenuPrimitive from '@rn-primitives/dropdown-menu';
import { Check, ChevronDown, ChevronUp } from 'lucide-react-native';
import * as React from 'react';
import {
  Platform,
  ScrollView,
  type StyleProp,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type ViewStyle,
} from 'react-native';
import Animated, { FadeIn, ReduceMotion } from 'react-native-reanimated';
import { FullWindowOverlay as RNFullWindowOverlay } from 'react-native-screens';

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

// Touch targets: menu rows sit edge to edge inside an `overflow-hidden` panel, so `hitSlop` would
// overlap the neighbors and be clipped. Rows use `min-h-12` (48dp) instead; padding and text keep
// RNR's values, and the rows still grow with the font scale.

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  iconClassName,
  onPressIn,
  onPressOut,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
    children?: React.ReactNode;
    iconClassName?: string;
    inset?: boolean;
  }) {
  const { open } = DropdownMenuPrimitive.useSubContext();
  // Free tier: pressed state replaces RNR's `group-active:text-accent-foreground`.
  const { pressed, pressHandlers } = usePressed({ onPressIn, onPressOut });
  const icon = open ? ChevronUp : ChevronDown;
  return (
    <TextClassContext.Provider value={cn('text-sm', (open || pressed) && 'text-accent-foreground')}>
      <DropdownMenuPrimitive.SubTrigger
        className={cn(
          'active:bg-accent flex min-h-12 flex-row items-center justify-between gap-2 rounded-sm px-2 py-2 sm:py-1.5',
          className,
          open && 'bg-accent',
          inset && 'pl-8'
        )}
        {...props}
        {...pressHandlers}>
        {/* Wrapped so a long label wraps instead of pushing the chevron out (see AccordionTrigger). */}
        <View className="min-w-0 flex-1">{renderTextChildren(children)}</View>
        <Icon as={icon} className={cn('text-foreground size-4 shrink-0', iconClassName)} />
      </DropdownMenuPrimitive.SubTrigger>
    </TextClassContext.Provider>
  );
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <Animated.View entering={FadeIn.reduceMotion(ReduceMotion.System)}>
      <DropdownMenuPrimitive.SubContent
        className={cn(
          'bg-popover border-border overflow-hidden rounded-md border p-1 shadow-lg shadow-black/5',
          className
        )}
        {...props}
      />
    </Animated.View>
  );
}

const FullWindowOverlay = Platform.OS === 'ios' ? RNFullWindowOverlay : React.Fragment;

/**
 * Safe area: each side of `insets` left undefined defaults to the safe-area inset (see
 * `PopoverContent`). The panel is capped at the height between the top and bottom insets and its
 * items scroll, so a long menu never runs off screen; short menus look and size as before.
 */
function DropdownMenuContent({
  className,
  overlayClassName,
  overlayStyle,
  portalHost,
  insets,
  style,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content> & {
    overlayStyle?: StyleProp<ViewStyle>;
    overlayClassName?: string;
    portalHost?: string;
  }) {
  const avoidInsets = useOverlayInsets(insets);
  const { height: windowHeight } = useWindowDimensions();
  const maxHeight = Math.max(0, windowHeight - avoidInsets.top - avoidInsets.bottom);
  return (
    <DropdownMenuPrimitive.Portal hostName={portalHost}>
      <FullWindowOverlay>
        <DropdownMenuPrimitive.Overlay
          style={
            overlayStyle
              ? StyleSheet.flatten([
                StyleSheet.absoluteFill,
                overlayStyle as typeof StyleSheet.absoluteFill,
              ])
              : StyleSheet.absoluteFill
          }
          className={overlayClassName}
          asChild>
          <AnimatedPressable entering={FadeIn.reduceMotion(ReduceMotion.System)}>
            <TextClassContext.Provider value="text-popover-foreground">
              <DropdownMenuPrimitive.Content
                className={cn(
                  'bg-popover border-border min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-lg shadow-black/5',
                  className
                )}
                insets={avoidInsets}
                style={{ maxHeight, ...StyleSheet.flatten(style) }}
                {...props}>
                <ScrollView className="grow-0" bounces={false}>
                  <>{children}</>
                </ScrollView>
              </DropdownMenuPrimitive.Content>
            </TextClassContext.Provider>
          </AnimatedPressable>
        </DropdownMenuPrimitive.Overlay>
      </FullWindowOverlay>
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuItem({
  className,
  inset,
  variant,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
    className?: string;
    inset?: boolean;
    variant?: 'default' | 'danger';
  }) {
  return (
    <TextClassContext.Provider
      value={cn(
        // `shrink`: Yoga gives Text `flexShrink: 0`, so a long label would push a trailing
        // `DropdownMenuShortcut` out of the row; shrinking lets the label wrap instead.
        'text-sm text-popover-foreground shrink',
        variant === 'danger' && 'text-danger-text'
      )}>
      <DropdownMenuPrimitive.Item
        className={cn(
          'active:bg-accent relative flex min-h-12 flex-row items-center gap-2 rounded-sm px-2 py-2 sm:py-1.5',
          variant === 'danger' && 'active:bg-danger/10 dark:active:bg-danger/20',
          props.disabled && 'opacity-50',
          inset && 'pl-8',
          className
        )}
        {...props}>
        {/* Strings are wrapped in `Text` (like `Button`); render functions pass through. */}
        {typeof children === 'function' || props.asChild ? children : renderTextChildren(children)}
      </DropdownMenuPrimitive.Item>
    </TextClassContext.Provider>
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  onPressIn,
  onPressOut,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem> & {
    children?: React.ReactNode;
  }) {
  // Free tier: pressed state replaces RNR's `group-active:text-accent-foreground`.
  const { pressed, pressHandlers } = usePressed({ onPressIn, onPressOut });
  return (
    <TextClassContext.Provider
      value={cn('text-sm text-popover-foreground shrink', pressed && 'text-accent-foreground')}>
      <DropdownMenuPrimitive.CheckboxItem
        className={cn(
          'active:bg-accent relative flex min-h-12 flex-row items-center gap-2 rounded-sm py-2 pl-8 pr-2 sm:py-1.5',
          props.disabled && 'opacity-50',
          className
        )}
        {...props}
        {...pressHandlers}>
        <View className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <DropdownMenuPrimitive.ItemIndicator>
            <Icon as={Check} className="text-foreground size-4" />
          </DropdownMenuPrimitive.ItemIndicator>
        </View>
        <>{renderTextChildren(children)}</>
      </DropdownMenuPrimitive.CheckboxItem>
    </TextClassContext.Provider>
  );
}

function DropdownMenuRadioItem({
  className,
  children,
  onPressIn,
  onPressOut,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem> & {
    children?: React.ReactNode;
  }) {
  // Free tier: pressed state replaces RNR's `group-active:text-accent-foreground`.
  const { pressed, pressHandlers } = usePressed({ onPressIn, onPressOut });
  return (
    <TextClassContext.Provider
      value={cn('text-sm text-popover-foreground shrink', pressed && 'text-accent-foreground')}>
      <DropdownMenuPrimitive.RadioItem
        className={cn(
          'active:bg-accent relative flex min-h-12 flex-row items-center gap-2 rounded-sm py-2 pl-8 pr-2 sm:py-1.5',
          props.disabled && 'opacity-50',
          className
        )}
        {...props}
        {...pressHandlers}>
        <View className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <DropdownMenuPrimitive.ItemIndicator>
            <View className="bg-foreground h-2 w-2 rounded-full" />
          </DropdownMenuPrimitive.ItemIndicator>
        </View>
        <>{renderTextChildren(children)}</>
      </DropdownMenuPrimitive.RadioItem>
    </TextClassContext.Provider>
  );
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
    className?: string;
    inset?: boolean;
  }) {
  return (
    <DropdownMenuPrimitive.Label
      className={cn(
        'text-foreground px-2 py-2 text-sm font-medium sm:py-1.5',
        inset && 'pl-8',
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      className={cn('bg-border -mx-1 my-1 h-px', className)}
      {...props}
    />
  );
}

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn('text-muted-foreground ml-auto shrink-0 text-xs tracking-widest', className)}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
