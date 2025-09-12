import type { InferSchemaType } from "mongoose";
import { model, models } from "mongoose";
import { chatSchema } from "@/schemas/chat.schema";

type ChatSchema = InferSchemaType<typeof chatSchema>;

const Chat = models.Chat || model<ChatSchema>("Chat", chatSchema);

export default Chat;
