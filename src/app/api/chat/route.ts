import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(): Promise<Response> {
  const chats = await prisma.chat.findMany({
    include: { messages: true },
  });

  return new Response(JSON.stringify(chats), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: NextRequest): Promise<Response> {
  const { title } = await req.json();
  const chat = await prisma.chat.create({
    data: { title: title || "New Chat" },
  });

  return new Response(JSON.stringify({ chatId: chat.id, title: chat.title }), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function PATCH(req: NextRequest): Promise<Response> {
  try {
    const { chatId, newTitle } = await req.json();

    if (!chatId || !newTitle) {
      return new Response(
        JSON.stringify({ error: "Missing chatId or newTitle" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const chat = await prisma.chat.update({
      where: { id: chatId },
      data: { title: newTitle },
    });

    return new Response(JSON.stringify(chat), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("PATCH /chat error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { chatId } = await req.json();

    if (!chatId) {
      return new Response(JSON.stringify({ error: "Missing chatId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const chat = await prisma.chat.delete({ where: { id: chatId } });

    return new Response(JSON.stringify(chat), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("DELETE /chat error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
