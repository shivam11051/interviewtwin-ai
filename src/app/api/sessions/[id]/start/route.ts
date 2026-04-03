import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { generateQuestions } from "@/lib/ai/interview-service";
import { SessionStatus } from "@prisma/client";

export async function POST(
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
    include: { config: true },
  });

  if (!interviewSession || !interviewSession.config) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (
    interviewSession.status !== SessionStatus.CREATED &&
    interviewSession.status !== SessionStatus.READY
  ) {
    return NextResponse.json(
      { error: "Session already started" },
      { status: 400 }
    );
  }

  const questions = await generateQuestions({
    company: interviewSession.config.company,
    role: interviewSession.config.role,
    level: interviewSession.config.level,
    interviewType: interviewSession.config.interviewType,
    difficulty: interviewSession.config.difficulty,
    numQuestions: 5,
  });

  await prisma.sessionQuestion.deleteMany({ where: { sessionId: id } });

  const createdQuestions = await prisma.$transaction(
    questions.map((q) =>
      prisma.sessionQuestion.create({
        data: {
          sessionId: id,
          questionText: q.questionText,
          questionType: q.questionType,
          orderIndex: q.orderIndex,
        },
      })
    )
  );

  await prisma.interviewSession.update({
    where: { id },
    data: { status: SessionStatus.RUNNING },
  });

  return NextResponse.json({
    firstQuestion: createdQuestions[0],
    totalQuestions: createdQuestions.length,
  });
}
