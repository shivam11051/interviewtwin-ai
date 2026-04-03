"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Brain, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Step = 1 | 2 | 3;

interface FormData {
  company: string;
  role: string;
  level: string;
  interviewType: "BEHAVIORAL" | "TECHNICAL" | "MIXED";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  persona: "FRIENDLY" | "STRICT" | "BAR_RAISER";
}

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    company: "",
    role: "",
    level: "Mid-level",
    interviewType: "BEHAVIORAL",
    difficulty: "MEDIUM",
    persona: "FRIENDLY",
  });

  const update = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    if (step === 1) return formData.company && formData.role && formData.level;
    if (step === 2) return formData.interviewType && formData.difficulty;
    return true;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        toast.error(
          typeof data.error === "string" ? data.error : "Failed to create session"
        );
        return;
      }

      const session = (await res.json()) as { id: string };
      toast.success("Interview session created!");
      router.push(`/interview/${session.id}`);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAuthenticated />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Brain className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Set Up Your Interview</h1>
          <p className="text-muted-foreground mt-2">
            Configure your mock interview session
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {([1, 2, 3] as Step[]).map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  s === step
                    ? "bg-primary text-primary-foreground"
                    : s < step
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`h-0.5 w-12 mx-1 ${s < step ? "bg-primary" : "bg-muted"}`}
                />
              )}
            </div>
          ))}
        </div>

        <Card>
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle>Role & Company</CardTitle>
                <CardDescription>
                  Tell us about the position you&apos;re preparing for
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    placeholder="e.g. Google, Amazon, Stripe"
                    value={formData.company}
                    onChange={(e) => update("company", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    placeholder="e.g. Software Engineer, Product Manager"
                    value={formData.role}
                    onChange={(e) => update("role", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(v) => update("level", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Junior">Junior (0-2 years)</SelectItem>
                      <SelectItem value="Mid-level">
                        Mid-level (2-5 years)
                      </SelectItem>
                      <SelectItem value="Senior">Senior (5+ years)</SelectItem>
                      <SelectItem value="Staff">Staff / Principal</SelectItem>
                      <SelectItem value="Manager">
                        Engineering Manager
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle>Interview Type & Difficulty</CardTitle>
                <CardDescription>
                  Choose the type and difficulty of your interview
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Interview Type</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {(
                      [
                        { value: "BEHAVIORAL", label: "Behavioral", desc: "STAR stories" },
                        { value: "TECHNICAL", label: "Technical", desc: "Coding & design" },
                        { value: "MIXED", label: "Mixed", desc: "Both types" },
                      ] as const
                    ).map((type) => (
                      <button
                        key={type.value}
                        onClick={() => update("interviewType", type.value)}
                        className={`p-3 rounded-lg border text-left transition-colors ${
                          formData.interviewType === type.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="font-medium text-sm">{type.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {type.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {(
                      [
                        { value: "EASY", label: "Easy", color: "text-green-600" },
                        { value: "MEDIUM", label: "Medium", color: "text-yellow-600" },
                        { value: "HARD", label: "Hard", color: "text-red-600" },
                      ] as const
                    ).map((diff) => (
                      <button
                        key={diff.value}
                        onClick={() => update("difficulty", diff.value)}
                        className={`p-3 rounded-lg border text-center transition-colors ${
                          formData.difficulty === diff.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className={`font-medium text-sm ${diff.color}`}>
                          {diff.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle>Interviewer Persona</CardTitle>
                <CardDescription>
                  Choose your interviewer&apos;s style
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {(
                  [
                    {
                      value: "FRIENDLY",
                      label: "Friendly",
                      emoji: "😊",
                      desc: "Encouraging and supportive. Great for beginners.",
                    },
                    {
                      value: "STRICT",
                      label: "Strict",
                      emoji: "🎯",
                      desc: "Rigorous and demanding. Expects precision.",
                    },
                    {
                      value: "BAR_RAISER",
                      label: "Bar Raiser",
                      emoji: "🔥",
                      desc: "Highest standards. Challenging follow-ups.",
                    },
                  ] as const
                ).map((persona) => (
                  <button
                    key={persona.value}
                    onClick={() => update("persona", persona.value)}
                    className={`w-full p-4 rounded-lg border text-left transition-colors ${
                      formData.persona === persona.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{persona.emoji}</span>
                      <div>
                        <div className="font-medium">{persona.label}</div>
                        <div className="text-sm text-muted-foreground">
                          {persona.desc}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </>
          )}
        </Card>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setStep((s) => Math.max(1, s - 1) as Step)}
            disabled={step === 1}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {step < 3 ? (
            <Button
              onClick={() => setStep((s) => Math.min(3, s + 1) as Step)}
              disabled={!canProceed()}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Start Interview
            </Button>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
