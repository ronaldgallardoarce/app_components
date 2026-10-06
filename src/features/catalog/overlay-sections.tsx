import { useState } from 'react';
import { View } from 'react-native';

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
import { Button } from '@/design-system/components/button';
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
import { Input } from '@/design-system/components/input';
import { Label } from '@/design-system/components/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/design-system/components/popover';
import { Text } from '@/design-system/components/text';

import { Group, Row, Section, useContentInsets } from './catalog-layout';

export function OverlaySections() {
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
    </Group>
  );
}
