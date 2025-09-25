import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set in environment variables");
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request): Promise<Response> {
  try {
    const { text, model = "gpt-4.1-nano" } = await req.json();

    const response = await openai.responses.create({
      model,
      input: text,
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of response) {
            if (event.type === "response.output_text.delta") {
              controller.enqueue(event.delta);
            }
            if (event.type === "response.completed") {
              controller.close();
            }
          }
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    console.error("Error in /api/widget-chat:", err);
    return new Response(
      JSON.stringify({
        error: (err as any)?.message || "Internal Server Error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
