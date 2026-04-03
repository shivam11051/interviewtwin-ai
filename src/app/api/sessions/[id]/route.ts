import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const interviewSession = await prisma.interviewSession.findUnique({
    where: { id, userId: session.user.id },
    include: {
      config: true,
      questions: {
        include: {
          transcript: true,
          evaluation: true,
        },
        orderBy: { orderIndex: "asc" },
      },
      scorecard: true,
    },
  });

  if (!interviewSession) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  return NextResponse.json(interviewSession);
}
