import type { Href } from 'expo-router';

/** One entry per catalog route; the index screen lists them and the root Stack titles them. */
export const CATALOG_GROUPS = [
  {
    route: 'foundations',
    href: '/catalog/foundations',
    title: 'Foundations',
    description: 'Buttons, typography variants and text tones.',
  },
  {
    route: 'forms',
    href: '/catalog/forms',
    title: 'Forms',
    description: 'Input, textarea, label, checkbox, switch, radio group and select sheet.',
  },
  {
    route: 'feedback',
    href: '/catalog/feedback',
    title: 'Feedback',
    description: 'Alert, badge, progress and skeleton.',
  },
  {
    route: 'overlays',
    href: '/catalog/overlays',
    title: 'Overlays',
    description: 'Dialogs, popover and dropdown menu.',
  },
  {
    route: 'layout',
    href: '/catalog/layout',
    title: 'Layout and data display',
    description: 'Card, separator, tabs, accordion, collapsible, avatar and toggles.',
  },
] as const satisfies readonly { route: string; href: Href; title: string; description: string }[];
