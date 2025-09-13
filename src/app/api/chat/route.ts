import { dbConnect } from "@/lib/db-connection";
import Chat from "@/models/chat.model";
import { NextRequest } from "next/server";

export async function GET(): Promise<Response> {
  await dbConnect();
  const chats = await Chat.find({});

  return new Response(JSON.stringify(chats), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: NextRequest): Promise<Response> {
  await dbConnect();
  const { title } = await req.json();
  const chat = await Chat.create({ title: title || "New Chat" });

  return new Response(JSON.stringify({ chatId: chat._id, title: chat.title }), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function PATCH(req: NextRequest): Promise<Response> {
  try {
    await dbConnect();
    const { chatId, newTitle } = await req.json();

    if (!chatId || !newTitle) {
      return new Response(
        JSON.stringify({ error: "Missing chatId or newTitle" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { title: newTitle }, // FIX: wrap in object
      { new: true },
    );

    if (!chat) {
      return new Response(JSON.stringify({ error: "Chat not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

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
