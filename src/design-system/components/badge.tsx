import { TextClassContext } from '@/design-system/components/text';
import { cn } from '@/design-system/lib/utils';
import { Slot } from '@rn-primitives/slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Platform, View } from 'react-native';

// Based on React Native Reusables' Uniwind badge. RNR's `default` is `primary` and
// `destructive` is `danger`; `success`, `warning` and `info` are project additions.

const badgeVariants = cva(
  cn(
    'border-border shrink-0 flex-row items-center justify-center gap-1 overflow-hidden rounded-full border px-2 py-0.5',
    Platform.select({
      web: 'group focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-danger/20 dark:aria-invalid:ring-danger/40 aria-invalid:border-danger w-fit whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3',
    })
  ),
  {
    variants: {
      variant: {
        primary: cn(
          'bg-primary border-transparent',
          Platform.select({ web: '[a&]:hover:bg-primary/90' })
        ),
        secondary: cn(
          'bg-secondary border-transparent',
          Platform.select({ web: '[a&]:hover:bg-secondary/90' })
        ),
        outline: Platform.select({ web: '[a&]:hover:bg-accent [a&]:hover:text-accent-foreground' }),
        danger: cn(
          'bg-danger border-transparent',
          Platform.select({ web: '[a&]:hover:bg-danger/90' })
        ),
        success: cn(
          'bg-success border-transparent',
          Platform.select({ web: '[a&]:hover:bg-success/90' })
        ),
        warning: cn(
          'bg-warning border-transparent',
          Platform.select({ web: '[a&]:hover:bg-warning/90' })
        ),
        info: cn('bg-info border-transparent', Platform.select({ web: '[a&]:hover:bg-info/90' })),
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
);

const badgeTextVariants = cva('text-xs font-medium', {
  variants: {
    variant: {
      primary: 'text-primary-foreground',
      secondary: 'text-secondary-foreground',
      outline: 'text-foreground',
      danger: 'text-danger-foreground',
      success: 'text-success-foreground',
      warning: 'text-warning-foreground',
      info: 'text-info-foreground',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>;

type BadgeProps = React.ComponentProps<typeof View> &
  React.RefAttributes<View> & {
    asChild?: boolean;
  } & VariantProps<typeof badgeVariants>;

function Badge({ className, variant, asChild, ...props }: BadgeProps) {
  const Component = asChild ? Slot : View;
  return (
    <TextClassContext.Provider value={badgeTextVariants({ variant })}>
      <Component className={cn(badgeVariants({ variant }), className)} {...props} />
    </TextClassContext.Provider>
  );
}

export { Badge, badgeTextVariants, badgeVariants };
export type { BadgeProps, BadgeVariant };
