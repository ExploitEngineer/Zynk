import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

type ChatSearchProps = {
  text: string;
};

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { text }: ChatSearchProps = await req.json();

    if (!text || text.trim() === "") {
      return NextResponse.json({ chats: [] });
    }

    const chats = await prisma.chat.findMany({
      where: {
        userId: session.user.id,
        title: {
          contains: text,
          mode: "insensitive", // case-insensitive search
        },
      },
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 10, // limit results
    });

    return NextResponse.json({ chats });
  } catch (err) {
    console.error("Chat search failed:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
