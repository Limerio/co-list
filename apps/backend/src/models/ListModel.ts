import { model, Schema } from "mongoose";

const ListSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  owner: { type: Schema.ObjectId, ref: "User" },
  coauthors: [{ type: Schema.ObjectId, ref: "User" }],
  members: [{ type: Schema.ObjectId, ref: "User" }],
});

export const ListModel = model("List", ListSchema);
