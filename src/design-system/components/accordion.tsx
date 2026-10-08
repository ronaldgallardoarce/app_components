import { Icon } from '@/design-system/components/icon';
import { renderTextChildren, TextClassContext } from '@/design-system/components/text';
import { cn } from '@/design-system/lib/utils';
import * as AccordionPrimitive from '@rn-primitives/accordion';
import { ChevronDown } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import Animated, {
  FadeOutUp,
  LayoutAnimationConfig,
  LinearTransition,
  ReduceMotion,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';

function Accordion({
  children,
  ref,
  ...props
}: Omit<React.ComponentProps<typeof AccordionPrimitive.Root>, 'asChild'>) {
  return (
    <LayoutAnimationConfig skipEntering>
      {/* No `layout` transition on the root: it only re-animated the whole accordion's frame on
          every toggle. Each item animates its own size and position (see `AccordionItem`), which
          is what moves the following items smoothly. */}
      <AccordionPrimitive.Root
        {...(props as AccordionPrimitive.RootProps)}
        asChild>
        <View>{children}</View>
      </AccordionPrimitive.Root>
    </LayoutAnimationConfig>
  );
}

function AccordionItem({
  children,
  className,
  value,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn('border-border border-b', className)}
      value={value}
      asChild
      {...props}>
      <Animated.View className="overflow-hidden" layout={LinearTransition.duration(200)}>
        {children}
      </Animated.View>
    </AccordionPrimitive.Item>
  );
}


function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & {
  children?: React.ReactNode;
}) {
  const { isExpanded } = AccordionPrimitive.useItemContext();

  const progress = useDerivedValue(
    () => (isExpanded ? withTiming(1, { duration: 250 }) : withTiming(0, { duration: 200 })),
    [isExpanded]
  );
  const chevronStyle = useAnimatedStyle(
    () => ({
      transform: [{ rotate: `${progress.value * 180}deg` }],
    }),
    [progress]
  );

  return (
    <TextClassContext.Provider value="text-left text-sm font-medium">
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger {...props} asChild>
          <Pressable
            className={cn(
              'flex-row items-start justify-between gap-4 rounded-md py-4 disabled:opacity-50',
              className
            )}>
            {/* Yoga gives Text `flexShrink: 0`: without this wrapper a long title pushes the
                chevron out of the row. `min-w-0 flex-1` lets the title wrap instead. */}
            <View className="min-w-0 flex-1">{renderTextChildren(children)}</View>
            <Animated.View className="shrink-0" style={chevronStyle}>
              <Icon
                as={ChevronDown}
                size={16}
                className="text-muted-foreground shrink-0"
              />
            </Animated.View>
          </Pressable>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
    </TextClassContext.Provider>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <TextClassContext.Provider value="text-sm">
      <AccordionPrimitive.Content
        className="overflow-hidden"
        {...props}>
        <Animated.View
          exiting={FadeOutUp.duration(200).reduceMotion(ReduceMotion.System)}
          className={cn('pb-4', className)}>
          {children}
        </Animated.View>
      </AccordionPrimitive.Content>
    </TextClassContext.Provider>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
