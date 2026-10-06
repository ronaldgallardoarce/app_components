import { Text, TextClassContext } from '@/design-system/components/text';
import { cn } from '@/design-system/lib/utils';
import { cva } from 'class-variance-authority';
import * as React from 'react';
import { Pressable, View } from 'react-native';

// Pressable row for lists and menus (settings rows, pickers, sheet options). Pressed text styles
// use the Pressable `pressed` state instead of `group-active:` (Uniwind Pro only), like `Button`.

const listItemVariants = cva(
  // min-h-12 (48px) keeps the row above the 44pt / 48dp minimum touch target.
  'min-h-12 w-full flex-row items-center gap-3 px-4 py-2.5',
  {
    variants: {
      selected: {
        true: 'bg-accent active:bg-accent/70',
        false: 'active:bg-accent dark:active:bg-accent/50',
      },
      disabled: {
        true: 'opacity-50',
        false: '',
      },
    },
    defaultVariants: {
      selected: false,
      disabled: false,
    },
  }
);

/**
 * Layout metrics of the classes above (px at font scale 1), for callers that must predict a row's
 * height without measuring it (e.g. sizing a sheet). Keep in sync with `min-h-12`, `py-2.5`,
 * `gap-0.5` and the `text-base` / `text-sm` line heights (24 / 20).
 */
const LIST_ITEM_METRICS = {
  minHeight: 48,
  paddingVertical: 10,
  textGap: 2,
  titleLineHeight: 24,
  descriptionLineHeight: 20,
} as const;

/** Estimated height of a row whose title and description each fit on one line. */
function estimateListItemHeight({
  hasDescription,
  fontScale = 1,
}: {
  hasDescription: boolean;
  fontScale?: number;
}) {
  const m = LIST_ITEM_METRICS;
  const text =
    m.titleLineHeight * fontScale +
    (hasDescription ? m.textGap + m.descriptionLineHeight * fontScale : 0);
  return Math.max(m.minHeight, m.paddingVertical * 2 + text);
}

const listItemTextVariants = cva('text-foreground text-base', {
  variants: {
    selected: {
      true: 'text-accent-foreground font-medium',
      false: '',
    },
    /** Pressable `pressed` state (Free-tier replacement for `group-active:`). */
    pressed: {
      true: 'text-accent-foreground',
      false: '',
    },
  },
  defaultVariants: {
    selected: false,
    pressed: false,
  },
});

type ListItemProps = Omit<React.ComponentProps<typeof Pressable>, 'children'> & {
  /** Primary label. */
  title: string;
  /** Secondary muted text below the title. */
  description?: string;
  /** Content before the text (icon, avatar, checkbox...). Icons inherit the row text color. */
  leading?: React.ReactNode;
  /** Content after the text (check icon, badge, chevron, switch...). */
  trailing?: React.ReactNode;
  /** Highlights the row and exposes `selected` to assistive technologies. */
  selected?: boolean;
  /** Exposes `checked` to assistive technologies (use with `accessibilityRole` checkbox/radio). */
  checked?: boolean;
  titleClassName?: string;
  descriptionClassName?: string;
};

function ListItem({
  title,
  description,
  leading,
  trailing,
  selected = false,
  checked,
  disabled,
  className,
  titleClassName,
  descriptionClassName,
  accessibilityRole = 'button',
  accessibilityState,
  ...props
}: ListItemProps) {
  const isDisabled = Boolean(disabled);

  return (
    <Pressable
      accessibilityRole={accessibilityRole}
      accessibilityState={{ ...accessibilityState, disabled: isDisabled, selected, checked }}
      className={cn(listItemVariants({ selected, disabled: isDisabled }), className)}
      disabled={isDisabled}
      {...props}
    >
      {({ pressed }) => (
        <TextClassContext.Provider value={listItemTextVariants({ selected, pressed })}>
          {leading}
          <View className="min-w-0 flex-1 gap-0.5">
            <Text numberOfLines={2} className={titleClassName}>
              {title}
            </Text>
            {description ? (
              <Text
                numberOfLines={2}
                className={cn('text-muted-foreground text-sm font-normal', descriptionClassName)}
              >
                {description}
              </Text>
            ) : null}
          </View>
          {trailing}
        </TextClassContext.Provider>
      )}
    </Pressable>
  );
}

export {
  estimateListItemHeight,
  LIST_ITEM_METRICS,
  ListItem,
  listItemTextVariants,
  listItemVariants,
};
export type { ListItemProps };
