import { Model } from "@nozbe/watermelondb";
import { date, field } from "@nozbe/watermelondb/decorators";

export default class Session extends Model {
  static table = "sessions";

  @field("session_id") sessionId;
  @field("name") name;
  @field("description") description;
  @date("start_time") startTime;
  @date("end_time") endTime;
  @field("collaborativ_notes") collaborativeNotes;
  @field("confirmed") confirmed;
  @field("location") location;
  @date("system_modstamp") systemModstamp;
  @field("status") status;
  @field("venue_assigned") venueAssigned;
  @date("created_at") createdAt;
  @date("updated_at") updatedAt;
}
