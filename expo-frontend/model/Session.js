import { Model } from "@nozbe/watermelondb";
import { field, date } from "@nozbe/watermelondb/decorators";

export default class Session extends Model {
  static table = "sessions";

  @field("session_id") sessionId;
  @field("name") name;
  @field("description") description;
  @date("start_time") startTime;
  @date("end_time") endTime;
  @date("created_at") createdAt;
  @date("updated_at") updatedAt;
}
