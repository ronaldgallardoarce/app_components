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

/** Text utilities (color, size, weight, spacing, decoration, case), without variants. */
const TEXT_UTILITY_PATTERN =
  /^-?(?:text-|font-|leading-|tracking-|decoration-|underline|line-through|no-underline|italic$|not-italic$|uppercase$|lowercase$|capitalize$|normal-case$)/;

/** Alignment is a layout concern of the label, not something every descendant `Text` inherits. */
const TEXT_ALIGN_PATTERN = /^text-(?:left|center|right|justify|start|end)$/;

/** Strips variants (`sm:`, `data-[state=on]:`, `[&>svg]:`) and the `!` modifier from a class. */
function getUtility(token: string) {
  let depth = 0;
  let start = 0;
  for (let i = 0; i < token.length; i++) {
    const char = token[i];
    if (char === '[' || char === '(') depth++;
    else if (char === ']' || char === ')') depth = Math.max(0, depth - 1);
    else if (char === ':' && depth === 0) start = i + 1;
  }
  return token.slice(start).replace(/^!|!$/g, '');
}

/**
 * Keeps only the text classes of `className`, so a Toggle's `className` can still recolor its label
 * (`text-*`, `font-*`...) without container classes (padding, border, background) leaking into
 * every descendant `Text` through `TextClassContext`. Variants are kept with their class.
 *
 * @example
 * pickTextClasses('px-4 text-red-500 sm:font-bold data-[state=on]:italic text-center')
 * // => 'text-red-500 sm:font-bold data-[state=on]:italic'
 * pickTextClasses('[&>svg]:text-blue-500 bg-muted') // => '[&>svg]:text-blue-500'
 */
function pickTextClasses(className: string | undefined) {
  return className
    ?.split(/\s+/)
    .filter((token) => {
      const utility = getUtility(token);
      return TEXT_UTILITY_PATTERN.test(utility) && !TEXT_ALIGN_PATTERN.test(utility);
    })
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

export { Toggle, ToggleIcon, toggleVariants };
