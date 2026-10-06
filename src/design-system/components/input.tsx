import { cn } from '@/design-system/lib/utils';
import { TextInput } from 'react-native';

/** Invalid field classes: danger border. */
const INVALID_FIELD_CLASS_NAME = 'border-danger';

/**
 * Field classes shared by every text input of the design system. Exported so inputs that must
 * render a different TextInput (e.g. `BottomSheetTextInput` inside a bottom sheet) stay identical.
 */
function inputClassName({
  editable,
  invalid,
  className,
}: { editable?: boolean; invalid?: boolean; className?: string } = {}) {
  return cn(
    'dark:bg-input/30 border-input bg-background text-foreground flex h-10 w-full min-w-0 flex-row items-center rounded-md border px-3 py-1 text-base leading-5 shadow-sm shadow-black/5 sm:h-9',
    editable === false && 'opacity-50',
    // After the base classes so tailwind-merge lets the danger border win.
    invalid && INVALID_FIELD_CLASS_NAME,
    className
  );
}

/** Uniwind maps placeholder color through `placeholderTextColorClassName` (`accent-` prefix). */
const INPUT_PLACEHOLDER_COLOR_CLASS_NAME = 'accent-muted-foreground';

type InputProps = React.ComponentProps<typeof TextInput> &
  React.RefAttributes<TextInput> & {
    /**
     * Marks the value as invalid with a danger border.
     * Error text and its announcement belong to the form (e.g. a helper `Text` below the field).
     */
    invalid?: boolean;
  };

function Input({ className, placeholderTextColorClassName, invalid, ...props }: InputProps) {
  return (
    <TextInput
      className={inputClassName({ editable: props.editable, invalid, className })}
      placeholderTextColorClassName={cn(
        INPUT_PLACEHOLDER_COLOR_CLASS_NAME,
        placeholderTextColorClassName
      )}
      {...props}
    />
  );
}

export {
  Input,
  INPUT_PLACEHOLDER_COLOR_CLASS_NAME,
  INVALID_FIELD_CLASS_NAME,
  inputClassName,
};
export type { InputProps };
