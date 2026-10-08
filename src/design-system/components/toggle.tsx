import { Icon } from '@/design-system/components/icon';
import { renderTextChildren, TextClassContext } from '@/design-system/components/text';
import { FOCUS_RING_CLASS_NAME, useFocusRing } from '@/design-system/lib/use-focus-ring';
import { cn } from '@/design-system/lib/utils';
import * as TogglePrimitive from '@rn-primitives/toggle';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const toggleVariants = cva(
  'active:bg-muted flex flex-row items-center justify-center gap-2 rounded-md',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline: 'border-input active:bg-accent border bg-transparent shadow-sm shadow-black/5',
      },
      size: {
        default: 'h-10 min-w-10 px-2.5 sm:h-9 sm:min-w-9 sm:px-2',
        sm: 'h-9 min-w-9 px-2 sm:h-8 sm:min-w-8 sm:px-1.5',
        lg: 'h-11 min-w-11 px-3 sm:h-10 sm:min-w-10 sm:px-2.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Extra touch area per size so the target is >= 48dp at the smallest visual size (`sm:` breakpoint):
 * (48 - height) / 2. Only `Toggle` uses it; `ToggleGroupItem`s sit edge to edge, where a horizontal
 * slop would overlap the neighbor.
 */
const TOGGLE_HIT_SLOP = { default: 6, sm: 8, lg: 4 } as const;

/** Text utilities (color, size, weight, spacing, decoration, case), with or without variants. */
const TEXT_CLASS_PATTERN =
  /^!?(?:[\w-]+:)*!?(?:text-|font-|leading-|tracking-|decoration-|underline|line-through|no-underline|italic$|not-italic$|uppercase$|lowercase$|capitalize$|normal-case$)/;

/**
 * Keeps only the text classes of `className`, so a Toggle's `className` can still recolor its label
 * (`text-*`, `font-*`...) without container classes (padding, border, background) leaking into
 * every descendant `Text` through `TextClassContext`.
 */
function pickTextClasses(className: string | undefined) {
  return className
    ?.split(/\s+/)
    .filter((token) => TEXT_CLASS_PATTERN.test(token))
    .join(' ');
}

function Toggle({
  className,
  variant,
  size,
  hitSlop,
  onFocus,
  onBlur,
  children,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) {
  const { focused, focusHandlers } = useFocusRing({ onFocus, onBlur });
  return (
    <TextClassContext.Provider
      value={cn(
        'text-sm text-foreground font-medium',
        props.pressed && 'text-accent-foreground',
        pickTextClasses(className)
      )}>
      <TogglePrimitive.Root
        className={cn(
          toggleVariants({ variant, size }),
          props.disabled && 'opacity-50',
          props.pressed && 'bg-accent',
          focused && FOCUS_RING_CLASS_NAME,
          className
        )}
        hitSlop={hitSlop ?? TOGGLE_HIT_SLOP[size ?? 'default']}
        {...props}
        {...focusHandlers}>
        {/* Strings are wrapped in `Text` (like `Button`); render functions pass through. */}
        {typeof children === 'function' || props.asChild ? children : renderTextChildren(children)}
      </TogglePrimitive.Root>
    </TextClassContext.Provider>
  );
}

function ToggleIcon({ className, ...props }: React.ComponentProps<typeof Icon>) {
  const textClass = React.useContext(TextClassContext);
  return <Icon className={cn('size-4 shrink-0', textClass, className)} {...props} />;
}

export { pickTextClasses, Toggle, ToggleIcon, toggleVariants };
