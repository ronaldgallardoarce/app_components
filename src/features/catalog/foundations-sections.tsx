import { Button, type ButtonSize, type ButtonVariant } from '@/design-system/components/button';
import { Text, type TextTone, type TextVariant } from '@/design-system/components/text';

import { Group, Row, Section } from './catalog-layout';

const BUTTON_VARIANTS: readonly ButtonVariant[] = [
  'primary',
  'secondary',
  'outline',
  'ghost',
  'link',
  'danger',
  'success',
  'warning',
  'info',
];

const BUTTON_SIZES: readonly Exclude<ButtonSize, 'icon'>[] = ['sm', 'default', 'lg'];

const TEXT_VARIANTS: readonly TextVariant[] = [
  'h1',
  'h2',
  'h3',
  'h4',
  'p',
  'blockquote',
  'code',
  'lead',
  'large',
  'small',
  'muted',
];

const TEXT_TONES: readonly TextTone[] = ['default', 'muted', 'danger', 'success', 'warning', 'info'];

export function FoundationsSections() {
  return (
    <Group title="Foundations">
      <Section title="Button variants">
        {BUTTON_VARIANTS.map((variant) => (
          <Button key={variant} variant={variant}>
            {variant}
          </Button>
        ))}
      </Section>

      <Section title="Button sizes">
        <Row>
          {BUTTON_SIZES.map((size) => (
            <Button key={size} size={size}>
              {size}
            </Button>
          ))}
          <Button size="icon" variant="outline" accessibilityLabel="Add">
            +
          </Button>
        </Row>
      </Section>

      <Section title="Button states">
        <Button disabled>Disabled</Button>
        {BUTTON_VARIANTS.map((variant) => (
          <Button key={variant} variant={variant} loading>
            Loading {variant}
          </Button>
        ))}
      </Section>

      <Section title="Text variants">
        {TEXT_VARIANTS.map((variant) => (
          <Text key={variant} variant={variant}>
            {variant}: The quick brown fox
          </Text>
        ))}
      </Section>

      <Section title="Text tones">
        {TEXT_TONES.map((tone) => (
          <Text key={tone} tone={tone}>
            {tone}: The quick brown fox
          </Text>
        ))}
      </Section>
    </Group>
  );
}
