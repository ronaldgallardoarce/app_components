import { cn } from '@/design-system/lib/utils';
import { Slot } from '@rn-primitives/slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Platform, Text as RNText, type Role } from 'react-native';

const textVariants = cva(
  cn(
    'text-foreground text-base',
    Platform.select({
      web: 'select-text',
    })
  ),
  {
    variants: {
      variant: {
        default: '',
        h1: cn(
          'text-center text-4xl font-extrabold tracking-tight',
          Platform.select({ web: 'scroll-m-20 text-balance' })
        ),
        h2: cn(
          'border-border border-b pb-2 text-3xl font-semibold tracking-tight',
          Platform.select({ web: 'scroll-m-20 first:mt-0' })
        ),
        h3: cn('text-2xl font-semibold tracking-tight', Platform.select({ web: 'scroll-m-20' })),
        h4: cn('text-xl font-semibold tracking-tight', Platform.select({ web: 'scroll-m-20' })),
        p: 'mt-3 leading-7 sm:mt-6',
        blockquote: 'mt-4 border-l-2 pl-3 italic sm:mt-6 sm:pl-6',
        code: cn(
          'bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold'
        ),
        lead: 'text-muted-foreground text-xl',
        large: 'text-lg font-semibold',
        small: 'text-sm font-medium leading-none',
        muted: 'text-muted-foreground text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Semantic color. Applied after the variant and the inherited `TextClassContext` class,
 * so an explicit `tone` always wins over both (only `className` overrides it).
 */
const textToneVariants = cva('', {
  variants: {
    tone: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      danger: 'text-danger-text',
      success: 'text-success-text',
      warning: 'text-warning-text',
      info: 'text-info-text',
    },
  },
});

type TextVariantProps = VariantProps<typeof textVariants>;

type TextVariant = NonNullable<TextVariantProps['variant']>;

type TextTone = NonNullable<VariantProps<typeof textToneVariants>['tone']>;

type TextProps = React.ComponentProps<typeof RNText> &
  TextVariantProps & {
    /** Semantic color; when omitted the variant/inherited color is used. */
    tone?: TextTone;
    asChild?: boolean;
  };

const ROLE: Partial<Record<TextVariant, Role>> = {
  h1: 'heading',
  h2: 'heading',
  h3: 'heading',
  h4: 'heading',
  blockquote: Platform.select({ web: 'blockquote' as Role }),
  code: Platform.select({ web: 'code' as Role }),
};

const ARIA_LEVEL: Partial<Record<TextVariant, string>> = {
  h1: '1',
  h2: '2',
  h3: '3',
  h4: '4',
};

/**
 * Default text classes a parent (e.g. Button) provides to every descendant `Text`.
 * Order: variant -> context -> tone -> className.
 */
const TextClassContext = React.createContext<string | undefined>(undefined);

function Text({ className, asChild = false, variant = 'default', tone, ...props }: TextProps) {
  const textClass = React.useContext(TextClassContext);
  const Component = asChild ? Slot : RNText;
  return (
    <Component
      className={cn(
        textVariants({ variant }),
        textClass,
        tone !== undefined && textToneVariants({ tone }),
        className
      )}
      // RN maps role "heading" to accessibilityRole "header" on native.
      role={variant ? ROLE[variant] : undefined}
      aria-level={variant ? ARIA_LEVEL[variant] : undefined}
      {...props}
    />
  );
}

export { Text, TextClassContext, textVariants, textToneVariants };
export type { TextProps, TextTone, TextVariant };
