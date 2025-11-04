import { Model } from "@nozbe/watermelondb";

export default class Attendee extends Model {
  static table = "attendees";
  static associations = {
    conferences: { type: "belongs_to", foreignKey: "conference_id" },
  };

  @text("name") name;
  @text("role") role;
  @relation("conferences", "conference_id") conference;
}
