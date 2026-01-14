import { Model } from "@nozbe/watermelondb";
import { field, date } from "@nozbe/watermelondb/decorators";

export default class Account extends Model {
  static table = "accounts";

  @field("account_id") accountId;
  @field("name") name;
  @field("industry") industry;
  @date("created_at") createdAt;
  @date("updated_at") updatedAt;
}
