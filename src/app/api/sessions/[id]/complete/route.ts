import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
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
  });

  if (!interviewSession) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  await prisma.interviewSession.update({
    where: { id },
    data: { status: SessionStatus.COMPLETED },
  });

  // Queue report generation
  try {
    const { queueReportGeneration } = await import("@/lib/queue");
    await queueReportGeneration(id);
  } catch {
    // Fallback: generate report synchronously if Redis unavailable
    try {
      const { generateFinalReport } = await import(
        "@/lib/ai/interview-service"
      );
      await generateFinalReport(id);
    } catch {
      // Ignore errors - report can be generated later
    }
  }

  return NextResponse.json({ success: true, sessionId: id });
}
