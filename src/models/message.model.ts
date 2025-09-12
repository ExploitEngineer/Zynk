import type { InferSchemaType } from "mongoose";
import { model, models } from "mongoose";
import { messageSchema } from "@/schemas/message.schema";

type MessageSchema = InferSchemaType<typeof messageSchema>;

const Message =
  models.Message || model<MessageSchema>("Message", messageSchema);

export default Message;
