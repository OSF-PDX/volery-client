import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

interface SessionItemProps {
    name: string;
    description: string;
    startTime: string | null;
    endTime: string | null;
}

const SessionItem = ({ name, description, startTime, endTime }: SessionItemProps) => {
    return (
        <View style={styles.sessionItem}>
            <Text style={styles.sessionName}>{name}</Text>
            <Text style={styles.sessionName}>start time: {startTime}</Text>
            <Text style={styles.sessionName}>end time: {endTime}</Text>
            <Text style={styles.sessionDescription} numberOfLines={3}>
                {description}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    sessionItem: {
        marginBottom: 15,
        // paddingBottom: 15,
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    sessionName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
        color: '#ffff',
    },
    sessionDescription: {
        fontSize: 14,
        color: '#666',
        marginVertical: 10,
    }
});

export default SessionItem;