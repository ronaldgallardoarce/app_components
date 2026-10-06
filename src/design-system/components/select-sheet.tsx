import { Button } from '@/design-system/components/button';
import { Checkbox } from '@/design-system/components/checkbox';
import { Icon } from '@/design-system/components/icon';
import { INPUT_PLACEHOLDER_COLOR_CLASS_NAME, inputClassName } from '@/design-system/components/input';
import {
  estimateListItemHeight,
  LIST_ITEM_METRICS,
  ListItem,
} from '@/design-system/components/list-item';

import { Text } from '@/design-system/components/text';
import { cn } from '@/design-system/lib/utils';
import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { Check, ChevronDown } from 'lucide-react-native';
import * as React from 'react';
import {
  Keyboard,
  type LayoutChangeEvent,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCSSVariable, withUniwind } from 'uniwind';

// Searchable single / multiple select presented in a @gorhom/bottom-sheet modal.
// Requires `GestureHandlerRootView` + `BottomSheetModalProvider` at the app root (src/app/_layout.tsx).
//
// Sheet behavior contract:
// - Search is shown only for long lists (`SEARCHABLE_MIN_OPTIONS`), overridable with `searchable`.
//   A short list has no input, so the keyboard never interacts with a compact sheet.
// - FIXED height per open: `enableDynamicSizing={false}` and ONE snap point decided in `present()`
//   and frozen until the sheet closes, so typing never resizes it. Dynamic sizing is not used on
//   purpose: it re-measures content and would shrink on filter.
//   - Without search: compact (a pixel snap point = the MEASURED content height) when every option
//     fits within MAX_SNAP_POINT, otherwise MAX_SNAP_POINT. The content is measured ahead of time by
//     `SheetContentMeasurer`, an invisible copy of the header, rows, empty state and footer, so
//     wrapping, font scale and breakpoints are exact.
//   - With search: always MAX_SNAP_POINT, so the list keeps a usable height above the keyboard.
//   The list takes the remaining space (`flex: 1`).
// - `topInset` = top safe area: snap points are computed below the status bar / notch and gorhom
//   clamps the sheet position at that line (`Math.max(0, container - snapPoint)`), so it never goes
//   above the visible area.
// - Keyboard: `extend` keeps the sheet at its (single) snap point and shrinks the content by the
//   keyboard height, so the list ends exactly at the keyboard and every row stays reachable by
//   scrolling. `interactive` is not used: it moves the sheet to a temporary position that, on
//   Android, races the window pan and leaves rows hidden or flickering.
//   Android uses `adjustPan` (gorhom's own keyboard offset): Expo SDK 54+ enforces edge-to-edge,
//   where `softwareKeyboardLayoutMode: "resize"` no longer resizes the window, so `adjustResize`
//   (which makes gorhom ignore the keyboard) would leave the list under the keyboard.

type SelectSheetOption<T extends string = string> = {
  value: T;
  label: string;
  description?: string;
  disabled?: boolean;
};

type SelectSheetBaseProps<T extends string> = {
  options: readonly SelectSheetOption<T>[];
  /** Trigger text when nothing is selected. */
  placeholder?: string;
  /** Sheet heading. Defaults to `placeholder`. */
  title?: string;
  searchPlaceholder?: string;
  /** Show the search input. Defaults to `options.length >= SEARCHABLE_MIN_OPTIONS`. */
  searchable?: boolean;
  /** Shown when the search matches no option. */
  emptyText?: string;
  disabled?: boolean;
  /** Trigger classes. */
  className?: string;
  accessibilityLabel?: string;
  'aria-labelledby'?: string;
};

type SelectSheetProps<T extends string = string> = SelectSheetBaseProps<T> & {
  value: T | undefined;
  onValueChange: (value: T) => void;
};

type MultiSelectSheetProps<T extends string = string> = SelectSheetBaseProps<T> & {
  value: readonly T[];
  onValueChange: (value: T[]) => void;
  /** Label of the footer button that closes the sheet. */
  doneLabel?: string;
};

/** Largest sheet height, relative to the container (window minus the top safe area). */
const MAX_SNAP_RATIO = 0.88;
const MAX_SNAP_POINT = `${MAX_SNAP_RATIO * 100}%`;

/** Lists shorter than this are scanned at a glance, so they open without a search input. */
const SEARCHABLE_MIN_OPTIONS = 8;

/**
 * One horizontal inset for everything inside the sheet (header, search input, rows, empty state,
 * footer), so row content lines up with the search input's border box. 16px (`px-4`).
 */
const SHEET_INSET_X = 'px-4';

/** Field-like trigger classes (same height, border and padding as `Input`). */
function selectTriggerClassName({
  disabled,
  className,
}: { disabled?: boolean | null; className?: string } = {}) {
  return cn(
    'border-input dark:bg-input/30 dark:active:bg-input/50 bg-background flex h-10 flex-row items-center justify-between gap-2 rounded-md border px-3 py-2 shadow-sm shadow-black/5 sm:h-9',
    disabled && 'opacity-50',
    className
  );
}

/** gorhom's default handle (10 padding + 4 indicator + 10 padding); gorhom measures it itself. */
const HANDLE_HEIGHT = 24;

/** List `contentContainerStyle.paddingBottom` (plus the bottom safe area without a footer). */
const LIST_PADDING_BOTTOM = 8;

/** Same dim as the RNR Dialog / AlertDialog overlay (`bg-black/50`). */
const BACKDROP_OPACITY = 0.5;

const SearchTextInput = withUniwind(BottomSheetTextInput);

/** Lowercase and strip diacritics (Unicode combining marks left by NFD), so "peru" matches "Perú". */
function normalizeSearch(text: string) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function filterOptions<T extends string>(options: readonly SelectSheetOption<T>[], query: string) {
  const needle = normalizeSearch(query);
  if (!needle) {
    return options;
  }
  return options.filter(
    (option) =>
      normalizeSearch(option.label).includes(needle) ||
      (option.description !== undefined && normalizeSearch(option.description).includes(needle))
  );
}

function renderBackdrop(props: BottomSheetBackdropProps) {
  return (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      opacity={BACKDROP_OPACITY}
      pressBehavior="close"
    />
  );
}

const asColor = (value: string | number | undefined) =>
  typeof value === 'string' ? value : undefined;

/** gorhom styles its background and handle through style props, so token values are read here. */
function useSheetColors() {
  const [background, handle] = useCSSVariable(['--color-popover', '--color-muted-foreground']);
  return { background: asColor(background), handle: asColor(handle) };
}

// ---------------------------------------------------------------------------------------------
// Sheet sections (shared by the sheet and its invisible measurer, so both have the same layout)

const HEADER_CLASS_NAME = cn('gap-3 pb-3 pt-1', SHEET_INSET_X);
const EMPTY_CLASS_NAME = cn('items-center py-6', SHEET_INSET_X);
const FOOTER_CLASS_NAME = cn(
  'border-border flex-row items-center justify-between gap-3 border-t pt-3',
  SHEET_INSET_X
);
/** Footer bottom padding on top of the bottom safe-area inset. */
const FOOTER_PADDING_BOTTOM = 12;

function SheetTitle({ children }: { children: string }) {
  return (
    <Text role="heading" numberOfLines={1} className="text-lg font-semibold">
      {children}
    </Text>
  );
}

function FooterSummary({ children }: { children: string }) {
  return (
    <Text tone="muted" className="text-sm" accessibilityLiveRegion="polite">
      {children}
    </Text>
  );
}

type MeasuredHeights = { header: number; rows: number; empty: number; footer: number };

/**
 * Invisible, non-interactive copy of the sheet content at the sheet's width (the window width),
 * clipped to a 0x0 box so it never affects layout or scrolling. Rendered only for a compact sheet
 * (no search, every option could fit), so other lists cost nothing. Controls are replaced by
 * same-size boxes. Reports heights through `onMeasure`.
 */
function SheetContentMeasurer({
  options,
  multiple,
  title,
  emptyText,
  footerSummary,
  bottomInset,
  onMeasure,
}: {
  options: readonly SelectSheetOption[];
  multiple: boolean;
  title: string;
  emptyText: string;
  footerSummary: string | undefined;
  bottomInset: number;
  onMeasure: (part: keyof MeasuredHeights, height: number) => void;
}) {
  const { width } = useWindowDimensions();
  const measure = (part: keyof MeasuredHeights) => (event: LayoutChangeEvent) =>
    onMeasure(part, event.nativeEvent.layout.height);

  return (
    <View
      pointerEvents="none"
      aria-hidden={true}
      importantForAccessibility="no-hide-descendants"
      style={styles.measurerClip}
    >
      <View style={{ width }}>
        <View className={HEADER_CLASS_NAME} onLayout={measure('header')}>
          <SheetTitle>{title}</SheetTitle>
        </View>
        <View onLayout={measure('rows')}>
          {options.map((option) => (
            <ListItem
              key={option.value}
              title={option.label}
              description={option.description}
              className={SHEET_INSET_X}
              accessible={false}
              focusable={false}
              // Worst case: every row reserves its control (checkbox or check icon) space.
              leading={multiple ? <View className="size-4" /> : undefined}
              trailing={multiple ? undefined : <View className="size-5" />}
            />
          ))}
        </View>
        <View className={EMPTY_CLASS_NAME} onLayout={measure('empty')}>
          <Text tone="muted">{emptyText}</Text>
        </View>
        {footerSummary !== undefined ? (
          <View
            className={FOOTER_CLASS_NAME}
            style={{ paddingBottom: bottomInset + FOOTER_PADDING_BOTTOM }}
            onLayout={measure('footer')}
          >
            <FooterSummary>{footerSummary}</FooterSummary>
            <View className="h-10 w-16 sm:h-9" />
          </View>
        ) : null}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------------------------
// Shared core

type SelectSheetCoreProps<T extends string> = SelectSheetBaseProps<T> & {
  multiple: boolean;
  /** Trigger text for the current value, `undefined` shows the placeholder. */
  displayValue: string | undefined;
  /** The raw selection (`value`), passed to the list as `extraData` so rows re-render on change. */
  selection: unknown;
  isSelected: (value: T) => boolean;
  onOptionPress: (option: SelectSheetOption<T>, dismiss: () => void) => void;
  /** Footer with a summary text and a button that closes the sheet. */
  footer?: { summary: string; actionLabel: string };
};

function SelectSheetCore<T extends string>({
  options,
  placeholder = 'Select an option',
  title,
  searchPlaceholder = 'Search',
  searchable = options.length >= SEARCHABLE_MIN_OPTIONS,
  emptyText = 'No results',
  disabled = false,
  className,
  accessibilityLabel,
  'aria-labelledby': ariaLabelledBy,
  multiple,
  displayValue,
  selection,
  isSelected,
  onOptionPress,
  footer,
}: SelectSheetCoreProps<T>) {
  const sheetRef = React.useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();
  const colors = useSheetColors();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  // Frozen for the whole open session; only `present()` writes it.
  const [snapPoint, setSnapPoint] = React.useState<number | string>(MAX_SNAP_POINT);
  const snapPoints = React.useMemo(() => [snapPoint], [snapPoint]);
  const { height: windowHeight, fontScale } = useWindowDimensions();
  // Latest measured section heights; written by layout events, read when the sheet opens.
  const measuredRef = React.useRef<Partial<MeasuredHeights>>({});

  const sheetTitle = title ?? placeholder;
  const maxHeight = (windowHeight - insets.top) * MAX_SNAP_RATIO;
  // A searchable sheet always opens at its max. Otherwise rows are at least `minHeight` tall, so
  // beyond this count the sheet is always at its max too.
  const compact = !searchable && options.length * LIST_ITEM_METRICS.minHeight < maxHeight;
  const filteredOptions = searchable ? filterOptions(options, query) : options;

  /** Compact content height from the measurer, or a one-line estimate if it has not laid out yet. */
  const contentHeight = () => {
    const measured = measuredRef.current;
    const header = measured.header ?? 4 + 28 * fontScale + 12;
    const rows =
      measured.rows ??
      options.reduce(
        (total, option) =>
          total + estimateListItemHeight({ hasDescription: Boolean(option.description), fontScale }),
        0
      );
    const empty = measured.empty ?? 48 + 24 * fontScale;
    const bottom = footer
      ? (measured.footer ?? 1 + 12 + 40 + FOOTER_PADDING_BOTTOM + insets.bottom)
      : insets.bottom;
    // The reserved list area also fits the empty state, so "No results" never needs to scroll.
    return HANDLE_HEIGHT + header + Math.max(rows, empty) + LIST_PADDING_BOTTOM + bottom;
  };

  const present = () => {
    if (disabled) {
      return;
    }
    // Decided from ALL options at open time (the query is always empty here, it is cleared on
    // dismiss), so later filtering, keyboard events or option changes cannot resize the sheet.
    const fitted = compact ? Math.ceil(contentHeight()) : Infinity;
    setSnapPoint(fitted < maxHeight ? fitted : MAX_SNAP_POINT);
    sheetRef.current?.present();
  };

  const dismiss = () => {
    Keyboard.dismiss();
    sheetRef.current?.dismiss();
  };

  const handleDismiss = () => {
    setOpen(false);
    setQuery('');
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        aria-labelledby={ariaLabelledBy}
        accessibilityValue={{ text: displayValue ?? placeholder }}
        accessibilityState={{ disabled, expanded: open }}
        disabled={disabled}
        onPress={present}
        className={selectTriggerClassName({
          disabled,
          // Full width like Input; pressed tint because the whole field is a button.
          className: cn('active:bg-accent w-full', className),
        })}
      >
        <Text
          numberOfLines={1}
          className={cn('flex-1 text-sm', displayValue === undefined && 'text-muted-foreground')}
        >
          {displayValue ?? placeholder}
        </Text>
        <Icon as={ChevronDown} aria-hidden={true} className="text-muted-foreground size-4" />
      </Pressable>

      {compact ? (
        <SheetContentMeasurer
          options={options}
          multiple={multiple}
          title={sheetTitle}
          emptyText={emptyText}
          footerSummary={footer?.summary}
          bottomInset={insets.bottom}
          onMeasure={(part, height) => {
            measuredRef.current[part] = height;
          }}
        />
      ) : null}

      <BottomSheetModal
        ref={sheetRef}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        topInset={insets.top}
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustPan"
        enableBlurKeyboardOnGesture
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.background }}
        handleIndicatorStyle={{ backgroundColor: colors.handle }}
        onChange={(index) => setOpen(index >= 0)}
        onDismiss={handleDismiss}
      >
        <View className={HEADER_CLASS_NAME}>
          <SheetTitle>{sheetTitle}</SheetTitle>
          {searchable ? (
            <SearchTextInput
              value={query}
              onChangeText={setQuery}
              placeholder={searchPlaceholder}
              accessibilityLabel={searchPlaceholder}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
              clearButtonMode="while-editing"
              className={inputClassName()}
              placeholderTextColorClassName={INPUT_PLACEHOLDER_COLOR_CLASS_NAME}
            />
          ) : null}
        </View>

        <BottomSheetFlatList
          data={filteredOptions}
          extraData={selection}
          keyExtractor={(option) => option.value}
          keyboardShouldPersistTaps="handled"
          style={styles.list}
          contentContainerStyle={{
            paddingBottom: LIST_PADDING_BOTTOM + (footer ? 0 : insets.bottom),
          }}
          ListEmptyComponent={
            <View className={EMPTY_CLASS_NAME}>
              <Text tone="muted">{emptyText}</Text>
            </View>
          }
          renderItem={({ item: option }) => {
            const selected = isSelected(option.value);
            return (
              <ListItem
                title={option.label}
                description={option.description}
                disabled={option.disabled}
                selected={selected}
                checked={selected}
                // Explicit (same as ListItem's default) so rows keep the sheet inset even if
                // ListItem's standalone padding changes.
                className={SHEET_INSET_X}
                accessibilityRole={multiple ? 'checkbox' : 'radio'}
                onPress={() => onOptionPress(option, dismiss)}
                leading={
                  multiple ? (
                    // Visual only: the row owns the press and the accessibility state.
                    <View pointerEvents="none" aria-hidden={true}>
                      <Checkbox checked={selected} onCheckedChange={() => {}} />
                    </View>
                  ) : undefined
                }
                trailing={
                  !multiple && selected ? (
                    <Icon as={Check} aria-hidden={true} className="size-5" />
                  ) : undefined
                }
              />
            );
          }}
        />

        {footer ? (
          <View
            className={FOOTER_CLASS_NAME}
            style={{ paddingBottom: insets.bottom + FOOTER_PADDING_BOTTOM }}
          >
            <FooterSummary>{footer.summary}</FooterSummary>
            <Button onPress={dismiss}>{footer.actionLabel}</Button>
          </View>
        ) : null}
      </BottomSheetModal>
    </>
  );
}

const styles = StyleSheet.create({
  list: { flex: 1 },
  measurerClip: { position: 'absolute', width: 0, height: 0, overflow: 'hidden', opacity: 0 },
});

// ---------------------------------------------------------------------------------------------
// Public components

/** Single selection: closes on pick and marks the selected row with a check. */
function SelectSheet<T extends string = string>({
  value,
  onValueChange,
  ...props
}: SelectSheetProps<T>) {
  const selectedLabel = props.options.find((option) => option.value === value)?.label;

  return (
    <SelectSheetCore
      {...props}
      multiple={false}
      displayValue={selectedLabel}
      selection={value}
      isSelected={(optionValue) => optionValue === value}
      onOptionPress={(option, dismiss) => {
        onValueChange(option.value);
        dismiss();
      }}
    />
  );
}

/** Multiple selection: toggles on pick, stays open, and closes from the footer "Done" button. */
function MultiSelectSheet<T extends string = string>({
  value,
  onValueChange,
  doneLabel = 'Done',
  ...props
}: MultiSelectSheetProps<T>) {
  // Only values that exist in `options` count (stale values are ignored in the label and count).
  const selectedLabels = props.options
    .filter((option) => value.includes(option.value))
    .map((option) => option.label);

  return (
    <SelectSheetCore
      {...props}
      multiple
      displayValue={selectedLabels.length > 0 ? selectedLabels.join(', ') : undefined}
      selection={value}
      isSelected={(optionValue) => value.includes(optionValue)}
      onOptionPress={(option) => {
        onValueChange(
          value.includes(option.value)
            ? value.filter((item) => item !== option.value)
            : [...value, option.value]
        );
      }}
      footer={{ summary: `${selectedLabels.length} selected`, actionLabel: doneLabel }}
    />
  );
}

export { MultiSelectSheet, SelectSheet };
export type { MultiSelectSheetProps, SelectSheetOption, SelectSheetProps };
