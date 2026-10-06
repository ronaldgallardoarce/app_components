import { Text, TextClassContext } from '@/design-system/components/text';
import { cn } from '@/design-system/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { ActivityIndicator, Platform, Pressable } from 'react-native';

// Based on React Native Reusables' Uniwind button. Pressed text styles do NOT use
// `group-active:` (Uniwind Pro only); the Pressable `pressed` state is passed to
// `buttonTextVariants` instead (see `Button`).
const buttonVariants = cva(
  cn(
    'shrink-0 flex-row items-center justify-center gap-2 rounded-md shadow-none',
    Platform.select({
      web: "group focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-danger/20 dark:aria-invalid:ring-danger/40 aria-invalid:border-danger whitespace-nowrap outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    })
  ),
  {
    variants: {
      variant: {
        primary: cn(
          'bg-primary active:bg-primary/90 shadow-sm shadow-black/5',
          Platform.select({ web: 'hover:bg-primary/90' })
        ),
        secondary: cn(
          'bg-secondary active:bg-secondary/80 shadow-sm shadow-black/5',
          Platform.select({ web: 'hover:bg-secondary/80' })
        ),
        outline: cn(
          'border-border bg-background active:bg-accent dark:bg-input/30 dark:border-input dark:active:bg-input/50 border shadow-sm shadow-black/5',
          Platform.select({
            web: 'hover:bg-accent dark:hover:bg-input/50',
          })
        ),
        ghost: cn(
          'active:bg-accent dark:active:bg-accent/50',
          Platform.select({ web: 'hover:bg-accent dark:hover:bg-accent/50' })
        ),
        link: '',
        danger: cn(
          'bg-danger active:bg-danger/90 shadow-sm shadow-black/5',
          Platform.select({
            web: 'hover:bg-danger/90 focus-visible:ring-danger/20 dark:focus-visible:ring-danger/40',
          })
        ),
        success: cn(
          'bg-success active:bg-success/90 shadow-sm shadow-black/5',
          Platform.select({ web: 'hover:bg-success/90' })
        ),
        warning: cn(
          'bg-warning active:bg-warning/90 shadow-sm shadow-black/5',
          Platform.select({ web: 'hover:bg-warning/90' })
        ),
        info: cn(
          'bg-info active:bg-info/90 shadow-sm shadow-black/5',
          Platform.select({ web: 'hover:bg-info/90' })
        ),
      },
      size: {
        default: cn('h-10 px-4 py-2 sm:h-9', Platform.select({ web: 'has-[>svg]:px-3' })),
        sm: cn('h-9 gap-1.5 rounded-md px-3 sm:h-8', Platform.select({ web: 'has-[>svg]:px-2.5' })),
        lg: cn('h-11 rounded-md px-6 sm:h-10', Platform.select({ web: 'has-[>svg]:px-4' })),
        icon: 'h-10 w-10 sm:h-9 sm:w-9',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

const buttonTextVariants = cva(
  cn(
    'text-foreground text-sm font-medium',
    Platform.select({ web: 'pointer-events-none transition-colors' })
  ),
  {
    variants: {
      variant: {
        primary: 'text-primary-foreground',
        secondary: 'text-secondary-foreground',
        outline: Platform.select({ web: 'group-hover:text-accent-foreground' }) ?? '',
        ghost: Platform.select({ web: 'group-hover:text-accent-foreground' }) ?? '',
        link: cn(
          'text-primary',
          Platform.select({ web: 'underline-offset-4 hover:underline group-hover:underline' })
        ),
        danger: 'text-danger-foreground',
        success: 'text-success-foreground',
        warning: 'text-warning-foreground',
        info: 'text-info-foreground',
      },
      size: {
        default: '',
        sm: '',
        lg: '',
        icon: '',
      },
      /** Pressable `pressed` state (Free-tier replacement for `group-active:`). */
      pressed: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      { variant: ['outline', 'ghost'], pressed: true, className: 'text-accent-foreground' },
      { variant: 'link', pressed: true, className: 'underline' },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'default',
      pressed: false,
    },
  }
);

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

type ButtonVariant = NonNullable<ButtonVariantProps['variant']>;
type ButtonSize = NonNullable<ButtonVariantProps['size']>;

/** Spinner color = the variant's label color token (Uniwind `colorClassName` + `accent-`). */
const SPINNER_COLOR_CLASS_NAME = {
  primary: 'accent-primary-foreground',
  secondary: 'accent-secondary-foreground',
  outline: 'accent-foreground',
  ghost: 'accent-foreground',
  link: 'accent-primary',
  danger: 'accent-danger-foreground',
  success: 'accent-success-foreground',
  warning: 'accent-warning-foreground',
  info: 'accent-info-foreground',
} as const satisfies Record<ButtonVariant, string>;

type ButtonBaseProps = Omit<React.ComponentProps<typeof Pressable>, 'children'> & {
  /** Visual style. Defaults to `primary`. */
  variant?: ButtonVariant;
  /** Shows a spinner before the label, disables the button and marks it busy. */
  loading?: boolean;
  /** Strings and numbers are wrapped in `Text`; any `Text` inside inherits the label classes. */
  children?: React.ReactNode;
};

/** Icon-only buttons have no visible label, so an accessibility label is required. */
type ButtonProps = ButtonBaseProps &
  (
    | { size: 'icon'; accessibilityLabel: string }
    | { size?: Exclude<ButtonSize, 'icon'>; accessibilityLabel?: string }
  );

const isTextLike = (child: React.ReactNode): child is string | number =>
  typeof child === 'string' || typeof child === 'number';

/**
 * RN crashes on raw strings outside `Text`. Text-only children (e.g. `Save {count}`) render
 * as a single `Text`; mixed children (e.g. an icon plus a label) get each string wrapped.
 */
function renderLabel(children: React.ReactNode) {
  const items = React.Children.toArray(children);
  if (items.length > 0 && items.every(isTextLike)) {
    return <Text>{children}</Text>;
  }
  return React.Children.map(children, (child) => (isTextLike(child) ? <Text>{child}</Text> : child));
}

function Button({
  className,
  variant = 'primary',
  size = 'default',
  loading = false,
  disabled,
  accessibilityState,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = Boolean(disabled) || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ ...accessibilityState, disabled: isDisabled, busy: loading }}
      className={cn(isDisabled && 'opacity-50', buttonVariants({ variant, size }), className)}
      disabled={isDisabled}
      {...props}
    >
      {({ pressed }) => (
        <TextClassContext.Provider value={buttonTextVariants({ variant, size, pressed })}>
          {loading && (
            <ActivityIndicator size="small" colorClassName={SPINNER_COLOR_CLASS_NAME[variant]} />
          )}
          {renderLabel(children)}
        </TextClassContext.Provider>
      )}
    </Pressable>
  );
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps, ButtonSize, ButtonVariant };
