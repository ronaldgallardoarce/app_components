import { DarkTheme, DefaultTheme, type Theme } from 'expo-router';
import { useCSSVariable, useUniwind } from 'uniwind';

type ThemeColor = Theme['colors'][keyof Theme['colors']];

const asColor = (value: string | number | undefined, fallback: ThemeColor) =>
  typeof value === 'string' ? value : fallback;

/**
 * React Navigation theme for the RESOLVED Uniwind theme ('light' | 'dark'), i.e. the
 * stored preference with 'system' already resolved. Re-renders when the theme changes.
 *
 * Design tokens map to React Navigation colors following React Native Reusables' `NAV_THEME`
 * (lib/theme.ts): background, border, card, notification (RNR `destructive`, our `danger`),
 * primary and text (foreground). Unlike RNR, values are NOT duplicated here: they are read
 * from src/global.css through Uniwind's `useCSSVariable`, so navigation chrome always
 * matches the tokens. React Navigation's defaults are only a fallback if a token is missing.
 */
function useNavigationTheme(): Theme {
  const { theme } = useUniwind();
  const [background, border, card, notification, primary, text] = useCSSVariable([
    '--color-background',
    '--color-border',
    '--color-card',
    '--color-danger',
    '--color-primary',
    '--color-foreground',
  ]);
  const base = theme === 'dark' ? DarkTheme : DefaultTheme;

  return {
    ...base,
    colors: {
      ...base.colors,
      background: asColor(background, base.colors.background),
      border: asColor(border, base.colors.border),
      card: asColor(card, base.colors.card),
      notification: asColor(notification, base.colors.notification),
      primary: asColor(primary, base.colors.primary),
      text: asColor(text, base.colors.text),
    },
  };
}

export { useNavigationTheme };
