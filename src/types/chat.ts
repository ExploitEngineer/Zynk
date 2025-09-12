import { ChatMessage } from "./message";

export interface Chat {
  _id: string;
  title: string;
  lastResponseId?: string | null;
  messages: ChatMessage[];
}
