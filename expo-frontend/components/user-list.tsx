// import { Database } from '@nozbe/watermelondb';
import { View } from 'react-native';
import { database } from '../database/db-instance';
import UserListText from './user-list-text';

const usersQuery = database.get('users').query();

export default function UserList() {
    return (
        <View>
            <UserListText users={usersQuery} />
        </View>
    );
}