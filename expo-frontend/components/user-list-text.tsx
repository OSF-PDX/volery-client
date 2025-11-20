import { User } from "@/database/models";
import { Text, View } from 'react-native';

function UnenhancedUserListText({ users }: { users: User[]}) {
    return (
        <View>
            {users.map((user) => (
                <View key={user.username}>
                    <Text>@{user.username}</Text>
                    <Text>{user.name}</Text>
                </View>
            ))}
        </View>
    );
}

import { withObservables } from '@nozbe/watermelondb/react';

const enhance = withObservables(
    ['users'],
    ({ users }) => ({
        users: users.observe(),
    })
)

const UserListText = enhance(UnenhancedUserListText);
export default UserListText;