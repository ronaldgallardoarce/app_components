import { Link } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';

import { Icon } from '@/design-system/components/icon';
import { Text } from '@/design-system/components/text';

import { CATALOG_GROUPS } from './catalog-groups';

/** Lightweight list of catalog groups: no design-system demos are mounted here. */
export function CatalogIndex() {
  return (
    <ScrollView className="bg-background flex-1" contentContainerClassName="gap-3 p-4">
      {CATALOG_GROUPS.map((group) => (
        <Link key={group.route} href={group.href} asChild>
          <Pressable
            accessibilityRole="link"
            className="border-border bg-card active:bg-accent flex-row items-center gap-3 rounded-lg border p-4"
          >
            <View className="flex-1 gap-1">
              <Text variant="large">{group.title}</Text>
              <Text variant="muted">{group.description}</Text>
            </View>
            <Icon as={ChevronRight} className="text-muted-foreground size-5" />
          </Pressable>
        </Link>
      ))}
    </ScrollView>
  );
}
