import { Text } from '@/design-system/components/text';
import {
  FieldError,
  fieldErrorHint,
  INVALID_FIELD_CLASS_NAME,
} from '@/design-system/components/input';
import { cn } from '@/design-system/lib/utils';
import * as React from 'react';
import { TextInput, View } from 'react-native';

type TextareaProps = React.ComponentProps<typeof TextInput> &
  React.RefAttributes<TextInput> & {
    /** Shows the "n/max" counter when `maxLength` is set. Defaults to `true`. */
    showCount?: boolean;
    /**
     * Classes for the wrapper `View`, which is ALWAYS rendered (with or without the counter), so
     * layout classes (margin, flex, width) behave the same either way. `className` styles the field,
     * like `Input` and `PasswordInput`.
     */
    containerClassName?: string;
    /** Marks the value as invalid with a danger border (see `Input`). */
    invalid?: boolean;
    /** Error message below the field, exposed to screen readers on the field (see `Input`). */
    errorText?: string;
  };

/** The counter is announced only when this close to the limit (10% of `maxLength`, at least 1). */
const announceThreshold = (maxLength: number) => Math.max(1, Math.ceil(maxLength * 0.1));

/**
 * Multiline text field with an optional character counter.
 *
 * Uncontrolled counter limitation: the length is tracked from `defaultValue` and `onChangeText`.
 * Imperative changes through the ref (`clear()`, `setNativeProps({ text })`) do not emit
 * `onChangeText` in React Native, so the counter cannot see them; use a controlled `value` when
 * the text is changed programmatically.
 */
function Textarea({
  className,
  multiline = true,
  numberOfLines = 8, // Maximum height in lines.
  placeholderTextColorClassName,
  showCount = true,
  containerClassName,
  onChangeText,
  invalid,
  errorText,
  accessibilityHint,
  ...props
}: TextareaProps) {
  const controlled = props.value !== undefined;
  const [uncontrolledLength, setUncontrolledLength] = React.useState(
    props.defaultValue?.length ?? 0
  );
  const length = props.value !== undefined ? props.value.length : uncontrolledLength;
  const { maxLength } = props;
  const withCount = showCount && maxLength !== undefined;
  const nearLimit = withCount && maxLength - length <= announceThreshold(maxLength);

  return (
    <View className={cn('w-full gap-1.5', containerClassName)}>
      {/* The counter is positioned against this box, so the error message below never moves it. */}
      <View className="relative w-full">
        <TextInput
          className={cn(
            'text-foreground border-input-border dark:bg-input/30 flex min-h-16 w-full flex-row rounded-md border bg-transparent px-3 py-2 text-base shadow-sm shadow-black/5',
            props.editable === false && 'opacity-50',
            // Room for the counter overlaid on the bottom-right corner, so text never runs under it.
            withCount && 'pb-7',
            // After the base classes so tailwind-merge lets the danger border win.
            (invalid || Boolean(errorText)) && INVALID_FIELD_CLASS_NAME,
            className
          )}
          // Uniwind maps placeholder color through `placeholderTextColorClassName` (`accent-` prefix).
          placeholderTextColorClassName={cn('accent-muted-foreground', placeholderTextColorClassName)}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical="top"
          accessibilityHint={fieldErrorHint(errorText, accessibilityHint)}
          onChangeText={(text) => {
            if (!controlled) {
              setUncontrolledLength(text.length);
            }
            onChangeText?.(text);
          }}
          {...props}
        />
        {withCount ? (
          <Text
            // Announced only near the limit, so screen readers are not interrupted on every keystroke.
            aria-live={nearLimit ? 'polite' : 'off'}
            accessibilityLabel={`${length} of ${maxLength} characters`}
            // Overlaid inside the field border; it must not steal touches from the input.
            pointerEvents="none"
            className={cn(
              'text-muted-foreground absolute bottom-2 right-3 text-xs tabular-nums',
              length >= maxLength && 'text-danger-text'
            )}
          >
            {length}/{maxLength}
          </Text>
        ) : null}
      </View>
      {errorText ? <FieldError>{errorText}</FieldError> : null}
    </View>
  );
}

export { Textarea };
export type { TextareaProps };
