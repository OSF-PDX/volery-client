import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useSessions } from "@/contexts/SessionsContext";
import SessionItem from "@/components/SessionItem";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function AllEventsScreen() {
    const { sessions, loading, error } = useSessions();
    const backgroundColor = useThemeColor({}, "background");

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Loading sessions...</Text>
            </View>
        );
    }

    if (error && sessions.length === 0) {
        return (
            <View style={styles.centered}>
                <Text style={styles.error}>Error: {error}</Text>
                <Text style={styles.errorDetails}>
                    Please check your network connection and try again.
                </Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={[StyleSheet.container, { backgroundColor }]}
            contentContainerStyle={styles.content}
        >
            <Text style={styles.heading}>All Events</Text>
            {sessions.map((session) => (
                <SessionItem key={session.id} {...session} />
            ))}
            {error && (
                <Text style={styles.warningText}>
                    Using cached data. Could not fetch latest updates.
                </Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1},
    content: { paddingTop: 60, paddingBottom: 40},
    centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20},
    heading: {
        fontSize: 28,
        fontWeight: "700",
        paddingHorizontal: 20,
        paddingBottom: 16,
        color: "white"
    },
    loadingText: { marginTop: 10, fontSize: 14, color: "#666" },
    error: { color: "red", fontSize: 16, fontWeight: "bold" },
    errorDetails: { color: "#666", fontSize: 14, marginTop: 10 },
    warningText: { color: "#ff9800", fontSize: 12, margin: 20, fontStyle: "italic"},
});