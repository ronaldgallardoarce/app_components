import { Bold, ChevronsUpDown, Italic, Underline } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/design-system/components/accordion';
import { AspectRatio } from '@/design-system/components/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '@/design-system/components/avatar';
import { Button } from '@/design-system/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/design-system/components/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/design-system/components/collapsible';
import { Icon } from '@/design-system/components/icon';
import { Separator } from '@/design-system/components/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/design-system/components/tabs';
import { Text } from '@/design-system/components/text';
import { Toggle, ToggleIcon } from '@/design-system/components/toggle';
import {
  ToggleGroup,
  ToggleGroupIcon,
  ToggleGroupItem,
} from '@/design-system/components/toggle-group';

import { Group, Row, Section } from './catalog-layout';

export function LayoutSections() {
  const [tab, setTab] = useState('account');
  const [collapsibleOpen, setCollapsibleOpen] = useState(false);
  const [bold, setBold] = useState(false);
  const [alignment, setAlignment] = useState<string | undefined>('left');
  const [styles, setStyles] = useState<string[]>(['bold']);

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
    </Group>
  );
}
