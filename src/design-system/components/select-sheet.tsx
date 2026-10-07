import { Button } from "@/design-system/components/button";
import { Checkbox } from "@/design-system/components/checkbox";
import { Icon } from "@/design-system/components/icon";
import {
  INPUT_PLACEHOLDER_COLOR_CLASS_NAME,
  inputClassName,
} from "@/design-system/components/input";
import {
  LIST_ITEM_METRICS,
  ListItem,
} from "@/design-system/components/list-item";

import { Text } from "@/design-system/components/text";
import { cn } from "@/design-system/lib/utils";
import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { Check, ChevronDown } from "lucide-react-native";
import * as React from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCSSVariable, withUniwind } from "uniwind";

// Searchable single / multiple select presented in a @gorhom/bottom-sheet modal.
// Requires `GestureHandlerRootView` + `BottomSheetModalProvider` at the app root (src/app/_layout.tsx).
//
// Sheet behavior contract:
// - Search is shown only for long lists (`SEARCHABLE_MIN_OPTIONS`), overridable with `searchable`.
//   A short list has no input, so the keyboard never interacts with a compact sheet.
// - Compact (no search and every option could fit within the max height): gorhom DYNAMIC SIZING.
//   The whole content (header, rows, empty state, footer and the bottom safe-area padding) lives in
//   ONE `BottomSheetScrollView`, whose real content size gorhom adds to its own measured handle
//   height, capped by `maxDynamicContentSize` (= the max height). No hand-made measurement, so
//   wrapping, font scale, breakpoints, handle size and insets are always exact. If the content is
//   taller than the cap (large font scale, long descriptions) it scrolls. Without search the content
//   never changes while open, so dynamic sizing cannot resize the sheet under the user.
// - Searchable (or a long non-searchable list): FIXED height. `enableDynamicSizing={false}` and ONE
//   snap point (MAX_SNAP_POINT), so typing never resizes the sheet (dynamic sizing would re-measure
//   the filtered list and shrink it). The virtualized list takes the remaining space (`flex: 1`).
// - Bottom safe area: the sheet is drawn to the bottom of the screen (edge-to-edge on Android), so
//   the last element (list padding or footer) adds `insets.bottom` and stays above the navigation
//   bar / home indicator.
// - `topInset` = top safe area: the container starts below the status bar / notch, so neither the
//   max snap point nor the dynamic size can place the sheet above the visible area.
// - Keyboard: `extend` keeps the sheet at its (single) snap point and shrinks the content by the
//   keyboard height, so the list ends exactly at the keyboard and every row stays reachable by
//   scrolling. `interactive` is not used: it moves the sheet to a temporary position that, on
//   Android, races the window pan and leaves rows hidden or flickering.
//   Android uses `adjustPan` (gorhom's own keyboard offset): Expo SDK 54+ enforces edge-to-edge,
//   where `softwareKeyboardLayoutMode: "resize"` no longer resizes the window, so `adjustResize`
//   (which makes gorhom ignore the keyboard) would leave the list under the keyboard.
// - Dragging: the sheet only moves (translateY), its layout never changes mid-gesture. gorhom's
//   content mask adds an "over-drag safe" bottom padding = sqrt(position + containerHeight) *
//   `overDragResistanceFactor` and re-animates its `height` + `paddingBottom` (layout props, a
//   new timing animation per frame) whenever the position changes, i.e. on every frame of a drag
//   below the top detent. That per-frame relayout of the scroll view / list is what flickered on
//   Android. So over-drag is disabled and the factor is 0: the padding is constant, nothing is
//   laid out during the drag, and the sheet does not rubber-band past its top position (that
//   padding only existed to cover the gap such a stretch would open below the sheet).

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
  "aria-labelledby"?: string;
};

type SelectSheetProps<T extends string = string> = SelectSheetBaseProps<T> & {
  value: T | undefined;
  onValueChange: (value: T) => void;
};

type MultiSelectSheetProps<T extends string = string> =
  SelectSheetBaseProps<T> & {
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
const SHEET_INSET_X = "px-4";

/** Field-like trigger classes (same height, border and padding as `Input`). */
function selectTriggerClassName({
  disabled,
  className,
}: { disabled?: boolean | null; className?: string } = {}) {
  return cn(
    "border-input dark:bg-input/30 dark:active:bg-input/50 bg-background flex h-10 flex-row items-center justify-between gap-2 rounded-md border px-3 py-2 shadow-sm shadow-black/5 sm:h-9",
    disabled && "opacity-50",
    className,
  );
}

/** List bottom padding (plus the bottom safe area without a footer). */
const LIST_PADDING_BOTTOM = 8;

/** Same dim as the RNR Dialog / AlertDialog overlay (`bg-black/50`). */
const BACKDROP_OPACITY = 0.5;

const SearchTextInput = withUniwind(BottomSheetTextInput);

/** Lowercase and strip diacritics (Unicode combining marks left by NFD), so "peru" matches "Perú". */
function normalizeSearch(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function filterOptions<T extends string>(
  options: readonly SelectSheetOption<T>[],
  query: string,
) {
  const needle = normalizeSearch(query);
  if (!needle) {
    return options;
  }
  return options.filter(
    (option) =>
      normalizeSearch(option.label).includes(needle) ||
      (option.description !== undefined &&
        normalizeSearch(option.description).includes(needle)),
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
  typeof value === "string" ? value : undefined;

/** gorhom styles its background and handle through style props, so token values are read here. */
function useSheetColors() {
  const [background, handle] = useCSSVariable([
    "--color-popover",
    "--color-muted-foreground",
  ]);
  return { background: asColor(background), handle: asColor(handle) };
}

// ---------------------------------------------------------------------------------------------
// Sheet sections

const HEADER_CLASS_NAME = cn("gap-3 pb-3 pt-1", SHEET_INSET_X);
const EMPTY_CLASS_NAME = cn("items-center py-6", SHEET_INSET_X);
const FOOTER_CLASS_NAME = cn(
  "border-border flex-row items-center justify-between gap-3 border-t pt-3",
  SHEET_INSET_X,
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

/** The searchable / long sheet always opens at its max (see the contract at the top). */
const FIXED_SNAP_POINTS = [MAX_SNAP_POINT];

function SelectSheetCore<T extends string>({
  options,
  placeholder = "Select an option",
  title,
  searchPlaceholder = "Search",
  searchable = options.length >= SEARCHABLE_MIN_OPTIONS,
  emptyText = "No results",
  disabled = false,
  className,
  accessibilityLabel,
  "aria-labelledby": ariaLabelledBy,
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
  const [query, setQuery] = React.useState("");
  const { height: windowHeight } = useWindowDimensions();

  const sheetTitle = title ?? placeholder;
  const maxHeight = Math.floor((windowHeight - insets.top) * MAX_SNAP_RATIO);
  // Rows are at least `minHeight` tall, so beyond this count the content can never fit and the
  // virtualized fixed-height list is used instead of rendering every row in a scroll view.
  const compact =
    !searchable && options.length * LIST_ITEM_METRICS.minHeight < maxHeight;
  const filteredOptions = searchable ? filterOptions(options, query) : options;

  const present = () => {
    if (disabled) {
      return;
    }
    sheetRef.current?.present();
  };

  const dismiss = () => {
    Keyboard.dismiss();
    sheetRef.current?.dismiss();
  };

  const handleDismiss = () => {
    setOpen(false);
    setQuery("");
  };

  const renderOption = (option: SelectSheetOption<T>) => {
    const selected = isSelected(option.value);
    return (
      <ListItem
        key={option.value}
        title={option.label}
        description={option.description}
        disabled={option.disabled}
        selected={selected}
        checked={selected}
        // Explicit (same as ListItem's default) so rows keep the sheet inset even if ListItem's
        // standalone padding changes.
        className={SHEET_INSET_X}
        accessibilityRole={multiple ? "checkbox" : "radio"}
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
  };

  const header = (
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
  );

  const emptyState = (
    <View className={EMPTY_CLASS_NAME}>
      <Text tone="muted">{emptyText}</Text>
    </View>
  );

  const footerView = footer ? (
    <View
      className={FOOTER_CLASS_NAME}
      style={{ paddingBottom: insets.bottom + FOOTER_PADDING_BOTTOM }}
    >
      <FooterSummary>{footer.summary}</FooterSummary>
      <Button onPress={dismiss}>{footer.actionLabel}</Button>
    </View>
  ) : null;

  // Bottom padding after the rows; the footer carries the safe area itself when present.
  const listPaddingBottom = LIST_PADDING_BOTTOM + (footer ? 0 : insets.bottom);

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
          className: cn("active:bg-accent w-full", className),
        })}
      >
        <Text
          numberOfLines={1}
          className={cn(
            "flex-1 text-sm",
            displayValue === undefined && "text-muted-foreground",
          )}
        >
          {displayValue ?? placeholder}
        </Text>
        <Icon
          as={ChevronDown}
          aria-hidden={true}
          className="text-muted-foreground size-4"
        />
      </Pressable>

      <BottomSheetModal
        ref={sheetRef}
        // Compact: gorhom measures the scroll view content; otherwise one fixed snap point.
        enableDynamicSizing={compact}
        maxDynamicContentSize={compact ? maxHeight : undefined}
        snapPoints={compact ? undefined : FIXED_SNAP_POINTS}
        topInset={insets.top}
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustPan"
        enableBlurKeyboardOnGesture
        enablePanDownToClose
        // No over-drag (see "Dragging" in the contract at the top): gorhom derives the content
        // mask's `height`/`paddingBottom` from the drag position times this factor and restarts a
        // layout animation on every gesture frame, which relayouts the list while dragging and
        // flickers on Android. A factor of 0 keeps that padding constant (0 + keyboard height).
        enableOverDrag={false}
        overDragResistanceFactor={0}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.background }}
        handleIndicatorStyle={{ backgroundColor: colors.handle }}
        onChange={(index) => setOpen(index >= 0)}
        onDismiss={handleDismiss}
      >
        {compact ? (
          // Everything in one scrollable so its content size is the whole sheet content, and it
          // still scrolls if that is taller than `maxDynamicContentSize`.
          <BottomSheetScrollView
            contentContainerStyle={
              footer ? undefined : { paddingBottom: listPaddingBottom }
            }
          >
            {header}
            {options.length > 0 ? options.map(renderOption) : emptyState}
            {footer ? <View style={{ height: LIST_PADDING_BOTTOM }} /> : null}
            {footerView}
          </BottomSheetScrollView>
        ) : (
          <>
            {header}
            <BottomSheetFlatList
              data={filteredOptions}
              extraData={selection}
              keyExtractor={(option) => option.value}
              keyboardShouldPersistTaps="handled"
              style={styles.list}
              contentContainerStyle={{ paddingBottom: listPaddingBottom }}
              ListEmptyComponent={emptyState}
              renderItem={({ item: option }) => renderOption(option)}
            />
            {footerView}
          </>
        )}
      </BottomSheetModal>
    </>
  );
}

const styles = StyleSheet.create({
  list: { flex: 1 },
});

// ---------------------------------------------------------------------------------------------
// Public components

/** Single selection: closes on pick and marks the selected row with a check. */
function SelectSheet<T extends string = string>({
  value,
  onValueChange,
  ...props
}: SelectSheetProps<T>) {
  const selectedLabel = props.options.find(
    (option) => option.value === value,
  )?.label;

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
  doneLabel = "Done",
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
      displayValue={
        selectedLabels.length > 0 ? selectedLabels.join(", ") : undefined
      }
      selection={value}
      isSelected={(optionValue) => value.includes(optionValue)}
      onOptionPress={(option) => {
        onValueChange(
          value.includes(option.value)
            ? value.filter((item) => item !== option.value)
            : [...value, option.value],
        );
      }}
      footer={{
        summary: `${selectedLabels.length} selected`,
        actionLabel: doneLabel,
      }}
    />
  );
}

export { MultiSelectSheet, SelectSheet };
export type { MultiSelectSheetProps, SelectSheetOption, SelectSheetProps };
