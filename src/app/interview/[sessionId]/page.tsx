"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  MicOff,
  ChevronRight,
  CheckCircle,
  Loader2,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

interface Question {
  id: string;
  questionText: string;
  questionType: string;
  orderIndex: number;
}

interface SessionData {
  id: string;
  status: string;
  config: {
    company: string;
    role: string;
    level: string;
    persona: string;
  } | null;
  questions: Question[];
}

export default function InterviewPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [session, setSession] = useState<SessionData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [phase, setPhase] = useState<"starting" | "answering" | "done">(
    "starting"
  );

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback(() => {
    setElapsedSeconds(0);
    timerRef.current = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, [stopTimer]);

  useEffect(() => {
    const initSession = async () => {
      try {
        const res = await fetch(`/api/sessions/${sessionId}`);
        if (!res.ok) {
          toast.error("Session not found");
          router.push("/dashboard");
          return;
        }
        const data = (await res.json()) as SessionData;
        setSession(data);

        if (data.status === "SCORED" || data.status === "COMPLETED") {
          router.push(`/report/${sessionId}`);
          return;
        }

        if (data.status === "RUNNING" && data.questions.length > 0) {
          setCurrentQuestion(data.questions[0]);
          setTotalQuestions(data.questions.length);
          setPhase("answering");
          startTimer();
        } else if (
          data.status === "CREATED" ||
          data.status === "READY"
        ) {
          // Start the session
          const startRes = await fetch(`/api/sessions/${sessionId}/start`, {
            method: "POST",
          });
          if (!startRes.ok) {
            toast.error("Failed to start session");
            return;
          }
          const startData = (await startRes.json()) as {
            firstQuestion: Question;
            totalQuestions: number;
          };
          setCurrentQuestion(startData.firstQuestion);
          setTotalQuestions(startData.totalQuestions);
          setPhase("answering");
          startTimer();
        }
      } catch {
        toast.error("Failed to load session");
      } finally {
        setIsLoading(false);
      }
    };

    initSession();
  }, [sessionId, router, startTimer]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      toast.error("Microphone access denied. Please type your answer instead.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentQuestion || !answer.trim()) {
      toast.error("Please provide an answer before continuing.");
      return;
    }

    setIsSubmitting(true);
    stopTimer();

    try {
      const res = await fetch(`/api/sessions/${sessionId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          transcript: answer,
          durationSeconds: elapsedSeconds,
        }),
      });

      if (!res.ok) {
        toast.error("Failed to submit answer");
        return;
      }

      toast.success("Answer submitted and evaluated!");

      // Get next question
      const nextRes = await fetch(`/api/sessions/${sessionId}/next-question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentQuestionIndex: currentIndex }),
      });

      const nextData = (await nextRes.json()) as {
        done: boolean;
        question: Question | null;
      };

      if (nextData.done || !nextData.question) {
        setPhase("done");
      } else {
        setCurrentQuestion(nextData.question);
        setCurrentIndex((i) => i + 1);
        setAnswer("");
        setElapsedSeconds(0);
        startTimer();
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      const res = await fetch(`/api/sessions/${sessionId}/complete`, {
        method: "POST",
      });
      if (!res.ok) {
        toast.error("Failed to complete session");
        return;
      }
      toast.success("Interview completed! Generating your report...");
      router.push(`/report/${sessionId}`);
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsCompleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Setting up your interview...</p>
        </div>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white">
        <Card className="max-w-md w-full mx-4 text-center">
          <CardContent className="pt-8 pb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Interview Complete!</h2>
            <p className="text-muted-foreground mb-6">
              You&apos;ve answered all {totalQuestions} questions. Click below to
              generate your comprehensive performance report.
            </p>
            <Button
              size="lg"
              onClick={handleComplete}
              disabled={isCompleting}
              className="w-full"
            >
              {isCompleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Generate My Report
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-sm">
              {session?.config?.company ?? "Interview"} ·{" "}
              {session?.config?.role ?? "Session"}
            </span>
            <Badge variant="outline">
              Question {currentIndex + 1} of {totalQuestions}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Clock className="h-4 w-4" />
            {formatTime(elapsedSeconds)}
          </div>
        </div>
        <Progress
          value={((currentIndex + 1) / Math.max(totalQuestions, 1)) * 100}
          className="h-1 rounded-none"
        />
      </div>

      {/* Main */}
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {currentQuestion && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">
                    {currentQuestion.questionType}
                  </Badge>
                </div>
                <CardTitle className="text-xl leading-relaxed">
                  {currentQuestion.questionText}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Your Answer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Type your answer here, or use the microphone to record..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={8}
                  disabled={isSubmitting}
                />

                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isSubmitting}
                    className={isRecording ? "text-red-500 border-red-300" : ""}
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="mr-2 h-4 w-4" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="mr-2 h-4 w-4" />
                        Record Audio
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={isSubmitting || !answer.trim()}
                  >
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ChevronRight className="mr-2 h-4 w-4" />
                    )}
                    {currentIndex + 1 === totalQuestions
                      ? "Submit Final Answer"
                      : "Submit & Next Question"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <p className="text-center text-xs text-muted-foreground">
              Take your time. There&apos;s no time limit. Focus on giving a
              complete, well-structured answer.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
