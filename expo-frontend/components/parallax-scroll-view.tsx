import type { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedRef } from "react-native-reanimated";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import AppHeader from "@/components/AppHeader";

const HEADER_HEIGHT = 100;

type Props = PropsWithChildren<{
  headerBackgroundColor: { dark: string; light: string };
  selectedDate: string | null;
  availableDates: string[];
  onPreviousDay: () => void;
  onNextDay: () => void;
}>;

export default function ParallaxScrollView({
  children,
  headerBackgroundColor,
  selectedDate,
  availableDates,
  onPreviousDay,
  onNextDay,
}: Props) {
  const backgroundColor = useThemeColor({}, "background");
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  return (
    <View style={styles.container}>
      <AppHeader
        headerBackgroundColor={headerBackgroundColor} 
        selectedDate={selectedDate}
        availableDates={availableDates}
        onPreviousDay={onPreviousDay}
        onNextDay={onNextDay}
      />

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
  content: {
    flex: 1,
    padding: 0,
    gap: 16,
    overflow: "hidden",
  }
});