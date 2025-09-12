import OpenAI from "openai";

interface Message {
  role: "user" | "assistant";
  text?: string;
  files?: File[];
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { messages = [], model = "gpt-4.1-nano" } = await req.json();

  const input = messages.map(
    (m: Message): { role: string; content: string } => {
      return {
        role: m.role,
        content: m.text || "",
      };
    },
  );

  const response = await openai.responses.create({
    model,
    instructions: "You are a helpful assistant.",
    input,
    stream: true,
  });

  const stream = new ReadableStream({
    async start(controller: ReadableStreamDefaultController): Promise<void> {
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
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
