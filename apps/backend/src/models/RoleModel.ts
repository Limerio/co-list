import { model, Schema } from "mongoose";
import { ROLES } from "../constants";

const RoleSchema = new Schema({
  user: [{ type: Schema.ObjectId, ref: "User" }],
  list: [{ type: Schema.ObjectId, ref: "List" }],
  role: {
    type: String,
    required: true,
    enum: Object.keys(ROLES),
  },
});

export const RoleModel = model("Role", RoleSchema);
