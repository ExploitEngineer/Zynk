import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ chatId: string }> },
): Promise<Response> {
  const { chatId } = await params;

  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: { messages: true },
  });

  if (!chat) return new Response("Chat not found", { status: 404 });

  return new Response(JSON.stringify(chat), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ chatId: string }> },
): Promise<Response> {
  const { chatId } = await params;

  try {
    await prisma.chat.delete({ where: { id: chatId } });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.log("DELETE /chat/[chatId] error:", error);
    return new Response("Chat not found", { status: 404 });
  }
}
