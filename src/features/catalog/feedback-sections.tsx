import { AlertCircle, CheckCircle2, Info, Terminal, TriangleAlert } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { Alert, AlertDescription, AlertTitle } from '@/design-system/components/alert';
import { Badge, type BadgeVariant } from '@/design-system/components/badge';
import { Button } from '@/design-system/components/button';
import { Progress } from '@/design-system/components/progress';
import { Skeleton } from '@/design-system/components/skeleton';
import { Text } from '@/design-system/components/text';

import { Group, Row, Section } from './catalog-layout';

const BADGE_VARIANTS: readonly BadgeVariant[] = [
  'primary',
  'secondary',
  'outline',
  'danger',
  'success',
  'warning',
  'info',
  'danger-soft',
  'success-soft',
  'warning-soft',
  'info-soft',
];

const ALERTS = [
  { variant: 'default', icon: Terminal, title: 'Heads up!', description: 'Neutral information.' },
  { variant: 'danger', icon: AlertCircle, title: 'Error', description: 'Your session expired.' },
  { variant: 'success', icon: CheckCircle2, title: 'Saved', description: 'Changes are stored.' },
  { variant: 'warning', icon: TriangleAlert, title: 'Warning', description: 'Low storage.' },
  { variant: 'info', icon: Info, title: 'Info', description: 'A new version is out.' },
] as const;

export function FeedbackSections() {
  const [progress, setProgress] = useState(40);
  return (
    <Group title="Feedback">
      <Section title="Alert">
        {ALERTS.map(({ variant, icon, title, description }) => (
          <Alert key={variant} variant={variant} icon={icon}>
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
          </Alert>
        ))}
      </Section>

      <Section title="Badge">
        <Row>
          {BADGE_VARIANTS.map((variant) => (
            <Badge key={variant} variant={variant}>
              <Text>{variant}</Text>
            </Badge>
          ))}
        </Row>
      </Section>

      <Section title="Progress">
        <Progress value={progress} aria-label="Upload progress" />
        <Row>
          <Button size="sm" variant="outline" onPress={() => setProgress((v) => Math.max(0, v - 20))}>
            -20
          </Button>
          <Button size="sm" variant="outline" onPress={() => setProgress((v) => Math.min(100, v + 20))}>
            +20
          </Button>
          <Text variant="muted">{progress}%</Text>
        </Row>
      </Section>

      <Section title="Skeleton">
        <Row>
          <Skeleton className="size-12 rounded-full" />
          <View className="flex-1 gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </View>
        </Row>
      </Section>
    </Group>
  );
}
