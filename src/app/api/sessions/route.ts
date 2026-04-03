import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const CreateSessionSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  level: z.string().min(1),
  interviewType: z.enum(["BEHAVIORAL", "TECHNICAL", "MIXED"]),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  persona: z.enum(["FRIENDLY", "STRICT", "BAR_RAISER"]),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessions = await prisma.interviewSession.findMany({
    where: { userId: session.user.id },
    include: {
      config: true,
      scorecard: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(sessions);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = CreateSessionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const interviewSession = await prisma.interviewSession.create({
    data: {
      userId: session.user.id,
      status: "CREATED",
      config: {
        create: {
          company: parsed.data.company,
          role: parsed.data.role,
          level: parsed.data.level,
          interviewType: parsed.data.interviewType,
          difficulty: parsed.data.difficulty,
          persona: parsed.data.persona,
        },
      },
    },
    include: { config: true },
  });

  return NextResponse.json(interviewSession, { status: 201 });
}
