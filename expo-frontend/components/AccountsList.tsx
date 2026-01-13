import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { database } from '../model/database';
import Account from '../model/Account';
import { Q } from '@nozbe/watermelondb';

// Type for raw API account data
interface ApiAccountData {
  Id: string;
  Name: string;
  Industry?: string;
}

// Type for display account (works for both DB and API)
interface DisplayAccount {
  id: string;
  name: string;
  industry: string;
}

const AccountsList = () => {
  const [accounts, setAccounts] = useState<DisplayAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = Platform.OS === 'android'
    ? 'http://10.0.2.2:3000/accounts'
    : 'http://localhost:3000/accounts';

  const isWeb = Platform.OS === 'web';

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
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform API data to display format
      const displayAccounts: DisplayAccount[] = data.records.map((accountData: ApiAccountData) => ({
        id: accountData.Id,
        name: accountData.Name,
        industry: accountData.Industry || '',
      }));

      setAccounts(displayAccounts);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Mobile version - with caching
  const initializeDataMobile = async () => {
    try {
      // Try to load from the local database
      await loadAccountsFromDB();

      // Fetch fresh data from API and update cache
      await fetchAndCacheAccounts();

      // Reload from database to show updated data
      await loadAccountsFromDB();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const loadAccountsFromDB = async () => {
    try {
      if (!database) {
        throw new Error('Database not initialized');
      }

      const accountsCollection = database.get<Account>('accounts');
      const allAccounts = await accountsCollection.query().fetch();
      
      // Transform DB accounts to display format
      const displayAccounts: DisplayAccount[] = allAccounts.map(account => ({
        id: account.id,
        name: account.name,
        industry: account.industry,
      }));
      
      setAccounts(displayAccounts);
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

      if (!database) {
        throw new Error('Database not initialized');
      }

      // Cache the data in watermelonDB
      await database.write(async () => {
        const accountsCollection = database.get<Account>('accounts');

        for (const accountData of data.records) {
          // Check if account already exists - using accountId field
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

  if (error && accounts.length === 0) {
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