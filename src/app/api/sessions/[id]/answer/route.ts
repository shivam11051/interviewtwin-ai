import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { evaluateAnswer } from "@/lib/ai/interview-service";

const AnswerSchema = z.object({
  questionId: z.string(),
  transcript: z.string().min(1),
  durationSeconds: z.number().optional(),
  audioUrl: z.string().optional(),
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
  const parsed = AnswerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const interviewSession = await prisma.interviewSession.findUnique({
    where: { id, userId: session.user.id },
    include: { config: true },
  });

  if (!interviewSession || !interviewSession.config) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const question = await prisma.sessionQuestion.findUnique({
    where: { id: parsed.data.questionId, sessionId: id },
  });

  if (!question) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  await prisma.answerTranscript.upsert({
    where: { questionId: parsed.data.questionId },
    create: {
      questionId: parsed.data.questionId,
      rawText: parsed.data.transcript,
      processedText: parsed.data.transcript,
      durationSeconds: parsed.data.durationSeconds,
      audioUrl: parsed.data.audioUrl,
    },
    update: {
      rawText: parsed.data.transcript,
      processedText: parsed.data.transcript,
      durationSeconds: parsed.data.durationSeconds,
      audioUrl: parsed.data.audioUrl,
    },
  });

  const evaluation = await evaluateAnswer(
    question.questionText,
    parsed.data.transcript,
    question.questionType,
    {
      company: interviewSession.config.company,
      role: interviewSession.config.role,
      level: interviewSession.config.level,
    },
    interviewSession.config.persona
  );

  const savedEvaluation = await prisma.answerEvaluation.upsert({
    where: { questionId: parsed.data.questionId },
    create: {
      questionId: parsed.data.questionId,
      ...evaluation,
    },
    update: {
      ...evaluation,
    },
  });

  return NextResponse.json(savedEvaluation);
}
