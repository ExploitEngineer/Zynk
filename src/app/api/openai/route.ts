import OpenAI from "openai";
import { dbConnect } from "@/lib/db-connection";
import Message from "@/models/message.model";
import Chat from "@/models/chat.model";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request): Promise<Response> {
  await dbConnect();
  const { chatId, text, model = "gpt-4.1-nano" } = await req.json();

  const chat = await Chat.findById(chatId);
  if (!chat) {
    return new Response("Chat not found", { status: 404 });
  }

  const userMessage = await Message.create({
    role: "user",
    text,
    chatId,
  });
  chat.messages.push(userMessage._id);

  const response = await openai.responses.create({
    model,
    instructions:
      "You are a helpful assistant.Always format your answers in **Markdown**. Use proper Markdown syntax for bullet points (-), numbered lists (1.), code blocks, tables, and links when needed.",
    input: text,
    previous_response_id: chat.lastResponseId || undefined,
    stream: true,
  });

  let assistantText = "";
  let newResponseId: string | null = null;

  const stream = new ReadableStream({
    async start(controller: ReadableStreamDefaultController): Promise<void> {
      try {
        for await (const event of response) {
          if (event.type === "response.output_text.delta") {
            controller.enqueue(event.delta);
            assistantText += event.delta;
          }
          if (event.type === "response.completed") {
            newResponseId = event.response.id;
            controller.close();
          }
        }

        console.log("Assistant Text:", assistantText);

        const assistantMessage = await Message.create({
          role: "assistant",
          text: assistantText,
          chatId,
        });

        chat.messages.push(assistantMessage._id);

        if (newResponseId) {
          chat.lastResponseId = newResponseId;
          await chat.save();
        } else {
          await chat.save();
        }
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
