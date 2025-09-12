import { Schema } from "mongoose";

export const messageSchema = new Schema(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    text: { type: String, required: true },
    chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
  },
  { timestamps: true },
);
