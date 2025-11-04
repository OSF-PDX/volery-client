import { Model } from "@nozbe/watermelondb";
import { children } from "@nozbe/watermelondb/decorators";

export default class Conference extends Model {
  static table = "conferences";
  static associations = {
    attendees: {
      type: "has_many",
      foreignKey: "attendee_id",
    },
  };

  @text("title") title;
  @date("date") date;
  @relation("attendees", "attendee_id") attendee;
  @children("attendees") attendees;
}
