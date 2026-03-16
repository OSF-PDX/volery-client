import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { format, parseISO } from "date-fns";
import { useSessions } from "@/contexts/SessionsContext";
import SessionItem from "./SessionItem";

interface Props {
  selectedDate: string | null;
}

const SessionsList = ({ selectedDate }: Props) => {
  const { sessions, loading, error } = useSessions();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading sessions...</Text>
      </View>
    );
  }

  if (error && sessions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error: {error}</Text>
        <Text style={styles.errorDetails}>
          Please check your network connection and try again.
        </Text>
      </View>
    );
  }

  const filteredSessions = selectedDate
    ? sessions.filter(
      (s) =>
          s.startTime &&
      format(parseISO(s.startTime), "yyyy-MM-dd") === selectedDate
    )
    : sessions;

  return (
    <View style={styles.container}>
      {filteredSessions.length === 0 ? (
        <Text>No sessions found</Text>
      ): (
        filteredSessions.map((session) => (
          <SessionItem key={session.id} {...session} />
        ))
      )}
      {error && sessions.length > 0 && (
        <Text style={styles.warningText}>
          Using cached data. Could not fetch latest updates.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    justifyContent: "center",
  },
  error: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorDetails: {
    color: "#666",
    fontSize: 14,
    marginTop: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
  warningText: {
    color: "#ff9800",
    fontSize: 12,
    marginTop: 10,
    fontStyle: "italic",
  },
});

export default SessionsList;