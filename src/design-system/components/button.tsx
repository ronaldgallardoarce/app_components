import { Text, TextClassContext } from '@/design-system/components/text';
import { cn } from '@/design-system/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { ActivityIndicator, Pressable } from 'react-native';

// Based on React Native Reusables' Uniwind button. Pressed text styles do NOT use
// `group-active:` (Uniwind Pro only); the Pressable `pressed` state is passed to
// `buttonTextVariants` instead (see `Button`).
const buttonVariants = cva(
  'shrink-0 flex-row items-center justify-center gap-2 rounded-md shadow-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary active:bg-primary/90 shadow-sm shadow-black/5',
        secondary: 'bg-secondary active:bg-secondary/80 shadow-sm shadow-black/5',
        outline:
          'border-border bg-background active:bg-accent dark:bg-input/30 dark:border-input dark:active:bg-input/50 border shadow-sm shadow-black/5',
        ghost: 'active:bg-accent dark:active:bg-accent/50',
        link: '',
        danger: 'bg-danger active:bg-danger/90 shadow-sm shadow-black/5',
        success: 'bg-success active:bg-success/90 shadow-sm shadow-black/5',
        warning: 'bg-warning active:bg-warning/90 shadow-sm shadow-black/5',
        info: 'bg-info active:bg-info/90 shadow-sm shadow-black/5',
      },
      size: {
        default: 'h-10 px-4 py-2 sm:h-9',
        sm: 'h-9 gap-1.5 rounded-md px-3 sm:h-8',
        lg: 'h-11 rounded-md px-6 sm:h-10',
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
  'text-foreground text-sm font-medium',
  {
    variants: {
      variant: {
        primary: 'text-primary-foreground',
        secondary: 'text-secondary-foreground',
        outline: '',
        ghost: '',
        link: 'text-primary',
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
