import { Icon } from '@/design-system/components/icon';
import { Text, TextClassContext } from '@/design-system/components/text';
import { cn } from '@/design-system/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

// Based on React Native Reusables' Uniwind alert. RNR's `destructive` variant is `danger`;
// `success`, `warning` and `info` follow the same pattern with their `*-text` tokens.

/** Title/body/icon color per variant (colored text on `card` uses the `*-text` tokens). */
const alertTextVariants = cva('text-sm text-foreground', {
  variants: {
    variant: {
      default: '',
      danger: 'text-danger-text',
      success: 'text-success-text',
      warning: 'text-warning-text',
      info: 'text-info-text',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

/** Description color: muted for `default`, the status color slightly faded otherwise (RNR pattern). */
const alertDescriptionVariants = cva('', {
  variants: {
    variant: {
      default: 'text-muted-foreground',
      danger: 'text-danger-text/90',
      success: 'text-success-text/90',
      warning: 'text-warning-text/90',
      info: 'text-info-text/90',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type AlertVariant = NonNullable<VariantProps<typeof alertTextVariants>['variant']>;

const AlertVariantContext = React.createContext<AlertVariant>('default');

type AlertProps = React.ComponentProps<typeof View> &
  React.RefAttributes<View> & {
    icon: LucideIcon;
    variant?: AlertVariant;
    iconClassName?: string;
  };

function Alert({
  className,
  variant = 'default',
  children,
  icon,
  iconClassName,
  ...props
}: AlertProps) {
  const textClass = alertTextVariants({ variant });
  return (
    <AlertVariantContext.Provider value={variant}>
      <TextClassContext.Provider value={textClass}>
        <View
          role="alert"
          // Android live region (RN `aria-live`, Android only): TalkBack announces the alert when it
          // appears or its text changes. `danger` interrupts; the rest wait for current speech.
          aria-live={variant === 'danger' ? 'assertive' : 'polite'}
          className={cn(
            'bg-card border-border relative w-full rounded-lg border px-4 pb-2 pt-3.5',
            className
          )}
          {...props}
        >
          <View className="absolute left-3.5 top-3">
            <Icon as={icon} className={cn('size-4', textClass, iconClassName)} />
          </View>
          {children}
        </View>
      </TextClassContext.Provider>
    </AlertVariantContext.Provider>
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn('mb-1 ml-0.5 min-h-4 pl-6 font-medium leading-snug tracking-tight', className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<typeof Text>) {
  const variant = React.useContext(AlertVariantContext);
  return (
    <Text
      className={cn(
        'ml-0.5 pb-1.5 pl-6 text-sm leading-relaxed',
        alertDescriptionVariants({ variant }),
        className
      )}
      {...props}
    />
  );
}

export { Alert, AlertDescription, AlertTitle, alertTextVariants };
export type { AlertProps, AlertVariant };
