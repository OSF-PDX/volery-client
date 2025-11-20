import { appSchema, tableSchema } from '@nozbe/watermelondb';

const schema = appSchema({
    version: 0,
    tables: [
        tableSchema({
            name: "users",
            columns: [
                {name: "username", type: 'string', isIndexed: true},
                {name: "name", type: 'string'},
            ]
        })
    ]
})