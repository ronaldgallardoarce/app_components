import { cn } from '@/design-system/lib/utils';
import * as RadioGroupPrimitive from '@rn-primitives/radio-group';

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root className={cn('gap-3', className)} {...props} />;
}

/** 16dp control + 16dp on each side = 48dp touch target (bounded by the parent, see Switch). */
const RADIO_HIT_SLOP = 16;

function RadioGroupItem({
  className,
  hitSlop = RADIO_HIT_SLOP,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        'border-input-border dark:bg-input/30 aspect-square size-4 shrink-0 items-center justify-center rounded-full border shadow-sm shadow-black/5',
        props.disabled && 'opacity-50',
        className
      )}
      hitSlop={hitSlop}
      {...props}>
      <RadioGroupPrimitive.Indicator className="bg-primary size-2 rounded-full" />
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
