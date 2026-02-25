import { Image } from "expo-image";
import { StyleSheet } from "react-native";

import SessionsList from "@/components/SessionsList";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedView } from "@/components/themed-view";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#ffffff" }}
      headerImage={
        <Image
          source={require("@/assets/images/26NTCLogo.webp")}
          style={styles.voleryLogo}
        />
      }
    >
      <ThemedView style={styles.stepContainer}>
        {/* <ThemedText><SessionsList /></ThemedText> */}
        <SessionsList />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  voleryLogo: {
    height: 100,
    width: 225,
    bottom: 0,
  },
});
