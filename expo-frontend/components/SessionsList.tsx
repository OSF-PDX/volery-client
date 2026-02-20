import { Q } from "@nozbe/watermelondb";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { database } from "../model/database";
import Session from "../model/Session";
import SessionItem from "./SessionItem";

// Type for raw API session data (Salesforce format)
interface ApiSessionData {
  Id: string;
  Name: string;
  Description__c?: string;
  Start__c?: string;
  End__c?: string;
  Location__c?: string;
  Status__c?: string;
  Collaborative_notes__c?: string;
  Confirmed__c?: string;
  SystemModstamp?: string;
  Venue_Assigned__c?: string;
}

// Type for API response
interface ApiResponse {
  totalSize?: number;
  done?: boolean;
  records: ApiSessionData[];
}

// Type for display session (works for both DB and API)
interface DisplaySession {
  id: string;
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

const SessionsList = () => {
  const [sessions, setSessions] = useState<DisplaySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL =
    Platform.OS === "android"
      ? "http://10.0.2.2:3000/sessions"
      : Platform.OS === "web"
        ? "http://localhost:3000/sessions"
        : "http://localhost:3000/sessions";

  const isWeb = Platform.OS === "web";

  useEffect(() => {
    if (isWeb) {
      initializeDataWeb();
    } else {
      initializeDataMobile();
    }
  }, []);

  // Web version - direct API fetch without caching
  const initializeDataWeb = async () => {
    try {
      console.log("Fetching from:", API_URL);
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse | ApiSessionData[] = await response.json();
      console.log("Received data:", data);

      // Handle both array and object responses
      let recordsArray: ApiSessionData[];
      if (Array.isArray(data)) {
        recordsArray = data;
      } else if (data.records && Array.isArray(data.records)) {
        recordsArray = data.records;
      } else {
        throw new Error("Unexpected API response format");
      }

      // Transform API data to display format
      const displaySessions: DisplaySession[] = recordsArray.map(
        (sessionData: ApiSessionData) => ({
          id: sessionData.Id,
          name: sessionData.Name,
          description: sessionData.Description__c || "",
          startTime: sessionData.Start__c || null,
          endTime: sessionData.End__c || null,
          collaborativeNotes: sessionData.Collaborative_notes__c || null,
          confirmed: sessionData.Confirmed__c || null,
          location: sessionData.Location__c || null,
          systemModstamp: sessionData.SystemModstamp || null,
          status: sessionData.Status__c || null,
          venueAssigned: sessionData.Venue_Assigned__c || null,
        }),
      );

      console.log("Transformed sessions:", displaySessions);
      setSessions(displaySessions);
      setError(null);
    } catch (err) {
      console.error("Web fetch error:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Mobile version - with caching
  const initializeDataMobile = async () => {
    try {
      // Try to load from the local database first
      await loadSessionsFromDB();

      // Fetch fresh data from API and update cache
      await fetchAndCacheSessions();

      // Reload from database to show updated data
      await loadSessionsFromDB();

      setError(null);
    } catch (err) {
      console.error("Mobile initialization error:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const loadSessionsFromDB = async () => {
    try {
      if (!database) {
        throw new Error("Database not initialized");
      }

      const sessionsCollection = database.get<Session>("sessions");
      const allSessions = await sessionsCollection.query().fetch();

      // Transform DB sessions to display format
      const displaySessions: DisplaySession[] = allSessions.map((session) => ({
        id: session.id,
        name: session.name,
        description: session.description,
        startTime: session.startTime ? session.startTime.toISOString() : null,
        endTime: session.endTime ? session.endTime.toISOString() : null,
        collaborativeNotes: session.collaborativeNotes || null,
        confirmed: session.confirmed || null,
        location: session.location || null,
        systemModstamp: session.systemModstamp
          ? session.systemModstamp.toISOString()
          : null,
        status: session.status || null,
        venueAssigned: session.venueAssigned || null,
      }));

      setSessions(displaySessions);
    } catch (err) {
      console.error("Error loading from DB:", err);
      throw err;
    }
  };

  const fetchAndCacheSessions = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse | ApiSessionData[] = await response.json();

      // Handle both array and object responses
      let recordsArray: ApiSessionData[];
      if (Array.isArray(data)) {
        recordsArray = data;
      } else if (data.records && Array.isArray(data.records)) {
        recordsArray = data.records;
      } else {
        throw new Error("Unexpected API response format");
      }

      if (!database) {
        throw new Error("Database not initialized");
      }

      // Cache the data in watermelonDB
      await database.write(async () => {
        const sessionsCollection = database.get<Session>("sessions");

        for (const sessionData of recordsArray) {
          // Check if session already exists - using sessionId field
          const existing = await sessionsCollection
            .query(Q.where("session_id", sessionData.Id))
            .fetch();

          if (existing.length > 0) {
            // Update existing session
            await existing[0].update((session) => {
              session.name = sessionData.Name;
              session.description = sessionData.Description__c || "";
              session.startTime = sessionData.Start__c
                ? new Date(sessionData.Start__c).getTime()
                : null;
              session.endTime = sessionData.End__c
                ? new Date(sessionData.End__c).getTime()
                : null;
              session.collaborativeNotes =
                sessionData.Collaborative_notes__c || null;
              session.confirmed = sessionData.Confirmed__c || null;
              session.location = sessionData.Location__c || null;
              session.systemModstamp = sessionData.SystemModstamp
                ? new Date(sessionData.SystemModstamp).getTime()
                : null;
              session.status = sessionData.Status__c || null;
              session.venueAssigned = sessionData.Venue_Assigned__c || null;
            });
          } else {
            // Create new session
            await sessionsCollection.create((session) => {
              session.sessionId = sessionData.Id;
              session.name = sessionData.Name;
              session.description = sessionData.Description__c || "";
              session.startTime = sessionData.Start__c
                ? new Date(sessionData.Start__c).getTime()
                : null;
              session.endTime = sessionData.End__c
                ? new Date(sessionData.End__c).getTime()
                : null;
              session.collaborativeNotes =
                sessionData.Collaborative_notes__c || null;
              session.confirmed = sessionData.Confirmed__c || null;
              session.location = sessionData.Location__c || null;
              session.systemModstamp = sessionData.SystemModstamp
                ? new Date(sessionData.SystemModstamp).getTime()
                : null;
              session.status = sessionData.Status__c || null;
              session.venueAssigned = sessionData.Venue_Assigned__c || null;
            });
          }
        }
      });
    } catch (err) {
      // Handling error in case the API call fails but user already has cached data
      console.log("API fetch failed, using cached data:", err);
      throw err; // Re-throw so the error can be handled by the caller
    }
  };

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

  return (
    <View style={styles.container}>
      {sessions.length === 0 ? (
        <Text>No sessions found</Text>
      ) : (
        sessions
          .slice(0, 50)
          .map((session) => (
            <SessionItem
              key={session.id}
              name={session.name}
              description={session.description}
              startTime={session.startTime}
              endTime={session.endTime}
              collaborativeNotes={session.collaborativeNotes}
              confirmed={session.confirmed}
              location={session.location}
              systemModstamp={session.systemModstamp}
              status={session.status}
              venueAssigned={session.venueAssigned}
            />
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    padding: 10,
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
