import {
  AlertCircle,
  Bold,
  CheckCircle2,
  ChevronsUpDown,
  Info,
  Italic,
  Terminal,
  TriangleAlert,
  Underline,
} from 'lucide-react-native';
import { useState } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/design-system/components/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/design-system/components/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/design-system/components/alert-dialog';
import { AspectRatio } from '@/design-system/components/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '@/design-system/components/avatar';
import { Badge, type BadgeVariant } from '@/design-system/components/badge';
import { Button, type ButtonSize, type ButtonVariant } from '@/design-system/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/design-system/components/card';
import { Checkbox } from '@/design-system/components/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/design-system/components/collapsible';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/design-system/components/context-menu';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/design-system/components/dialog';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/design-system/components/dropdown-menu';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/design-system/components/hover-card';
import { Icon } from '@/design-system/components/icon';
import { Input } from '@/design-system/components/input';
import { Label } from '@/design-system/components/label';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/design-system/components/menubar';
import { Popover, PopoverContent, PopoverTrigger } from '@/design-system/components/popover';
import { Progress } from '@/design-system/components/progress';
import { RadioGroup, RadioGroupItem } from '@/design-system/components/radio-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/design-system/components/select';
import { Separator } from '@/design-system/components/separator';
import { Skeleton } from '@/design-system/components/skeleton';
import { Switch } from '@/design-system/components/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/design-system/components/tabs';
import { Text, type TextTone, type TextVariant } from '@/design-system/components/text';
import { Textarea } from '@/design-system/components/textarea';
import { Toggle, ToggleIcon } from '@/design-system/components/toggle';
import {
  ToggleGroup,
  ToggleGroupIcon,
  ToggleGroupItem,
} from '@/design-system/components/toggle-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/design-system/components/tooltip';
import type { ThemePreference } from '@/design-system/preference/theme-preference';
import { useThemePreference } from '@/design-system/preference/use-theme-preference';

// Dev catalog: renders every design-system component with its variants, sizes and states to
// validate tokens, interactions and themes on a device.

const THEME_PREFERENCES: readonly ThemePreference[] = ['light', 'dark', 'system'];

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

const BADGE_VARIANTS: readonly BadgeVariant[] = [
  'primary',
  'secondary',
  'outline',
  'danger',
  'success',
  'warning',
  'info',
];

const ALERTS = [
  { variant: 'default', icon: Terminal, title: 'Heads up!', description: 'Neutral information.' },
  { variant: 'danger', icon: AlertCircle, title: 'Error', description: 'Your session expired.' },
  { variant: 'success', icon: CheckCircle2, title: 'Saved', description: 'Changes are stored.' },
  { variant: 'warning', icon: TriangleAlert, title: 'Warning', description: 'Low storage.' },
  { variant: 'info', icon: Info, title: 'Info', description: 'A new version is out.' },
] as const;

const FRUITS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'grapes', label: 'Grapes' },
] as const;

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="gap-6">
      <Text variant="h2" className="text-left">
        {title}
      </Text>
      {children}
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="gap-3">
      <Text variant="h4">{title}</Text>
      {children}
    </View>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <View className="flex-row flex-wrap items-center gap-2">{children}</View>;
}

/** Native overlays need the safe-area insets to avoid notches and the home indicator. */
function useContentInsets() {
  const insets = useSafeAreaInsets();
  return { top: insets.top, bottom: insets.bottom, left: 12, right: 12 };
}

function FoundationsSections() {
  const { preference, setPreference } = useThemePreference();
  return (
    <>
      <Section title="Theme">
        <Row>
          {THEME_PREFERENCES.map((option) => (
            <Button
              key={option}
              size="sm"
              variant={preference === option ? 'primary' : 'outline'}
              onPress={() => setPreference(option)}
            >
              {option}
            </Button>
          ))}
        </Row>
      </Section>

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
    </>
  );
}

function FormSections() {
  const contentInsets = useContentInsets();
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [terms, setTerms] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [plan, setPlan] = useState('monthly');

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

      <Section title="Select">
        <Select>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent insets={contentInsets} className="w-[220px]">
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              {FRUITS.map((fruit) => (
                <SelectItem key={fruit.value} label={fruit.label} value={fruit.value} />
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select disabled>
          <SelectTrigger size="sm" className="w-[220px]" disabled>
            <SelectValue placeholder="Disabled (sm)" />
          </SelectTrigger>
        </Select>
      </Section>
    </Group>
  );
}

function FeedbackSections() {
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

function OverlaySections() {
  const contentInsets = useContentInsets();
  const [showStatusBar, setShowStatusBar] = useState(true);
  const [position, setPosition] = useState('top');
  const [lastAction, setLastAction] = useState('none');

  return (
    <Group title="Overlays">
      <Section title="Dialog">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Edit profile</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>Make changes to your profile here.</DialogDescription>
            </DialogHeader>
            <View className="gap-2">
              <Label nativeID="dialog-name">Name</Label>
              <Input aria-labelledby="dialog-name" defaultValue="Pedro Duarte" />
            </View>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button>Save changes</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Section>

      <Section title="Alert dialog">
        <Row>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Show dialog</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  <Text>Cancel</Text>
                </AlertDialogCancel>
                <AlertDialogAction>
                  <Text>Continue</Text>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="danger">Delete account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently deletes your account and data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  <Text>Cancel</Text>
                </AlertDialogCancel>
                <AlertDialogAction variant="danger">
                  <Text>Delete</Text>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Row>
      </Section>

      <Section title="Popover">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Open popover</Button>
          </PopoverTrigger>
          <PopoverContent insets={contentInsets} className="w-80">
            <View className="gap-2">
              <Text variant="large">Dimensions</Text>
              <Text variant="muted">Set the dimensions for the layer.</Text>
              <Input placeholder="Width" />
            </View>
          </PopoverContent>
        </Popover>
      </Section>

      <Section title="Tooltip">
        <Tooltip delayDuration={150}>
          <TooltipTrigger asChild>
            <Button variant="outline">{Platform.OS === 'web' ? 'Hover me' : 'Press me'}</Button>
          </TooltipTrigger>
          <TooltipContent insets={contentInsets}>
            <Text>Add to library</Text>
          </TooltipContent>
        </Tooltip>
      </Section>

      <Section title="Dropdown menu">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent insets={contentInsets} className="w-56" align="start">
            <DropdownMenuLabel>My account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onPress={() => setLastAction('profile')}>
              <Text>Profile</Text>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <Text>Billing (disabled)</Text>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={showStatusBar}
              onCheckedChange={setShowStatusBar}
              closeOnPress={false}
            >
              <Text>Status bar</Text>
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
              <DropdownMenuRadioItem value="top" closeOnPress={false}>
                <Text>Top</Text>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="bottom" closeOnPress={false}>
                <Text>Bottom</Text>
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="danger" onPress={() => setLastAction('delete')}>
              <Text>Delete</Text>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Text variant="muted">
          Last action: {lastAction} · status bar: {showStatusBar ? 'on' : 'off'} · {position}
        </Text>
      </Section>

      <Section title="Context menu">
        <ContextMenu>
          <ContextMenuTrigger className="border-border h-24 items-center justify-center rounded-md border border-dashed">
            <Text variant="muted">
              {Platform.OS === 'web' ? 'Right click here' : 'Long press here'}
            </Text>
          </ContextMenuTrigger>
          <ContextMenuContent insets={contentInsets} className="w-56">
            <ContextMenuItem onPress={() => setLastAction('back')}>
              <Text>Back</Text>
            </ContextMenuItem>
            <ContextMenuItem onPress={() => setLastAction('reload')}>
              <Text>Reload</Text>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem variant="danger" onPress={() => setLastAction('remove')}>
              <Text>Remove</Text>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </Section>

      <Section title="Hover card">
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link">@expo</Button>
          </HoverCardTrigger>
          <HoverCardContent insets={contentInsets} className="w-72">
            <View className="gap-1">
              <Text variant="small">@expo</Text>
              <Text variant="muted">Universal apps for Android, iOS and the web.</Text>
            </View>
          </HoverCardContent>
        </HoverCard>
      </Section>
    </Group>
  );
}

function LayoutSections() {
  const contentInsets = useContentInsets();
  const [tab, setTab] = useState('account');
  const [collapsibleOpen, setCollapsibleOpen] = useState(false);
  const [bold, setBold] = useState(false);
  const [alignment, setAlignment] = useState<string | undefined>('left');
  const [styles, setStyles] = useState<string[]>(['bold']);
  const [menu, setMenu] = useState<string | undefined>(undefined);

  return (
    <Group title="Layout and data display">
      <Section title="Card">
        <Card>
          <CardHeader>
            <CardTitle>Create project</CardTitle>
            <CardDescription>Deploy your new project in one click.</CardDescription>
          </CardHeader>
          <CardContent>
            <Text>Cards group related content and actions.</Text>
          </CardContent>
          <CardFooter className="gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Deploy</Button>
          </CardFooter>
        </Card>
      </Section>

      <Section title="Separator">
        <View className="gap-2">
          <Text variant="small">Radix Primitives</Text>
          <Separator />
          <View className="h-5 flex-row items-center gap-3">
            <Text variant="muted">Blog</Text>
            <Separator orientation="vertical" />
            <Text variant="muted">Docs</Text>
            <Separator orientation="vertical" />
            <Text variant="muted">Source</Text>
          </View>
        </View>
      </Section>

      <Section title="Tabs">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="account">
              <Text>Account</Text>
            </TabsTrigger>
            <TabsTrigger value="password">
              <Text>Password</Text>
            </TabsTrigger>
            <TabsTrigger value="disabled" disabled>
              <Text>Disabled</Text>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <CardContent>
                <Text>Account settings.</Text>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardContent>
                <Text>Password settings.</Text>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Section>

      <Section title="Accordion">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <Text>Is it accessible?</Text>
            </AccordionTrigger>
            <AccordionContent>
              <Text>Yes. It adheres to the WAI-ARIA design pattern.</Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <Text>Is it styled?</Text>
            </AccordionTrigger>
            <AccordionContent>
              <Text>Yes. It uses the design-system tokens.</Text>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section title="Collapsible">
        <Collapsible open={collapsibleOpen} onOpenChange={setCollapsibleOpen} className="gap-2">
          <View className="flex-row items-center justify-between">
            <Text variant="small">3 repositories</Text>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                accessibilityLabel={collapsibleOpen ? 'Collapse' : 'Expand'}
              >
                <Icon as={ChevronsUpDown} className="size-4" />
              </Button>
            </CollapsibleTrigger>
          </View>
          <View className="border-border rounded-md border px-4 py-3">
            <Text variant="code">@rn-primitives/portal</Text>
          </View>
          <CollapsibleContent className="gap-2">
            <View className="border-border rounded-md border px-4 py-3">
              <Text variant="code">@rn-primitives/slot</Text>
            </View>
            <View className="border-border rounded-md border px-4 py-3">
              <Text variant="code">uniwind</Text>
            </View>
          </CollapsibleContent>
        </Collapsible>
      </Section>

      <Section title="Aspect ratio">
        <AspectRatio ratio={16 / 9}>
          <View className="bg-muted size-full items-center justify-center rounded-md">
            <Text variant="muted">16 : 9</Text>
          </View>
        </AspectRatio>
      </Section>

      <Section title="Avatar">
        <Row>
          <Avatar alt="Expo avatar">
            <AvatarImage source={{ uri: 'https://github.com/expo.png' }} />
            <AvatarFallback>
              <Text>EX</Text>
            </AvatarFallback>
          </Avatar>
          <Avatar alt="Fallback avatar">
            <AvatarImage source={{ uri: 'https://invalid.example/broken.png' }} />
            <AvatarFallback>
              <Text>AB</Text>
            </AvatarFallback>
          </Avatar>
        </Row>
      </Section>

      <Section title="Toggle">
        <Row>
          <Toggle pressed={bold} onPressedChange={setBold} aria-label="Toggle bold">
            <ToggleIcon as={Bold} />
          </Toggle>
          <Toggle
            variant="outline"
            pressed={bold}
            onPressedChange={setBold}
            aria-label="Toggle bold outline"
          >
            <ToggleIcon as={Bold} />
            <Text>Bold</Text>
          </Toggle>
          <Toggle size="sm" pressed={false} onPressedChange={() => {}} disabled aria-label="Disabled">
            <ToggleIcon as={Italic} />
          </Toggle>
          <Toggle size="lg" pressed={bold} onPressedChange={setBold} aria-label="Toggle bold large">
            <ToggleIcon as={Bold} />
          </Toggle>
        </Row>
      </Section>

      <Section title="Toggle group">
        <ToggleGroup type="single" value={alignment} onValueChange={setAlignment} variant="outline">
          {['left', 'center', 'right'].map((value, index, all) => (
            <ToggleGroupItem
              key={value}
              value={value}
              isFirst={index === 0}
              isLast={index === all.length - 1}
              aria-label={`Align ${value}`}
            >
              <Text>{value}</Text>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <ToggleGroup type="multiple" value={styles} onValueChange={setStyles}>
          <ToggleGroupItem value="bold" isFirst aria-label="Toggle bold">
            <ToggleGroupIcon as={Bold} />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle italic">
            <ToggleGroupIcon as={Italic} />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" isLast aria-label="Toggle underline">
            <ToggleGroupIcon as={Underline} />
          </ToggleGroupItem>
        </ToggleGroup>
      </Section>

      <Section title="Menubar">
        <Menubar value={menu} onValueChange={setMenu}>
          <MenubarMenu value="file">
            <MenubarTrigger>
              <Text>File</Text>
            </MenubarTrigger>
            <MenubarContent insets={contentInsets}>
              <MenubarItem>
                <Text>New tab</Text>
              </MenubarItem>
              <MenubarItem>
                <Text>New window</Text>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem variant="danger">
                <Text>Quit</Text>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu value="edit">
            <MenubarTrigger>
              <Text>Edit</Text>
            </MenubarTrigger>
            <MenubarContent insets={contentInsets}>
              <MenubarItem>
                <Text>Undo</Text>
              </MenubarItem>
              <MenubarItem disabled>
                <Text>Redo (disabled)</Text>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </Section>
    </Group>
  );
}

export default function CatalogScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView className="bg-background flex-1" keyboardShouldPersistTaps="handled">
      <View className="gap-10 px-4 pt-6" style={{ paddingBottom: insets.bottom + 32 }}>
        <FoundationsSections />
        <FormSections />
        <FeedbackSections />
        <OverlaySections />
        <LayoutSections />
      </View>
    </ScrollView>
  );
}
