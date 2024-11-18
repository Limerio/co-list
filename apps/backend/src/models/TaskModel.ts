import { model, Schema } from "mongoose";

const TaskSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  list: { type: Schema.ObjectId, ref: "List" },
  createdBy: { type: Schema.ObjectId, ref: "User" },
});

export const TaskModel = model("Task", TaskSchema);
