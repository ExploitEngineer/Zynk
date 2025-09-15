import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    const response = await openai.responses.create({
      model: "gpt-4.1-nano",
      instructions: `You are a helpful assistant that generates short chat titles.
      Rules:
      - Keep it concise (max 4–5 words).
      - No punctuation at the end.
      - No quotes or emojis.
      - Be descriptive but simple.`,
      input: message,
    });

    return NextResponse.json({ title: response.output_text });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Something went wrong" },
      { status: 500 },
    );
  }
}
