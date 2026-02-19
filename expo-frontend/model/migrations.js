import {
  schemaMigrations,
  addColumns,
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
  ],
});
