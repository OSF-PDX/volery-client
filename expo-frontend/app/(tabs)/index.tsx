import { useState } from "react";
import { StyleSheet } from "react-native";
import SessionsList from "@/components/SessionsList";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedView } from "@/components/themed-view";

export default function HomeScreen() {
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleDatesLoaded = (dates: string[]) => {
    setAvailableDates(dates);
    if (dates.length > 0 && selectedDate === null) {
      setSelectedDate(dates[0]);
    }
  };

  const handlePreviousDay = () => {
    const currentIndex = availableDates.indexOf(selectedDate!);
    if (currentIndex > 0) setSelectedDate(availableDates[currentIndex - 1]);
  };

  const handleNextDay = () => {
    const currentIndex = availableDates.indexOf(selectedDate!);
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
        <SessionsList
          selectedDate={selectedDate}
          onDatesLoaded={handleDatesLoaded}
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
});
