import {
  addColumns,
  schemaMigrations,
} from "@nozbe/watermelondb/Schema/migrations";

export const migrations = schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        addColumns({
          table: "sessions",
          columns: [
            { name: "start_time", type: "number", isOptional: true },
            { name: "end_time", type: "number", isOptional: true },
          ],
        }),
      ],
    },
    {
      toVersion: 3,
      steps: [
        addColumns({
          table: "sessions",
          columns: [
            { name: "collaborative_notes", type: "string", isOptional: true },
            { name: "confirmed", type: "string", isOptional: "true" },
            { name: "location", type: "string", isOptional: "true" },
            { name: "system_modstamp", type: "number", isOptional: true },
            { name: "status", type: "string", isOptional: true },
            { name: "venue_assigned", type: "string", isOptional: true },
          ],
        }),
      ],
    },
  ],
});
