import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    const subs = await auth.api.listActiveSubscriptions({
      headers: req.headers,
    });
    const activeSub = subs?.find((s) => s.status === "active");

    const plan = activeSub
      ? activeSub.plan.charAt(0).toUpperCase() + activeSub.plan.slice(1)
      : "None";

    return NextResponse.json({
      name: user?.name,
      email: user?.email,
      image: user?.image ?? null,
      plan,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
