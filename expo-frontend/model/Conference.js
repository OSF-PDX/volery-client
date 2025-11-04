import { Model } from "@nozbe/watermelondb";
import { date, field, relation } from "@nozbe/watermelondb/decorators";

export default class Conference extends Model {
  static table = "conferences";
  static associations = {
    attendees: {
      type: "has_many",
      foreignKey: "attendee_id",
    },
  };

  @field("title") title;
  @date("date") date;
  @relation("attendees", "attendee_id") attendee;
}
