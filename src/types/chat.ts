import { ChatMessage } from "./message";

export interface Chat {
  id: string;
  title: string;
  lastResponseId?: string | null;
  messages: ChatMessage[];
}
