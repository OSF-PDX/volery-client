import { StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import SessionsList from "@/components/SessionsList";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedView } from "@/components/themed-view";
import { useSessions } from "@/contexts/SessionsContext";

export default function HomeScreen() {
  const { availableDates } = useSessions();
  const [ selectedDate, setSelectedDate ] = useState<string | null>(null);

  useEffect(() => {
    if (availableDates.length > 0 && selectedDate === null) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates]);

  const currentIndex = availableDates.indexOf(selectedDate ?? "");

  const handlePreviousDay = () => {
    if (currentIndex > 0) setSelectedDate(availableDates[currentIndex - 1]);
  };

  const handleNextDay = () => {
    if (currentIndex < availableDates.length - 1)
      setSelectedDate(availableDates[currentIndex + 1]);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#ffffff" }}
      selectedDate={selectedDate}
      availableDates={availableDates}
      onPreviousDay={handlePreviousDay}
      onNextDay={handleNextDay}
    >
      <ThemedView style={styles.stepContainer}>
        <SessionsList selectedDate={selectedDate} />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  stepContainer: { gap: 8, marginBottom: 8},
});
