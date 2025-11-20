import { Model } from "@nozbe/watermelondb";
import { text } from "@nozbe/watermelondb/decorators";

export class User extends Model {
    static table = "users";
    // @ts-ignore
    @text('username') username: string;
    // @ts-ignore
    @text('name') name: string;
};