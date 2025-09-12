import type { InferSchemaType } from "mongoose";
import { model } from "mongoose";
import { chatSchema } from "@/schemas/chat.schema";

type ChatSchema = InferSchemaType<typeof chatSchema>;

const Chat = model<ChatSchema>("Chat", chatSchema);
export default Chat;
