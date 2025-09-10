import OpenAI from "openai";
import { NextResponse } from "next/server";

interface Message {
  role: "user" | "assistant";
  text?: string;
  files?: File[];
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { messages = [], model = "gpt-4.1-nano" } = await req.json();

    const input = messages.map((m: Message) => {
      return {
        role: m.role,
        content: m.text || "",
      };
    });

    const response = await openai.responses.create({
      model,
      input,
    });

    return NextResponse.json({
      text: response.output_text ?? "",
    });
  } catch (err: any) {
    console.error("OpenAI API Error:", err);

    return NextResponse.json(
      { error: err?.message ?? "Something went wrong" },
      { status: 500 },
    );
  }
}
