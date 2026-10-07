import { cn } from '@/design-system/lib/utils';
import * as SwitchPrimitives from '@rn-primitives/switch';

/**
 * The track is 32 x 18.4dp (RNR visual size); the slop grows the touch target to 48 x 48dp.
 * Per the React Native docs it never extends past the parent view, so give the row vertical room.
 */
const SWITCH_HIT_SLOP = { top: 15, bottom: 15, left: 8, right: 8 } as const;

function Switch({
  className,
  hitSlop = SWITCH_HIT_SLOP,
  ...props
}: React.ComponentProps<typeof SwitchPrimitives.Root>) {
  return (
    <SwitchPrimitives.Root
      className={cn(
        'flex h-[1.15rem] w-8 shrink-0 flex-row items-center rounded-full border border-transparent shadow-sm shadow-black/5',

        // Unchecked track uses `input-border` (>= 3:1 on background) so the off state is visible.
        props.checked ? 'bg-primary' : 'bg-input-border',
        props.disabled && 'opacity-50',
        className
      )}
      hitSlop={hitSlop}
      {...props}>
      <SwitchPrimitives.Thumb
        className={cn(
          'bg-background size-4 rounded-full',

          props.checked
            ? 'dark:bg-primary-foreground translate-x-3.5'
            : 'dark:bg-foreground translate-x-0'
        )}
      />
    </SwitchPrimitives.Root>
  );
}

export { Switch };
