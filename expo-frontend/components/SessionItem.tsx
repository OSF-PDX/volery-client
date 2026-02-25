import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { parseISO, format } from "date-fns";

interface SessionItemProps {
  name: string;
  description: string;
  startTime: string | null;
  endTime: string | null;
  collaborativeNotes: string | null;
  confirmed: string | null;
  location: string | null;
  systemModstamp: string | null;
  status: string | null;
  venueAssigned: string | null;
}

const formatTime = (timeString: string | null): string => {
  if (!timeString) return "TBD";
  try {
    const parsed = parseISO(timeString);
    return format(parsed, "MMM d, yyyy h:mm a");
  } catch {
    return timeString;
  }
};

const SessionItem = ({
  name,
  description,
  startTime,
  endTime,
  collaborativeNotes,
  confirmed,
  location,
  systemModstamp,
  status,
  venueAssigned,
}: SessionItemProps) => {
  return (
    <View style={styles.sessionItem}>
      <Text style={styles.sessionName}>{name}</Text>
      <Text style={styles.sessionDescription} numberOfLines={3}>
        {description}
      </Text>
      <View style={styles.sessionTimeAndLocation}>
        <View style={styles.sessionTimeBox}>
          <Text style={styles.sessionTime}>{formatTime(startTime)} to</Text>
          <Text style={styles.sessionTime}>{formatTime(endTime)}</Text>
        </View>
        <View style={styles.sessionLocation}>
          <Text style={styles.locationText}>{venueAssigned}</Text>
          <Text style={styles.locationText}>{location}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sessionItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "black"
  },
  sessionName: {
    fontSize: 25,
    fontWeight: "600",
    marginBottom: 5,
    color: "#ffff",
  },
  sessionDescription: {
    fontSize: 14,
    color: "white",
    marginVertical: 10,
  },
  sessionTimeAndLocation: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sessionTimeBox: {
    outlineWidth: 1,
    display: "flex",
    flexDirection: "column",
  },
  sessionLocation: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  locationText: {
    color: "white",
  },
  sessionTime: {
    color: "white"
  },
});

export default SessionItem;
