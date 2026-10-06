import { Input, type InputProps } from '@/design-system/components/input';

type EmailInputProps = InputProps;

/**
 * `Input` preconfigured for email addresses. No validation: forms own validation.
 *
 * `inputMode="email"` is used instead of `keyboardType="email-address"`: in RN 0.86 `inputMode`
 * takes precedence over `keyboardType` and maps to the same keyboard. Every default can be
 * overridden through props.
 */
function EmailInput(props: EmailInputProps) {
  return (
    <Input
      inputMode="email"
      autoCapitalize="none"
      autoCorrect={false}
      autoComplete="email"
      textContentType="emailAddress"
      {...props}
    />
  );
}

export { EmailInput };
export type { EmailInputProps };
