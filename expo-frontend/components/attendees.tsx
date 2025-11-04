// components/attendees.tsx
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { database } from '../database';
import Attendee from '../model/Attendee'; // Make sure this matches your model path

export function Attendees() {
  const [attendee, setAttendee] = useState<Attendee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAttendee() {
      try {
        const table = database.get<Attendee>('attendees'); // <Attendee> gives TS the correct type
        if (!table) {
          setError('WatermelonDB table "attendees" not found');
          return;
        }

        // Check if any attendees exist
        const existing = await table.query().fetch();
        if (existing.length === 0) {
          // Create a new attendee if none exist
          await database.write(async () => {
            await table.create((a) => {
              a.name = 'Firstname Middlenamerson Lastnamerson';
              a.role = 'Generic role';
            });
          });
        }

        // Fetch the first attendee
        const attendees = await table.query().fetch();
        if (attendees.length > 0) {
          setAttendee(attendees[0]);
        } else {
          setAttendee(null);
        }
      } catch (err: any) {
        console.error('Error loading attendee:', err);
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    loadAttendee();
  }, []);

  if (loading) {
    return <Text>Loading attendee...</Text>;
  }

  if (error) {
    return <Text style={{ color: 'red' }}>Error: {error}</Text>;
  }

  if (!attendee) {
    return <Text>No attendee found.</Text>;
  }

  return (
    <View>
      <Text>Name: {attendee.name}</Text>
      <Text>Role: {attendee.role}</Text>
    </View>
  );
}
