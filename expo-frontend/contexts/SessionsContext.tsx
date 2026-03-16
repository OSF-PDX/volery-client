import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import { Q } from "@nozbe/watermelondb";
import { format, parseISO } from "date-fns";
import { database } from "@/model/database";
import Session from "@/model/Session";

export interface DisplaySession {
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

interface SessionsContextValue {
    sessions: DisplaySession[];
    loading: boolean;
    error: string | null;
    availableDates: string[];
}

const SessionsContext = createContext<SessionsContextValue>({
    sessions: [],
    loading: true,
    error: null,
    availableDates: [],
});

export const useSessions = () => useContext(SessionsContext);

const API_URL =
    Platform.OS === "android"
        ? "http://10.0.2.2:3000/sessions"
        : "http://localhost:3000/sessions";
    
const sortByStartTime = (sessions: DisplaySession[]) : DisplaySession[] =>
    [...sessions].sort((a, b) => {
        if (!a.startTime && !b.startTime) return 0;
        if (!a.startTime) return 1;
        if (!b.startTime) return -1;
        return a.startTime.localeCompare(b.startTime);
    });

const getUniqueDates = (sessions: DisplaySession[]): string[] => {
    const dates = sessions
        .filter((s) => s.startTime !== null)
        .map((s) => format(parseISO(s.startTime!), "yyyy-MM-dd"));
    return [...new Set(dates)].sort();
};

export function SessionsProvider({ children }: { children: React.ReactNode }) {
    const [sessions, setSessions] = useState<DisplaySession[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isWeb = Platform.OS === "web";

    useEffect(() => {
        console.log("SessionsProvider useEffect fired, isWeb:", isWeb);
        if (isWeb) {
            initWeb();
        } else {
            initMobile();
        }
    }, []);

    const initWeb = async () => {
        console.log("initWeb started");
        try {
            console.log("Fetching from:", API_URL);
            const response = await fetch(API_URL, {
                headers: { Accept: "application/json", "Content-Type": "application/json"},
            });
            console.log("Response status:", response.status);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            const records: ApiSessionData[] = Array.isArray(data) ? data : data.records;
            setSessions(sortByStartTime(records.map(toDisplaySession)));
            setError(null);
            console.log("initWeb succeeded, session count:", records.length);
        } catch (err) {
            console.error("initWeb caught error:", err);
            setError((err as Error).message);
        } finally {
            console.log("initWeb finally block — calling setLoading(false)");
            setLoading(false);
        }
    };

    const initMobile = async () => {
        try {
            await loadFromDB();
            await fetchAndCache();
            await loadFromDB();
            setError(null);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const loadFromDB = async () => {
        const col = database.get<Session>("sessions");
        const all = await col.query().fetch();
        setSessions(
            sortByStartTime(
                all.map((s) => ({
                    id: s.id,
                    name: s.name,
                    description: s.description,
                    startTime: s.startTime? s.startTime.toISOString() : null,
                    endTime: s.endTime ? s.endTime.toISOString() : null,
                    collaborativeNotes: s.collaborativeNotes || null,
                    confirmed: s.confirmed || null,
                    location: s.location || null,
                    systemModstamp: s.systemModstamp ? s.systemModstamp.toISOString() : null,
                    status: s.status || null,
                    venueAssigned: s.venueAssigned || null,
                }))
            )
        );
    };

    const fetchAndCache = async () => {
        const response = await fetch(API_URL, {
            headers: { Accept: "application/json", "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const records: ApiSessionData[] = Array.isArray(data) ? data : data.records;

        await database.write(async () => {
            const col = database.get<Session>("sessions");
            for (const s of records) {
                const existing = await col.query(Q.where("session_id", s.Id)).fetch();
                if (existing.length > 0) {
                    await existing[0].update((row) => applyApiData(row, s));
                } else {
                    await col.create((row) => {
                        row.sessionId = s.Id;
                        applyApiData(row, s);
                    });
                }
            }
        });
    };

    const availableDates = getUniqueDates(sessions);

    return (
        <SessionsContext.Provider value={{ sessions, loading, error, availableDates }}>
            {children}
        </SessionsContext.Provider>
    );
}

function toDisplaySession(s: ApiSessionData): DisplaySession {
    return {
        id: s.Id,
        name: s.Name,
        description: s.Description__c || "",
        startTime: s.Start__c || null,
        endTime: s.End__c || null,
        collaborativeNotes: s.Collaborative_notes__c || null,
        confirmed: s.Confirmed__c || null,
        location: s.Location__c || null,
        systemModstamp: s.SystemModstamp || null,
        status: s.Status__c || null,
        venueAssigned: s.Venue_Assigned__c || null,
    };
}

function applyApiData(row: Session, s: ApiSessionData) {
    row.name = s.Name;
    row.description = s.Description__c || "";
    row.startTime = s.Start__c ? new Date(s.Start__c).getTime() : null;
    row.endTime = s.End__c ? new Date(s.End__c).getTime() : null;
    row.collaborativeNotes = s.Collaborative_notes__c || null;
    row.confirmed = s.Confirmed__c || null;
    row.location = s.Location__c || null;
    row.systemModstamp = s.SystemModstamp ? new Date(s.SystemModstamp).getTime() : null;
    row.status = s.Status__c || null;
    row.venueAssigned = s.Venue_Assigned__c || null;
}