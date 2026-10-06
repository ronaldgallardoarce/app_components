import { Link } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/design-system/components/button';
import { Text } from '@/design-system/components/text';

export default function HomeScreen() {
  return (
    <View className="bg-background flex-1 items-center justify-center gap-6 px-6">
      <View className="items-center gap-2">
        <Text variant="h1">App Components</Text>
        <Text variant="muted" className="text-center">
          Design system playground built on React Native Reusables and Uniwind.
        </Text>
      </View>
      <Link href="/catalog" asChild>
        <Button>Open catalog</Button>
      </Link>
    </View>
  );
}
