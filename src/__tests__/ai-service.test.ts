import { generateQuestions, evaluateAnswer } from "../lib/ai/interview-service";
import { InterviewType, Difficulty, Persona } from "@prisma/client";

// Mock the OpenAI module
jest.mock("../lib/ai/openai", () => ({
  openai: {
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  },
}));

// Mock Prisma
jest.mock("../lib/prisma", () => ({
  prisma: {
    interviewSession: { findUnique: jest.fn(), update: jest.fn() },
    finalScorecard: { upsert: jest.fn() },
  },
}));

import { openai } from "../lib/ai/openai";

const mockOpenAI = openai as jest.Mocked<typeof openai>;

describe("generateQuestions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return generated questions from OpenAI", async () => {
    const mockQuestions = [
      { questionText: "Tell me about yourself", questionType: "behavioral", orderIndex: 0 },
      { questionText: "Describe a challenge you overcame", questionType: "behavioral", orderIndex: 1 },
    ];

    (mockOpenAI.chat.completions.create as jest.Mock).mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({ questions: mockQuestions }),
          },
        },
      ],
    });

    const result = await generateQuestions({
      company: "Google",
      role: "Software Engineer",
      level: "Senior",
      interviewType: InterviewType.BEHAVIORAL,
      difficulty: Difficulty.MEDIUM,
      numQuestions: 2,
    });

    expect(result).toHaveLength(2);
    expect(result[0].questionText).toBe("Tell me about yourself");
    expect(mockOpenAI.chat.completions.create).toHaveBeenCalledTimes(1);
  });

  it("should return empty array when OpenAI returns invalid JSON", async () => {
    (mockOpenAI.chat.completions.create as jest.Mock).mockResolvedValue({
      choices: [{ message: { content: "invalid json" } }],
    });

    const result = await generateQuestions({
      company: "Meta",
      role: "PM",
      level: "Mid-level",
      interviewType: InterviewType.MIXED,
      difficulty: Difficulty.EASY,
    });

    expect(result).toEqual([]);
  });
});

describe("evaluateAnswer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return evaluation scores from OpenAI", async () => {
    const mockEvaluation = {
      clarityScore: 8.0,
      correctnessScore: 7.5,
      structureScore: 8.5,
      depthScore: 7.0,
      confidenceScore: 8.0,
      adaptabilityScore: 7.5,
      overallScore: 7.8,
      feedback: "Good answer with clear structure.",
      improvements: "Add more specific examples.",
    };

    (mockOpenAI.chat.completions.create as jest.Mock).mockResolvedValue({
      choices: [{ message: { content: JSON.stringify(mockEvaluation) } }],
    });

    const result = await evaluateAnswer(
      "Tell me about a challenging project",
      "I led a team of 5 engineers to migrate our monolith to microservices...",
      "behavioral",
      { company: "Amazon", role: "Senior SDE", level: "Senior" },
      Persona.FRIENDLY
    );

    expect(result.clarityScore).toBe(8.0);
    expect(result.overallScore).toBe(7.8);
    expect(result.feedback).toBe("Good answer with clear structure.");
    expect(mockOpenAI.chat.completions.create).toHaveBeenCalledTimes(1);
  });

  it("should return default scores when OpenAI fails", async () => {
    (mockOpenAI.chat.completions.create as jest.Mock).mockResolvedValue({
      choices: [{ message: { content: "bad json {{" } }],
    });

    const result = await evaluateAnswer(
      "Tell me about a time you failed",
      "I once missed a deadline...",
      "behavioral",
      { company: "Meta", role: "PM", level: "Mid-level" },
      Persona.STRICT
    );

    expect(result.overallScore).toBe(5);
    expect(result.feedback).toBe("Unable to evaluate answer at this time.");
  });
});
