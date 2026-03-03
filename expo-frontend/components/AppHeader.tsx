import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useColorScheme } from "react-native";
import { format, parseISO } from "date-fns";

type Props = {
    headerBackgroundColor: { dark: string; light: string };
    selectedDate: string | null;
    availableDates: string[];
    onPreviousDay: () => void;
    onNextDay: () => void;
};

export default function AppHeader({ 
    headerBackgroundColor,
    selectedDate,
    availableDates,
    onPreviousDay,
    onNextDay,
}: Props) {
    const colorScheme = useColorScheme() ?? "light";

    const currentIndex = selectedDate ? availableDates.indexOf(selectedDate) : -1;
    const canGoPrevious = currentIndex > 0;
    const canGoNext = currentIndex < availableDates.length - 1;

    const displayDate = selectedDate
        ? format(parseISO(selectedDate), "EEEE, MMMM, d")
        : "Loading...";

    return (
        <View
            style={[
                styles.header,
                { backgroundColor: headerBackgroundColor[colorScheme] },
            ]}
        >
            <TouchableOpacity
                onPress={onPreviousDay}
                disabled={!canGoPrevious}
                style={[styles.arrow, !canGoPrevious && styles.arrowDisabled]}
            >
                <Text style={styles.arrowText}>{"<"}</Text>
            </TouchableOpacity>

            <Text style={styles.dateText}>{displayDate}</Text>

            <TouchableOpacity
                onPress={onNextDay}
                disabled={!canGoNext}
                style={[styles.arrow, !canGoNext && styles.arrowDisabled]}
            >
                <Text style={styles.arrowText}>{">"}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 100,
        overflow: "hidden",
        zIndex: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
    },
    arrow: {
        padding: 8,
    },
    arrowDisabled: {
        opacity: 0.3,
    },
    arrowText: {
        fontSize: 36,
        fontWeight: "300",
        lineHeight: 40,
    },
    dateText: {
        fontSize: 16,
        fontWeight: "600",
        flex: 1,
        textAlign: "center",
    },
});