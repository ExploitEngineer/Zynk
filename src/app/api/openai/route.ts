import OpenAI from "openai";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set in environment variables");
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request): Promise<Response> {
  try {
    const { chatId, text, model = "gpt-4.1-nano" } = await req.json();

    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;

    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
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
      input: text,
      previous_response_id: chat.lastResponseId || undefined,
      stream: true,
    });

    let assistantText = "";
    let newResponseId: string | null = null;
    let promptTokens = 0;
    let completionTokens = 0;

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of response) {
            if (event.type === "response.output_text.delta") {
              controller.enqueue(event.delta);
              assistantText += event.delta;
            }
            if (event.type === "response.completed") {
              newResponseId = event.response.id;
              if (event.response.usage) {
                promptTokens = event.response.usage.input_tokens ?? 0;
                completionTokens = event.response.usage.output_tokens ?? 0;
              }
              controller.close();
            }
          }

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

          const totalUsed = promptTokens + completionTokens;
          await prisma.usage.create({
            data: {
              userId,
              model,
              promptTokens,
              completionTokens,
              totalTokens: totalUsed,
            },
          });

          const activeSub = await prisma.subscription.findFirst({
            where: { id: userId, status: "active" },
          });

          if (!activeSub) {
            throw new Error("No active subscription found");
          }

          if (activeSub.tokenBalance < totalUsed) {
            throw new Error("Not enough tokens left in your plan");
          }

          await prisma.subscription.update({
            where: { id: activeSub.id },
            data: { tokenBalance: { decrement: totalUsed } },
          });
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    console.error("Error in /api/openai:", err);
    return new Response(
      JSON.stringify({
        error: (err as any)?.message || "Internal Server Error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
