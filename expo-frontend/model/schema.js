import { appSchema, tableSchema } from "@nozbe/watermelondb";

export const schema = appSchema({
  version: 3,
  tables: [
    tableSchema({
      name: "sessions",
      columns: [
        { name: "session_id", type: "string", isIndexed: true },
        { name: "name", type: "string" },
        { name: "description", type: "string", isOptional: true },
        { name: "start_time", type: "number", isOptional: true },
        { name: "end_time", type: "number", isOptional: true },
        { name: "collaborative_notes", type: "string", isOptional: true },
        { name: "confirmed", type: "string", isOptional: true },
        { name: "location", type: "string", isOptional: true },
        { name: "system_modstamp", type: "number", isOptional: true },
        { name: "status", type: "string", isOptional: true },
        { name: "venue_assigned", type: "string", isOptional: true },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
  ],
});
