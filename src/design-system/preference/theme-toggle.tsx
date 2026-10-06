import { Monitor, Moon, Sun, type LucideIcon } from 'lucide-react-native';

import { Button } from '@/design-system/components/button';
import { Icon } from '@/design-system/components/icon';

import { THEME_PREFERENCES, type ThemePreference } from './theme-preference';
import { useThemePreference } from './use-theme-preference';

const PREFERENCE_ICONS: Record<ThemePreference, LucideIcon> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const nextPreference = (current: ThemePreference): ThemePreference =>
  THEME_PREFERENCES[(THEME_PREFERENCES.indexOf(current) + 1) % THEME_PREFERENCES.length];

/** Compact header control that cycles the stored preference: light -> dark -> system. */
export function ThemeToggle() {
  const { preference, setPreference } = useThemePreference();
  const next = nextPreference(preference);

  return (
    <Button
      variant="ghost"
      size="icon"
      accessibilityLabel={`Theme: ${preference}. Switch to ${next}`}
      onPress={() => setPreference(next)}
    >
      <Icon as={PREFERENCE_ICONS[preference]} className="text-foreground size-5" />
    </Button>
  );
}
