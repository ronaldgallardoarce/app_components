import { Icon } from '@/design-system/components/icon';
import { Input, type InputProps } from '@/design-system/components/input';
import { cn } from '@/design-system/lib/utils';
import { Eye, EyeOff } from 'lucide-react-native';
import * as React from 'react';
import { Platform, Pressable, type TextInput, View } from 'react-native';

type PasswordInputVariant = 'current' | 'new';

/** `invalid` is forwarded to `Input`; the toggle has no border, so it needs no invalid style. */
type PasswordInputProps = Omit<InputProps, 'secureTextEntry'> & {
    /** `current` for sign-in, `new` for sign-up / change password (drives password managers). */
    variant?: PasswordInputVariant;
    /** Classes for the wrapper `View` (the field classes go to `className`). */
    containerClassName?: string;
  };

const AUTOFILL = {
  current: { autoComplete: 'current-password', textContentType: 'password' },
  new: { autoComplete: 'new-password', textContentType: 'newPassword' },
} as const satisfies Record<
  PasswordInputVariant,
  Pick<React.ComponentProps<typeof TextInput>, 'autoComplete' | 'textContentType'>
>;

/**
 * `Input` for passwords with a show / hide toggle inside the field border. The field keeps every
 * `Input` style (focus, invalid, disabled); the toggle is overlaid on its right padding, which is
 * widened (`pr-12`) so the text never runs under the icon.
 *
 * Platform behavior of toggling `secureTextEntry`:
 * - Android resets the cursor to the start; the last selection is tracked with
 *   `onSelectionChange` and restored with `setSelection` after the toggle.
 * - iOS (UIKit, not React Native): when a secure field regains editing, the next keystroke replaces
 *   the whole text. This is native password-field behavior and is intentionally not worked around.
 */
function PasswordInput({
  variant = 'current',
  className,
  containerClassName,
  ref,
  onSelectionChange,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = React.useState(false);
  const disabled = props.editable === false;
  const inputRef = React.useRef<TextInput | null>(null);
  const selectionRef = React.useRef<{ start: number; end: number } | null>(null);
  const toggledRef = React.useRef(false);

  // Forwards the instance to the consumer's ref while keeping one for the selection fix.
  const setInputRef = React.useCallback(
    (node: TextInput | null) => {
      inputRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref]
  );

  React.useEffect(() => {
    if (Platform.OS !== 'android' || !toggledRef.current) {
      return;
    }
    const selection = selectionRef.current;
    const input = inputRef.current;
    if (selection && input?.isFocused()) {
      input.setSelection(selection.start, selection.end);
    }
  }, [visible]);

  return (
    <View className={cn('relative w-full justify-center', containerClassName)}>
      <Input
        autoCapitalize="none"
        autoCorrect={false}
        {...AUTOFILL[variant]}
        {...props}
        ref={setInputRef}
        onSelectionChange={(event) => {
          selectionRef.current = event.nativeEvent.selection;
          onSelectionChange?.(event);
        }}
        secureTextEntry={!visible}
        // 6 inset + 32 button + 10 gap, so the text stops well before the toggle.
        className={cn('pr-12', className)}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={visible ? 'Hide password' : 'Show password'}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={() => {
          toggledRef.current = true;
          setVisible((value) => !value);
        }}
        // 32pt button inset 6pt from the border; hitSlop grows it to the 44pt touch target.
        hitSlop={6}
        className={cn(
          'absolute right-1.5 size-8 items-center justify-center rounded-md',
          disabled && 'opacity-50'
        )}
      >
        <Icon
          as={visible ? EyeOff : Eye}
          aria-hidden={true}
          className="text-muted-foreground size-4"
        />
      </Pressable>
    </View>
  );
}

export { PasswordInput };
export type { PasswordInputProps, PasswordInputVariant };
