import { TextClassContext } from '@/design-system/components/text';
import { cn } from '@/design-system/lib/utils';
import { Slot } from '@rn-primitives/slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { View } from 'react-native';

// Based on React Native Reusables' Uniwind badge. RNR's `default` is `primary` and
// `destructive` is `danger`; `success`, `warning` and `info` are project additions.
// `*-soft` variants are low-emphasis tinted badges built on the `*-soft` tokens.

const badgeVariants = cva(
  'border-border shrink-0 flex-row items-center justify-center gap-1 overflow-hidden rounded-full border px-2 py-0.5',
  {
    variants: {
      variant: {
        primary: 'bg-primary border-transparent',
        secondary: 'bg-secondary border-transparent',
        outline: '',
        danger: 'bg-danger border-transparent',
        success: 'bg-success border-transparent',
        warning: 'bg-warning border-transparent',
        info: 'bg-info border-transparent',
        'danger-soft': 'bg-danger-soft border-danger-border',
        'success-soft': 'bg-success-soft border-success-border',
        'warning-soft': 'bg-warning-soft border-warning-border',
        'info-soft': 'bg-info-soft border-info-border',
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
      'danger-soft': 'text-danger-soft-foreground',
      'success-soft': 'text-success-soft-foreground',
      'warning-soft': 'text-warning-soft-foreground',
      'info-soft': 'text-info-soft-foreground',
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
