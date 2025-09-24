import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { eachDayOfInterval, startOfMonth, endOfMonth, format } from "date-fns";

export async function GET(req: Request): Promise<Response> {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;
    const now = new Date();

    const usageRecords = await prisma.usage.findMany({
      where: {
        userId,
        createdAt: {
          gte: startOfMonth(now),
          lte: endOfMonth(now),
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const daysInMonth = eachDayOfInterval({
      start: startOfMonth(now),
      end: endOfMonth(now),
    });

    const usageMap: Record<string, number> = {};
    for (const day of daysInMonth) {
      const key = format(day, "MMM d");
      usageMap[key] = 0;
    }

    let totalUsed = 0;
    for (const record of usageRecords) {
      const key = format(record.createdAt, "MMM d");
      usageMap[key] += record.totalTokens;
      totalUsed += record.totalTokens;
    }

    const usageByDay = Object.entries(usageMap).map(([day, tokens]) => ({
      day,
      tokens,
    }));

    let tokenLimit = 0;
    let currentPlan = "none";

    try {
      const subsArr = await auth.api.listActiveSubscriptions({
        headers: req.headers,
      });
      if (Array.isArray(subsArr)) {
        for (const p of subsArr) {
          if (p.plan === "free") {
            tokenLimit = 10000;
            currentPlan = "free";
          }
          if (p.plan === "pro") {
            tokenLimit = 210000;
            currentPlan = "pro";
          }
          if (p.plan === "startup") {
            tokenLimit = 510000;
            currentPlan = "startup";
          }
        }
      }
    } catch (err) {
      console.error("listActiveSubscriptions error:", err);
    }

    return new Response(
      JSON.stringify({
        usageByDay,
        totalUsed,
        tokenLimit,
        currentPlan,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("Error in /api/usage:", err);
    return new Response(
      JSON.stringify({
        error: (err as any)?.message || "Internal Server Error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
