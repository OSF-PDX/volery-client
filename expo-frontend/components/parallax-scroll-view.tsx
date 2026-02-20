import type { PropsWithChildren, ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedRef } from "react-native-reanimated";

import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";

const HEADER_HEIGHT = 100;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  const backgroundColor = useThemeColor({}, "background");
  const colorScheme = useColorScheme() ?? "light";
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          { backgroundColor: headerBackgroundColor[colorScheme] },
        ]}
      >
        {headerImage}
      </View>

      <Animated.ScrollView
        ref={scrollRef}
        style={{ backgroundColor, flex: 1 }}
        contentContainerStyle={{ paddingTop: HEADER_HEIGHT }}
        scrollEventThrottle={16}
      >
        <ThemedView style={styles.content}>{children}</ThemedView>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    overflow: "hidden",
    zIndex: 10,
  },
  content: {
    flex: 1,
    padding: 0,
    gap: 16,
    overflow: "hidden",
  },
});
