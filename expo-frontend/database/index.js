import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

import Attendee from "../model/Attendee";
import Conference from "../model/Conference";
import { volerySchema } from "../model/schema";

const adapter = new SQLiteAdapter({
  schema: volerySchema,
});

export const database = new Database({
  adapter,
  modelClasses: [Attendee, Conference],
  actionsEnabled: true,
});
