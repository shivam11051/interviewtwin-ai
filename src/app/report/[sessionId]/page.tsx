import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  ArrowLeft,
  Award,
  MessageSquare,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ReportPageProps {
  params: Promise<{ sessionId: string }>;
}

function ScoreBar({
  label,
  score,
}: {
  label: string;
  score: number;
}) {
  const pct = (score / 10) * 100;
  const color =
    score >= 7 ? "text-green-600" : score >= 5 ? "text-yellow-600" : "text-red-600";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className={`font-semibold ${color}`}>{score.toFixed(1)}/10</span>
      </div>
      <Progress value={pct} className="h-2" />
    </div>
  );
}

export default async function ReportPage({ params }: ReportPageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const { sessionId } = await params;

  const interviewSession = await prisma.interviewSession.findUnique({
    where: { id: sessionId, userId: session.user.id },
    include: {
      config: true,
      questions: {
        include: { transcript: true, evaluation: true },
        orderBy: { orderIndex: "asc" },
      },
      scorecard: true,
    },
  });

  if (!interviewSession) {
    notFound();
  }

  const isProcessing =
    !interviewSession.scorecard &&
    (interviewSession.status === "COMPLETED" ||
      interviewSession.status === "RUNNING");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAuthenticated userName={session.user.name ?? undefined} />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {/* Back */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Interview Report</h1>
          {interviewSession.config && (
            <p className="text-muted-foreground">
              {interviewSession.config.role} at{" "}
              {interviewSession.config.company} ·{" "}
              {interviewSession.config.level} ·{" "}
              {formatDistanceToNow(new Date(interviewSession.createdAt), {
                addSuffix: true,
              })}
            </p>
          )}
        </div>

        {isProcessing ? (
          <Card className="text-center py-16">
            <CardContent>
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                Generating Your Report
              </h2>
              <p className="text-muted-foreground mb-4">
                Our AI is analyzing your performance. This may take a minute.
              </p>
              <p className="text-sm text-muted-foreground">
                Refresh the page in a moment to see your results.
              </p>
            </CardContent>
          </Card>
        ) : !interviewSession.scorecard ? (
          <Card className="text-center py-16">
            <CardContent>
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Report Not Ready</h2>
              <p className="text-muted-foreground mb-4">
                Your report will be available after completing the interview.
              </p>
              <Link href={`/interview/${sessionId}`}>
                <Button>Continue Interview</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Overall Score */}
            <Card className="border-primary/20 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-primary">
                      {interviewSession.scorecard.overallScore.toFixed(1)}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Overall Score / 10
                    </div>
                  </div>
                  <Separator
                    orientation="vertical"
                    className="hidden md:block h-24"
                  />
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      {
                        label: "Clarity",
                        score: interviewSession.scorecard.clarityScore,
                      },
                      {
                        label: "Correctness",
                        score: interviewSession.scorecard.correctnessScore,
                      },
                      {
                        label: "Structure",
                        score: interviewSession.scorecard.structureScore,
                      },
                      {
                        label: "Depth",
                        score: interviewSession.scorecard.depthScore,
                      },
                      {
                        label: "Confidence",
                        score: interviewSession.scorecard.confidenceScore,
                      },
                      {
                        label: "Adaptability",
                        score: interviewSession.scorecard.adaptabilityScore,
                      },
                    ].map((dim) => (
                      <div key={dim.label} className="text-center p-2 rounded-lg bg-white border">
                        <div
                          className={`text-lg font-bold ${
                            dim.score >= 7
                              ? "text-green-600"
                              : dim.score >= 5
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          {dim.score.toFixed(1)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {dim.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="summary">
              <TabsList>
                <TabsTrigger value="summary">
                  <Award className="mr-2 h-4 w-4" />
                  Summary
                </TabsTrigger>
                <TabsTrigger value="questions">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Question Review
                </TabsTrigger>
                <TabsTrigger value="improvement">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Improvement Plan
                </TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Executive Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {interviewSession.scorecard.summary}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Score Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ScoreBar
                      label="Clarity"
                      score={interviewSession.scorecard.clarityScore}
                    />
                    <ScoreBar
                      label="Correctness"
                      score={interviewSession.scorecard.correctnessScore}
                    />
                    <ScoreBar
                      label="Structure"
                      score={interviewSession.scorecard.structureScore}
                    />
                    <ScoreBar
                      label="Depth"
                      score={interviewSession.scorecard.depthScore}
                    />
                    <ScoreBar
                      label="Confidence"
                      score={interviewSession.scorecard.confidenceScore}
                    />
                    <ScoreBar
                      label="Adaptability"
                      score={interviewSession.scorecard.adaptabilityScore}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="questions" className="space-y-4 mt-4">
                {interviewSession.questions.map((q, i) => (
                  <Card key={q.id}>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">Q{i + 1}</Badge>
                        <Badge variant="secondary">{q.questionType}</Badge>
                      </div>
                      <CardTitle className="text-base">
                        {q.questionText}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {q.transcript && (
                        <div>
                          <CardDescription className="mb-1">
                            Your Answer
                          </CardDescription>
                          <p className="text-sm bg-muted/50 rounded-lg p-3">
                            {q.transcript.processedText}
                          </p>
                        </div>
                      )}
                      {q.evaluation && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { label: "Clarity", v: q.evaluation.clarityScore },
                              { label: "Correctness", v: q.evaluation.correctnessScore },
                              { label: "Structure", v: q.evaluation.structureScore },
                              { label: "Depth", v: q.evaluation.depthScore },
                              { label: "Confidence", v: q.evaluation.confidenceScore },
                              { label: "Adaptability", v: q.evaluation.adaptabilityScore },
                            ].map((d) => (
                              <div
                                key={d.label}
                                className="text-center p-2 rounded bg-muted/50"
                              >
                                <div
                                  className={`font-semibold text-sm ${
                                    d.v >= 7
                                      ? "text-green-600"
                                      : d.v >= 5
                                        ? "text-yellow-600"
                                        : "text-red-600"
                                  }`}
                                >
                                  {d.v.toFixed(1)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {d.label}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div>
                            <CardDescription className="mb-1">
                              Feedback
                            </CardDescription>
                            <p className="text-sm">{q.evaluation.feedback}</p>
                          </div>
                          <div>
                            <CardDescription className="mb-1">
                              How to Improve
                            </CardDescription>
                            <p className="text-sm text-muted-foreground">
                              {q.evaluation.improvements}
                            </p>
                          </div>
                        </div>
                      )}
                      {!q.evaluation && (
                        <p className="text-sm text-muted-foreground italic">
                          Not answered
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="improvement" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>7-Day Improvement Plan</CardTitle>
                    <CardDescription>
                      A personalized action plan based on your performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {interviewSession.scorecard.improvementPlan}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex gap-3 justify-center pt-4">
              <Link href="/interview/setup">
                <Button>Practice Again</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
