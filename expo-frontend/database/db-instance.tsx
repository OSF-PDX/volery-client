import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

import { User } from './models';
import { schema } from './schema';

const adapter = new SQLiteAdapter({
    schema,
    jsi: false /* enable if Platform.OS === 'ios' */
});

export const database = new Database({
    adapter,
    modelClasses: [User]
})

const createUser = (username: string, name: string) => 
    database.write(() =>
        database
            .get<User>('users')
            .create((user) => {
                user.username = username;
                user.name = name;
            })
    )