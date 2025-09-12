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
