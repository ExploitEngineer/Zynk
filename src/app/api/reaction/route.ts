import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

type MessageProps = {
  messageId: string;
  reaction: "like" | "feedback";
  feedback?: string;
};

export async function POST(req: NextRequest) {
  const { messageId, reaction, feedback }: MessageProps = await req.json();

  const messageToReact = await prisma.message.findUnique({
    where: { id: messageId },
  });

  if (!messageToReact) {
    return new Response("message not found", { status: 404 });
  }

  if (reaction === "like") {
    const updated = await prisma.message.update({
      where: { id: messageId },
      data: { like: !messageToReact.like },
    });

    return Response.json(updated);
  }

  if (reaction === "feedback") {
    const updated = await prisma.message.update({
      where: { id: messageId },
      data: { feedback },
    });

    return Response.json(updated);
  }

  return new Response("Invalid reaction", { status: 400 });
}
