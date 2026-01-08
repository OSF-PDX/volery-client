import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';

const AccountsList = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = Platform.OS === 'android'
    ? 'http://10.0.2.2:3000/accounts'
    : 'http://localhost:3000/accounts';

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setAccounts(data.records);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Accounts Data</Text>
      {accounts.slice(0, 3).map((account) => (
        <Text key={account.Id} style={styles.accountText}>
          {account.Name} - {account.Industry}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    accountText: {
        fontSize: 16,
        marginBottom: 10,
    },
    error: {
        color: 'red',
        fontSize: 16,
    },
});

export default AccountsList;