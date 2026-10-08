import { renderTextChildren, TextClassContext } from '@/design-system/components/text';
import { FOCUS_RING_CLASS_NAME, useFocusRing } from '@/design-system/lib/use-focus-ring';
import { cn } from '@/design-system/lib/utils';
import * as TabsPrimitive from '@rn-primitives/tabs';

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root className={cn('flex flex-col gap-2', className)} {...props} />;
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        'bg-muted mr-auto flex min-h-9 flex-row items-center justify-center rounded-lg p-[3px]',
        className
      )}
      {...props}
    />
  );
}

/**
 * Triggers are ~30dp tall inside the 36dp list. Vertical-only slop (9dp) brings the target to 48dp
 * without overlapping the neighboring triggers. Per the React Native docs the touch area never
 * extends past the parent view, so the part beyond the list's own bounds may not respond.
 */
const TABS_TRIGGER_HIT_SLOP = { top: 9, bottom: 9 } as const;

function TabsTrigger({
  className,
  hitSlop = TABS_TRIGGER_HIT_SLOP,
  onFocus,
  onBlur,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const { value } = TabsPrimitive.useRootContext();
  const { focused, focusHandlers } = useFocusRing({ onFocus, onBlur });
  return (
    <TextClassContext.Provider
      value={cn(
        'text-foreground dark:text-muted-foreground text-sm font-medium',
        value === props.value && 'dark:text-foreground'
      )}>
      <TabsPrimitive.Trigger
        className={cn(
          'flex flex-row items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 shadow-none shadow-black/5',

          props.disabled && 'opacity-50',
          props.value === value && 'bg-background dark:border-foreground/10 dark:bg-input/30',
          focused && FOCUS_RING_CLASS_NAME,
          className
        )}
        hitSlop={hitSlop}
        {...props}
        {...focusHandlers}>
        {/* Strings are wrapped in `Text` (like `Button`); render functions pass through. */}
        {typeof children === 'function' || props.asChild ? children : renderTextChildren(children)}
      </TabsPrimitive.Trigger>
    </TextClassContext.Provider>
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={className} {...props} />;
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
