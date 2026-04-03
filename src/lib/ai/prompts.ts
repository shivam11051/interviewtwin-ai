import { InterviewType, Difficulty, Persona } from "@prisma/client";

function sanitizeInput(value: string, maxLength = 300): string {
  return value
    .replace(/[<>\\`]/g, "")
    .replace(/[\r\n]{3,}/g, "\n\n")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .slice(0, maxLength)
    .trim();
}

export function getSystemPrompt(persona: Persona): string {
  const personas: Record<Persona, string> = {
    FRIENDLY:
      "You are a friendly and encouraging interviewer who creates a comfortable environment while still assessing competency thoroughly. You provide supportive feedback.",
    STRICT:
      "You are a rigorous and demanding interviewer with high standards. You probe deeply and expect precise, well-structured answers. You are direct and professional.",
    BAR_RAISER:
      "You are a senior interviewer focused on raising the hiring bar. You ask challenging follow-up questions, look for exceptional depth, and have very high expectations.",
  };
  return personas[persona];
}

export function getQuestionGenerationPrompt(config: {
  company: string;
  role: string;
  level: string;
  interviewType: InterviewType;
  difficulty: Difficulty;
  numQuestions: number;
  resumeText?: string;
  jdText?: string;
}): string {
  const company = sanitizeInput(config.company);
  const role = sanitizeInput(config.role);
  const level = sanitizeInput(config.level);
  return `Generate ${config.numQuestions} interview questions for a ${level} ${role} position at ${company}.

Interview Type: ${config.interviewType}
Difficulty: ${config.difficulty}
${config.resumeText ? `Candidate Resume:\n${config.resumeText}\n` : ""}
${config.jdText ? `Job Description:\n${config.jdText}\n` : ""}

Return a JSON array of questions in this format:
[
  {
    "questionText": "Tell me about a time when...",
    "questionType": "behavioral|technical|situational",
    "orderIndex": 0
  }
]

For BEHAVIORAL: Focus on STAR method questions about past experiences.
For TECHNICAL: Focus on coding concepts, system design, or domain-specific knowledge.
For MIXED: Mix both behavioral and technical questions.

Make questions appropriate for ${config.level} level. Only return the JSON array, no other text.`;
}

export function getEvaluationPrompt(
  questionText: string,
  answerText: string,
  questionType: string,
  config: { company: string; role: string; level: string }
): string {
  const company = sanitizeInput(config.company);
  const role = sanitizeInput(config.role);
  const level = sanitizeInput(config.level);
  return `Evaluate this interview answer for a ${level} ${role} position at ${company}.

Question: ${questionText}
Question Type: ${questionType}
Answer: ${answerText}

Rate each dimension from 0-10 and provide specific feedback.

Return JSON in this exact format:
{
  "clarityScore": 7.5,
  "correctnessScore": 8.0,
  "structureScore": 7.0,
  "depthScore": 6.5,
  "confidenceScore": 8.0,
  "adaptabilityScore": 7.0,
  "overallScore": 7.3,
  "feedback": "Detailed feedback paragraph about this answer",
  "improvements": "Specific suggestions to improve this answer"
}

Scoring criteria:
- Clarity (0-10): How clear and understandable is the answer?
- Correctness (0-10): Is the answer technically/factually accurate?
- Structure (0-10): Is the answer well-organized (e.g., uses STAR for behavioral)?
- Depth (0-10): Does the answer show sufficient depth and insight?
- Confidence (0-10): Does the answer convey confidence and assertiveness?
- Adaptability (0-10): Does the candidate adapt their answer appropriately?

Only return the JSON, no other text.`;
}

export function getFollowUpPrompt(
  previousQuestion: string,
  answer: string,
  persona: Persona
): string {
  return `As a ${persona.toLowerCase()} interviewer, generate one follow-up question based on this exchange.

Previous Question: ${previousQuestion}
Candidate Answer: ${answer}

Generate a probing follow-up question that digs deeper into their answer or explores a weakness/gap. Return only the question text, nothing else.`;
}

export function getReportSynthesisPrompt(
  scores: {
    clarityScore: number;
    correctnessScore: number;
    structureScore: number;
    depthScore: number;
    confidenceScore: number;
    adaptabilityScore: number;
    overallScore: number;
  },
  questionFeedbacks: Array<{
    question: string;
    feedback: string;
    improvements: string;
  }>,
  config: { company: string; role: string; level: string }
): string {
  const company = sanitizeInput(config.company);
  const role = sanitizeInput(config.role);
  const level = sanitizeInput(config.level);
  return `Synthesize a final interview report for a ${level} ${role} candidate for ${company}.

Overall Scores:
- Clarity: ${scores.clarityScore}/10
- Correctness: ${scores.correctnessScore}/10
- Structure: ${scores.structureScore}/10
- Depth: ${scores.depthScore}/10
- Confidence: ${scores.confidenceScore}/10
- Adaptability: ${scores.adaptabilityScore}/10
- Overall: ${scores.overallScore}/10

Per-Question Feedback:
${questionFeedbacks
  .map(
    (q, i) =>
      `Q${i + 1}: ${q.question}\nFeedback: ${q.feedback}\nImprovements: ${q.improvements}`
  )
  .join("\n\n")}

Return JSON in this exact format:
{
  "summary": "A 2-3 paragraph executive summary of the candidate's performance",
  "improvementPlan": "A structured 7-day improvement plan with specific daily actions and resources"
}

Only return the JSON, no other text.`;
}
