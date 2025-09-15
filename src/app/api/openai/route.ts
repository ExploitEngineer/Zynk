import OpenAI from "openai";
import { prisma } from "@/lib/prisma";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set in environment variables");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request): Promise<Response> {
  const { chatId, text, model = "gpt-4.1-nano" } = await req.json();

  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: { messages: true },
  });
  if (!chat) {
    return new Response("Chat not found", { status: 404 });
  }

  await prisma.message.create({
    data: {
      role: "user",
      text,
      chat: { connect: { id: chatId } },
    },
  });

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

        await prisma.message.create({
          data: {
            role: "assistant",
            text: assistantText,
            chat: { connect: { id: chatId } },
          },
        });

        await prisma.chat.update({
          where: { id: chatId },
          data: { lastResponseId: newResponseId || chat.lastResponseId },
        });
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
