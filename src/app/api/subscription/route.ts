import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request): Promise<Response> {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const sub = await prisma.subscription.findFirst({
      where: { referenceId: session.user.id, status: "active" },
    });

    if (!sub) {
      return new Response("No subscription found", { status: 403 });
    }

    if (sub.plan.toLowerCase() === "none") {
      return new Response("You do not have an active plan", { status: 403 });
    }

    if (sub.tokenBalance <= 0) {
      return new Response("Not enough tokens in your plan", { status: 403 });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error in /api/subscription/check:", err);
    return new Response(
      JSON.stringify({
        error: (err as any)?.message || "Internal Server Error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
