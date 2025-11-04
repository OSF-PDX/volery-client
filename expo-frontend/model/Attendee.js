import { Model } from "@nozbe/watermelondb";
import { field, relation } from "@nozbe/watermelondb/decorators";

export default class Attendee extends Model {
  static table = "attendees";
  static associations = {
    conferences: { type: "belongs_to", foreignKey: "conference_id" },
  };

  @field("name") name;
  @field("role") role;
  @relation("conferences", "conference_id") conference;
}
