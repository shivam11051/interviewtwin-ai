import { openai } from "./openai";
import {
  getQuestionGenerationPrompt,
  getEvaluationPrompt,
  getReportSynthesisPrompt,
  getSystemPrompt,
} from "./prompts";
import { prisma } from "@/lib/prisma";
import {
  InterviewType,
  Difficulty,
  Persona,
  SessionStatus,
} from "@prisma/client";

export interface GeneratedQuestion {
  questionText: string;
  questionType: string;
  orderIndex: number;
}

export interface EvaluationResult {
  clarityScore: number;
  correctnessScore: number;
  structureScore: number;
  depthScore: number;
  confidenceScore: number;
  adaptabilityScore: number;
  overallScore: number;
  feedback: string;
  improvements: string;
}

export async function generateQuestions(config: {
  company: string;
  role: string;
  level: string;
  interviewType: InterviewType;
  difficulty: Difficulty;
  numQuestions?: number;
  resumeText?: string;
  jdText?: string;
}): Promise<GeneratedQuestion[]> {
  const numQuestions = config.numQuestions ?? 5;
  const prompt = getQuestionGenerationPrompt({ ...config, numQuestions });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an expert technical interviewer. Always return valid JSON.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content ?? "{}";

  try {
    const parsed = JSON.parse(content) as unknown;
    // Handle both array and object with array property
    const questions = Array.isArray(parsed)
      ? (parsed as GeneratedQuestion[])
      : ((parsed as Record<string, unknown>).questions as GeneratedQuestion[]) ??
        [];
    return questions.slice(0, numQuestions);
  } catch {
    return [];
  }
}

export async function evaluateAnswer(
  questionText: string,
  answerText: string,
  questionType: string,
  config: { company: string; role: string; level: string },
  persona: Persona
): Promise<EvaluationResult> {
  const systemPrompt = getSystemPrompt(persona);
  const prompt = getEvaluationPrompt(
    questionText,
    answerText,
    questionType,
    config
  );

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    temperature: 0.3,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content ?? "{}";

  try {
    return JSON.parse(content) as EvaluationResult;
  } catch {
    return {
      clarityScore: 5,
      correctnessScore: 5,
      structureScore: 5,
      depthScore: 5,
      confidenceScore: 5,
      adaptabilityScore: 5,
      overallScore: 5,
      feedback: "Unable to evaluate answer at this time.",
      improvements: "Please try again.",
    };
  }
}

export async function generateFinalReport(sessionId: string): Promise<void> {
  const session = await prisma.interviewSession.findUnique({
    where: { id: sessionId },
    include: {
      config: true,
      questions: {
        include: {
          transcript: true,
          evaluation: true,
        },
      },
    },
  });

  if (!session || !session.config) return;

  const evaluatedQuestions = session.questions.filter(
    (q) => q.evaluation !== null
  );

  if (evaluatedQuestions.length === 0) return;

  const avgScores = {
    clarityScore: 0,
    correctnessScore: 0,
    structureScore: 0,
    depthScore: 0,
    confidenceScore: 0,
    adaptabilityScore: 0,
    overallScore: 0,
  };

  for (const q of evaluatedQuestions) {
    if (q.evaluation) {
      avgScores.clarityScore += q.evaluation.clarityScore;
      avgScores.correctnessScore += q.evaluation.correctnessScore;
      avgScores.structureScore += q.evaluation.structureScore;
      avgScores.depthScore += q.evaluation.depthScore;
      avgScores.confidenceScore += q.evaluation.confidenceScore;
      avgScores.adaptabilityScore += q.evaluation.adaptabilityScore;
      avgScores.overallScore += q.evaluation.overallScore;
    }
  }

  const count = evaluatedQuestions.length;
  (Object.keys(avgScores) as Array<keyof typeof avgScores>).forEach((key) => {
    avgScores[key] /= count;
  });

  const questionFeedbacks = evaluatedQuestions.map((q) => ({
    question: q.questionText,
    feedback: q.evaluation?.feedback ?? "",
    improvements: q.evaluation?.improvements ?? "",
  }));

  const prompt = getReportSynthesisPrompt(avgScores, questionFeedbacks, {
    company: session.config.company,
    role: session.config.role,
    level: session.config.level,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are an expert career coach. Always return valid JSON.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.5,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content ?? "{}";

  let summary = "Interview completed. Review your performance below.";
  let improvementPlan = "Focus on practicing more interview questions daily.";

  try {
    const parsed = JSON.parse(content) as {
      summary?: string;
      improvementPlan?: string;
    };
    summary = parsed.summary ?? summary;
    improvementPlan = parsed.improvementPlan ?? improvementPlan;
  } catch {
    // Use defaults
  }

  await prisma.finalScorecard.upsert({
    where: { sessionId },
    create: {
      sessionId,
      ...avgScores,
      summary,
      improvementPlan,
    },
    update: {
      ...avgScores,
      summary,
      improvementPlan,
      generatedAt: new Date(),
    },
  });

  await prisma.interviewSession.update({
    where: { id: sessionId },
    data: { status: SessionStatus.SCORED },
  });
}
