import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const NextQuestionSchema = z.object({
  currentQuestionIndex: z.number(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = NextQuestionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const interviewSession = await prisma.interviewSession.findUnique({
    where: { id, userId: session.user.id },
  });

  if (!interviewSession) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const nextQuestion = await prisma.sessionQuestion.findFirst({
    where: {
      sessionId: id,
      orderIndex: parsed.data.currentQuestionIndex + 1,
    },
  });

  if (!nextQuestion) {
    return NextResponse.json({ done: true, question: null });
  }

  return NextResponse.json({ done: false, question: nextQuestion });
}
