import { dbConnect } from "@/lib/db-connection";
import Chat from "@/models/chat.model";
import "@/models/message.model";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ chatId: string }> },
): Promise<Response> {
  await dbConnect();
  const { chatId } = await params;
  const chat = await Chat.findById(chatId).populate("messages").lean();

  if (!chat) return new Response("Chat not found", { status: 404 });

  return new Response(JSON.stringify(chat), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ chatId: string }> },
): Promise<Response> {
  await dbConnect();
  const { chatId } = await params;
  await Chat.findByIdAndDelete(chatId);
  return new Response(null, { status: 204 });
}
