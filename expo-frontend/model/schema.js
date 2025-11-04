import { appSchema, tableSchema } from "@nozbe/watermelondb";

export const volerySchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: "attendees",
      columns: [
        { name: "name", type: "string" },
        { name: "role", type: "string" },
        { name: "conference_id", type: "string" },
      ],
    }),
    tableSchema({
      name: "conferences",
      columns: [
        { name: "title", type: "string" },
        { name: "attendee_id", type: "string" },
        { name: "date", type: "number" },
      ],
    }),
  ],
});
