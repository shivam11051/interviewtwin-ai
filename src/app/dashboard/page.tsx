import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Plus, TrendingUp, Clock, Award, Target } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const statusColors: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  CREATED: "secondary",
  READY: "secondary",
  RUNNING: "default",
  COMPLETED: "default",
  SCORED: "default",
};

const statusLabels: Record<string, string> = {
  CREATED: "Not Started",
  READY: "Ready",
  RUNNING: "In Progress",
  COMPLETED: "Completed",
  SCORED: "Scored",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const sessions = await prisma.interviewSession.findMany({
    where: { userId: session.user.id },
    include: { config: true, scorecard: true },
    orderBy: { createdAt: "desc" },
  });

  const scoredSessions = sessions.filter((s) => s.scorecard);
  const avgScore =
    scoredSessions.length > 0
      ? scoredSessions.reduce(
          (acc, s) => acc + (s.scorecard?.overallScore ?? 0),
          0
        ) / scoredSessions.length
      : 0;

  const bestScore =
    scoredSessions.length > 0
      ? Math.max(...scoredSessions.map((s) => s.scorecard?.overallScore ?? 0))
      : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAuthenticated userName={session.user.name ?? undefined} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {session.user.name ?? session.user.email}!
            </p>
          </div>
          <Link href="/interview/setup">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Interview
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Total Sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{sessions.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Average Score
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {avgScore > 0 ? avgScore.toFixed(1) : "—"}
                {avgScore > 0 && (
                  <span className="text-sm font-normal text-muted-foreground">
                    /10
                  </span>
                )}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Best Score
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {bestScore > 0 ? bestScore.toFixed(1) : "—"}
                {bestScore > 0 && (
                  <span className="text-sm font-normal text-muted-foreground">
                    /10
                  </span>
                )}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{scoredSessions.length}</p>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Sessions</h2>
          {sessions.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  No interview sessions yet.
                </p>
                <Link href="/interview/setup">
                  <Button>Start Your First Interview</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {sessions.map((s) => (
                <Card key={s.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">
                            {s.config?.role ?? "Interview Session"}
                          </h3>
                          {s.config?.company && (
                            <span className="text-muted-foreground text-sm">
                              at {s.config.company}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <Badge variant={statusColors[s.status] ?? "secondary"}>
                            {statusLabels[s.status] ?? s.status}
                          </Badge>
                          {s.config && (
                            <span>
                              {s.config.interviewType} · {s.config.difficulty}
                            </span>
                          )}
                          <span>
                            {formatDistanceToNow(new Date(s.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {s.scorecard && (
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">
                              {s.scorecard.overallScore.toFixed(1)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              / 10
                            </p>
                          </div>
                        )}
                        {s.status === "SCORED" || s.status === "COMPLETED" ? (
                          <Link href={`/report/${s.id}`}>
                            <Button variant="outline" size="sm">
                              View Report
                            </Button>
                          </Link>
                        ) : s.status === "RUNNING" ? (
                          <Link href={`/interview/${s.id}`}>
                            <Button size="sm">Continue</Button>
                          </Link>
                        ) : (
                          <Link href={`/interview/${s.id}`}>
                            <Button size="sm">Start</Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
