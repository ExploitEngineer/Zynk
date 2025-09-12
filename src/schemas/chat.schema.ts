import { Schema } from "mongoose";

export const chatSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    lastResponseId: {
      type: String,
      default: null,
    },
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  { timestamps: true },
);
