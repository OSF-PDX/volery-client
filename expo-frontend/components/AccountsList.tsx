import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { database } from '../model/database';
import Account from '../model/Account';
import { Q } from '@nozbe/watermelondb';

const AccountsList = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = Platform.OS === 'android'
    ? 'http://10.0.2.2:3000/accounts'
    : 'http://localhost:3000/accounts';

    useEffect(() => {
      initializeData();
    }, []);

    const initializeData = async () => {
      try {
        // try to load from the local database
        await loadAccountsFromDB();

        // fetch fresh data from API and update cache
        await fetchAndCacheAccounts();

        // reload from database to show updated data
        await loadAccountsFromDB();
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    const loadAccountsFromDB = async () => {
      try {
        const accountsCollection = database.get<Account>('accounts');
        const allAccounts = await accountsCollection.query().fetch();
        setAccounts(allAccounts);
      } catch (err) {
        console.error('Error loading from DB', err);
        throw err;
      }
    };

    const fetchAndCacheAccounts = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Cache the data in watermelonDB
        await database.write(async () => {
          const accountsCollection = database.get<Account>('accounts');

          for (const accountData of data.records) {
            // Check if account already exists
            const existing = await accountsCollection
              .query(Q.where('account_id', accountData.Id))
              .fetch();

              if (existing.length > 0) {
                // Update existing account
                await existing[0].update(account => {
                  account.name = accountData.Name;
                  account.industry = accountData.Industry || '';
                });
              } else {
                // Create new account
                await accountsCollection.create(account => {
                  account.accountId = accountData.Id;
                  account.name = accountData.Name;
                  account.industry = accountData.Industry || '';
                });
              }
          }
        });
      } catch (err) {
        // Handling error in case the API call fails but user already has cached data
        console.log('API fetch failed, using cached data:', err);
      }
    };

    if (loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    if (error && accounts.length == 0) {
      return (
        <View style={styles.container}>
          <Text style={styles.error}>Error: {error}</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Accounts Data</Text>
        {accounts.length === 0 ? (
          <Text>No accounts found</Text>
        ) : (
          accounts.slice(0, 3).map((account) => (
            <Text key={account.id} style={styles.accountText}>
              {account.name} - {account.industry}
            </Text>
          ))
        )}
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
    fontSize: 16
  },
});

export default AccountsList;