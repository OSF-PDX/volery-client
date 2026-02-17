import { Model } from "@nozbe/watermelondb";
import { field, date } from "@nozbe/watermelondb/decorators";

export default class Session extends Model {
  static table = "sessions";

  @field("session_id") sessionId;
  @field("name") name;
  @field("description") description;
  @date("created_at") createdAt;
  @date("updated_at") updatedAt;
}
