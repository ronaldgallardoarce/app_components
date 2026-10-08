import { Text } from '@/design-system/components/text';
import { cn } from '@/design-system/lib/utils';
import * as React from 'react';
import { TextInput } from 'react-native';

/** Invalid field classes: danger border. */
const INVALID_FIELD_CLASS_NAME = 'border-danger';

/**
 * Focus indicator of text fields: the border takes the `--color-ring` token while the field is
 * focused (Uniwind tracks TextInput focus natively). Not applied to invalid fields, so the danger
 * border keeps signaling the error while the user fixes it.
 */
const FOCUSED_FIELD_CLASS_NAME = 'focus:border-ring';

/**
 * Single-line fields render WITHOUT a line height. `text-base` sets one (24dp), and any explicit
 * line height on a single-line TextInput misplaces the text: Android clips descenders or shifts the
 * baseline when it is smaller than the font's natural height, and iOS pushes the text toward the
 * bottom when it is larger. Without it both platforms center the text natively (see also
 * `textAlignVertical="center"` in `Input`). Multiline fields keep their line height.
 */
const SINGLE_LINE_INPUT_STYLE = { lineHeight: undefined } as const;

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
    // `min-h-10` (not `h-10`) so the field grows with the system font scale instead of clipping the
    // text; no `sm:` downsizing, landscape phones and tablets are touch devices too.
    'dark:bg-input/30 border-input-border bg-background text-foreground flex min-h-10 w-full min-w-0 flex-row items-center rounded-md border px-3 py-1 text-base shadow-sm shadow-black/5',
    editable === false && 'opacity-50',
    !invalid && FOCUSED_FIELD_CLASS_NAME,
    // After the base classes so tailwind-merge lets the danger border win.
    invalid && INVALID_FIELD_CLASS_NAME,
    className
  );
}

/** Uniwind maps placeholder color through `placeholderTextColorClassName` (`accent-` prefix). */
const INPUT_PLACEHOLDER_COLOR_CLASS_NAME = 'accent-muted-foreground';

/**
 * Screen reader hint of a field with an error. React Native 0.86 has no `aria-describedby` /
 * `aria-invalid`; `accessibilityHint` (iOS and Android) is read right after the field's label, so
 * the error is heard whenever the field is focused. A consumer hint is kept after the error.
 */
function fieldErrorHint(errorText: string | undefined, accessibilityHint: string | undefined) {
  return [errorText, accessibilityHint].filter(Boolean).join('. ') || undefined;
}

/**
 * Error message rendered below a field. `aria-live="polite"` (Android live region) makes TalkBack
 * announce the message when it appears or changes; VoiceOver reads it through the field's hint
 * (see `fieldErrorHint`). No margin of its own: spacing comes from the parent's `gap`.
 */
function FieldError({ children, className }: { children: string; className?: string }) {
  return (
    <Text aria-live="polite" className={cn('text-danger-text text-sm', className)}>
      {children}
    </Text>
  );
}

type InputProps = React.ComponentProps<typeof TextInput> &
  React.RefAttributes<TextInput> & {
    /** Marks the value as invalid with a danger border. Implied by a non-empty `errorText`. */
    invalid?: boolean;
    /**
     * Error message shown below the field (danger text, announced by TalkBack) and exposed to
     * screen readers on the field itself. Rendered as a SIBLING right after the `TextInput` (no
     * wrapper, so the field is never remounted and keeps focus when the error appears); place the
     * input in a column (e.g. a `View`) so the message lands below it.
     */
    errorText?: string;
  };

function Input({
  className,
  placeholderTextColorClassName,
  invalid,
  errorText,
  accessibilityHint,
  style,
  ...props
}: InputProps) {
  const hasError = Boolean(errorText);
  return (
    <>
      <TextInput
        className={inputClassName({
          editable: props.editable,
          invalid: invalid || hasError,
          className,
        })}
        placeholderTextColorClassName={cn(
          INPUT_PLACEHOLDER_COLOR_CLASS_NAME,
          placeholderTextColorClassName
        )}
        accessibilityHint={fieldErrorHint(errorText, accessibilityHint)}
        textAlignVertical={props.multiline ? undefined : 'center'}
        style={props.multiline ? style : [SINGLE_LINE_INPUT_STYLE, style]}
        {...props}
      />
      {errorText ? <FieldError>{errorText}</FieldError> : null}
    </>
  );
}

export {
  FieldError,
  fieldErrorHint,
  FOCUSED_FIELD_CLASS_NAME,
  Input,
  INPUT_PLACEHOLDER_COLOR_CLASS_NAME,
  INVALID_FIELD_CLASS_NAME,
  inputClassName,
  SINGLE_LINE_INPUT_STYLE,
};
export type { InputProps };
