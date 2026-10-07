import { Bell, ChevronRight, Globe } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { Checkbox } from '@/design-system/components/checkbox';
import { EmailInput } from '@/design-system/components/email-input';
import { Icon } from '@/design-system/components/icon';
import { Input } from '@/design-system/components/input';
import { Label } from '@/design-system/components/label';
import { ListItem } from '@/design-system/components/list-item';
import { PasswordInput } from '@/design-system/components/password-input';
import { RadioGroup, RadioGroupItem } from '@/design-system/components/radio-group';
import {
  MultiSelectSheet,
  SelectSheet,
  type SelectSheetOption,
} from '@/design-system/components/select-sheet';
import { Switch } from '@/design-system/components/switch';
import { Text } from '@/design-system/components/text';
import { Textarea } from '@/design-system/components/textarea';

import { Group, Row, Section } from './catalog-layout';

const COUNTRIES: SelectSheetOption[] = [
  { value: 'ar', label: 'Argentina', description: 'South America' },
  { value: 'au', label: 'Australia', description: 'Oceania' },
  { value: 'at', label: 'Austria', description: 'Europe' },
  { value: 'be', label: 'Belgium', description: 'Europe' },
  { value: 'bo', label: 'Bolivia', description: 'South America' },
  { value: 'br', label: 'Brazil', description: 'South America' },
  { value: 'ca', label: 'Canada', description: 'North America' },
  { value: 'cl', label: 'Chile', description: 'South America' },
  { value: 'cn', label: 'China', description: 'Asia' },
  { value: 'co', label: 'Colombia', description: 'South America' },
  { value: 'cr', label: 'Costa Rica', description: 'Central America' },
  { value: 'ci', label: "Côte d'Ivoire", description: 'Africa' },
  { value: 'ec', label: 'Ecuador', description: 'South America' },
  { value: 'eg', label: 'Egypt', description: 'Africa' },
  { value: 'fr', label: 'France', description: 'Europe' },
  { value: 'de', label: 'Germany', description: 'Europe' },
  { value: 'in', label: 'India', description: 'Asia' },
  { value: 'it', label: 'Italy', description: 'Europe' },
  { value: 'jp', label: 'Japan', description: 'Asia' },
  { value: 'mx', label: 'México', description: 'North America' },
  { value: 'nl', label: 'Netherlands', description: 'Europe' },
  { value: 'nz', label: 'New Zealand', description: 'Oceania' },
  { value: 'pa', label: 'Panamá', description: 'Central America' },
  { value: 'py', label: 'Paraguay', description: 'South America' },
  { value: 'pe', label: 'Perú', description: 'South America' },
  { value: 'pt', label: 'Portugal', description: 'Europe' },
  { value: 'kp', label: 'North Korea', description: 'Asia (unavailable)', disabled: true },
  { value: 'es', label: 'Spain', description: 'Europe' },
  { value: 'tr', label: 'Türkiye', description: 'Europe / Asia' },
  { value: 'gb', label: 'United Kingdom', description: 'Europe' },
  { value: 'us', label: 'United States', description: 'North America' },
  { value: 'uy', label: 'Uruguay', description: 'South America' },
  { value: 've', label: 'Venezuela', description: 'South America' },
];

const SIZES: SelectSheetOption[] = [
  { value: 'xs', label: 'Extra small' },
  { value: 's', label: 'Small' },
  { value: 'm', label: 'Medium' },
  { value: 'l', label: 'Large' },
];

const TOPICS: SelectSheetOption[] = [
  { value: 'design', label: 'Design' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'product', label: 'Product' },
  { value: 'research', label: 'Research', description: 'User and market research' },
  { value: 'sales', label: 'Sales' },
  { value: 'support', label: 'Support', disabled: true },
];

export function FormSections() {
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [summary, setSummary] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [terms, setTerms] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [plan, setPlan] = useState('monthly');
  const [country, setCountry] = useState<string | undefined>(undefined);
  const [size, setSize] = useState<string | undefined>(undefined);
  const [topics, setTopics] = useState<string[]>(['design']);
  const [rowSelected, setRowSelected] = useState(false);

  return (
    <Group title="Forms">
      <Section title="Input">
        <Label nativeID="email-label">Email</Label>
        <Input
          aria-labelledby="email-label"
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <Input placeholder="Disabled" editable={false} />
      </Section>

      <Section title="Textarea">
        <Textarea placeholder="Tell us about yourself" value={bio} onChangeText={setBio} />
        <Textarea placeholder="Disabled" editable={false} />
        <Label nativeID="summary-label">Summary (controlled, max 200)</Label>
        <Textarea
          aria-labelledby="summary-label"
          placeholder="Write a short summary"
          maxLength={200}
          value={summary}
          onChangeText={setSummary}
        />
        <Label nativeID="note-label">Note (uncontrolled, max 40)</Label>
        <Textarea
          aria-labelledby="note-label"
          placeholder="Type until the counter turns red"
          maxLength={40}
          defaultValue="Starts with some text"
        />
        <Label nativeID="invalid-bio-label">Invalid textarea</Label>
        <Textarea
          aria-labelledby="invalid-bio-label"
          errorText="Write at least 20 characters."
          maxLength={120}
          defaultValue="Too short"
        />
      </Section>

      <Section title="Password input">
        <Label nativeID="password-label">Password</Label>
        <PasswordInput
          aria-labelledby="password-label"
          placeholder="Current password"
          value={password}
          onChangeText={setPassword}
        />
        <Label nativeID="new-password-label">New password</Label>
        <PasswordInput
          aria-labelledby="new-password-label"
          variant="new"
          placeholder="At least 8 characters"
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <PasswordInput placeholder="Disabled" editable={false} defaultValue="secret" />
      </Section>

      <Section title="Email input">
        <Label nativeID="email-input-label">Email</Label>
        <EmailInput
          aria-labelledby="email-input-label"
          placeholder="you@example.com"
          value={contactEmail}
          onChangeText={setContactEmail}
        />
        <EmailInput placeholder="Disabled" editable={false} />
        <Label nativeID="invalid-email-label">Invalid email</Label>
        <View className="gap-1.5">
          <EmailInput
            aria-labelledby="invalid-email-label"
            errorText="Enter a valid email address."
            defaultValue="name@example"
          />
        </View>
        <Label nativeID="invalid-password-label">Invalid password</Label>
        <PasswordInput
          aria-labelledby="invalid-password-label"
          variant="new"
          errorText="Use at least 8 characters."
          defaultValue="short"
        />
      </Section>

      <Section title="Label">
        <Label>Default label</Label>
        <Label disabled>Disabled label</Label>
      </Section>

      <Section title="Checkbox">
        <Row>
          <Checkbox
            aria-labelledby="terms-label"
            checked={terms}
            onCheckedChange={setTerms}
          />
          <Label nativeID="terms-label" onPress={() => setTerms((value) => !value)}>
            Accept terms and conditions
          </Label>
        </Row>
        <Row>
          <Checkbox aria-labelledby="checkbox-disabled" checked disabled onCheckedChange={() => {}} />
          <Label nativeID="checkbox-disabled" disabled>
            Disabled (checked)
          </Label>
        </Row>
      </Section>

      <Section title="Switch">
        <Row>
          <Switch
            aria-labelledby="notifications-label"
            checked={notifications}
            onCheckedChange={setNotifications}
          />
          <Label
            nativeID="notifications-label"
            onPress={() => setNotifications((value) => !value)}
          >
            Notifications {notifications ? 'on' : 'off'}
          </Label>
        </Row>
        <Row>
          <Switch aria-labelledby="switch-disabled" checked={false} disabled onCheckedChange={() => {}} />
          <Label nativeID="switch-disabled" disabled>
            Disabled
          </Label>
        </Row>
      </Section>

      <Section title="Radio group">
        <RadioGroup value={plan} onValueChange={setPlan} className="gap-3">
          {['monthly', 'yearly', 'lifetime'].map((option) => (
            <Row key={option}>
              <RadioGroupItem value={option} aria-labelledby={`plan-${option}`} />
              <Label nativeID={`plan-${option}`} onPress={() => setPlan(option)}>
                {option}
              </Label>
            </Row>
          ))}
          <Row>
            <RadioGroupItem value="enterprise" aria-labelledby="plan-enterprise" disabled />
            <Label nativeID="plan-enterprise" disabled>
              enterprise (disabled)
            </Label>
          </Row>
        </RadioGroup>
      </Section>

      <Section title="List item">
        <View className="border-border overflow-hidden rounded-md border">
          <ListItem
            title="Language"
            description="English (United States)"
            leading={<Icon as={Globe} className="text-muted-foreground" />}
            trailing={<Icon as={ChevronRight} className="text-muted-foreground size-4" />}
          />
          <ListItem
            title="Notifications"
            description="Tap to toggle the selected state"
            selected={rowSelected}
            onPress={() => setRowSelected((value) => !value)}
            leading={<Icon as={Bell} className="text-muted-foreground" />}
          />
          <ListItem title="Disabled row" description="Not available" disabled />
        </View>
      </Section>

      <Section title="Select sheet">
        <Label nativeID="country-label">Country</Label>
        <SelectSheet
          aria-labelledby="country-label"
          options={COUNTRIES}
          value={country}
          onValueChange={setCountry}
          placeholder="Select a country"
          searchPlaceholder="Search countries"
        />
        <Text variant="muted">
          Selected value: {country ?? 'none'} (many options: full-height sheet)
        </Text>
        <Label nativeID="size-label">Size</Label>
        <SelectSheet
          aria-labelledby="size-label"
          options={SIZES}
          value={size}
          onValueChange={setSize}
          placeholder="Select a size"
        />
        <Text variant="muted">Selected value: {size ?? 'none'} (few options: compact sheet)</Text>
        <SelectSheet
          options={COUNTRIES}
          value={undefined}
          onValueChange={() => {}}
          placeholder="Disabled"
          disabled
        />
      </Section>

      <Section title="Multi select sheet">
        <Label nativeID="topics-label">Topics</Label>
        <MultiSelectSheet
          aria-labelledby="topics-label"
          options={TOPICS}
          value={topics}
          onValueChange={setTopics}
          placeholder="Select topics"
          searchPlaceholder="Search topics"
        />
        <Text variant="muted">
          Selected values: {topics.join(', ') || 'none'} (compact sheet with footer)
        </Text>
      </Section>
    </Group>
  );
}
