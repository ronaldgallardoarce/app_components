import { cn } from '@/design-system/lib/utils';
import { Platform, TextInput } from 'react-native';

function Input({
  className,
  placeholderTextColorClassName,
  ...props
}: React.ComponentProps<typeof TextInput> & React.RefAttributes<TextInput>) {
  return (
    <TextInput
      className={cn(
        'dark:bg-input/30 border-input bg-background text-foreground flex h-10 w-full min-w-0 flex-row items-center rounded-md border px-3 py-1 text-base leading-5 shadow-sm shadow-black/5 sm:h-9',
        props.editable === false &&
          cn(
            'opacity-50',
            Platform.select({ web: 'disabled:pointer-events-none disabled:cursor-not-allowed' })
          ),
        Platform.select({
          web: cn(
            'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground outline-none transition-[color,box-shadow] md:text-sm',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            'aria-invalid:ring-danger/20 dark:aria-invalid:ring-danger/40 aria-invalid:border-danger'
          ),
        }),
        className
      )}
      // Uniwind maps placeholder color through `placeholderTextColorClassName` (`accent-` prefix).
      placeholderTextColorClassName={cn('accent-muted-foreground', placeholderTextColorClassName)}
      {...props}
    />
  );
}

export { Input };
