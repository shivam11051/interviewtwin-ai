import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Brain, Mic, BarChart3, MessageSquare, Users, Building2, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Real AI Evaluation",
    description: "GPT-4 powered evaluation scores your answers across 6 key dimensions. Get objective, actionable feedback every time.",
    detail: "Our AI has been trained on thousands of real interview transcripts from top tech companies to provide expert-level evaluation.",
  },
  {
    icon: Mic,
    title: "Live Voice Transcription",
    description: "Speak naturally and our AI transcribes your answers in real time with 95%+ accuracy.",
    detail: "Built on industry-leading speech recognition technology. Supports multiple accents and speaking styles.",
  },
  {
    icon: BarChart3,
    title: "6-Dimension Scoring",
    description: "Comprehensive scoring: Clarity, Correctness, Structure, Depth, Confidence, and Adaptability.",
    detail: "Each dimension is scored independently so you know exactly where to focus your practice efforts.",
  },
  {
    icon: MessageSquare,
    title: "Personalized Feedback",
    description: "Context-aware feedback tailored to your specific role, company, and experience level.",
    detail: "Feedback adapts to whether you're practicing for a junior role at a startup or a senior position at FAANG.",
  },
  {
    icon: Users,
    title: "Multiple Interviewer Personas",
    description: "Practice with Friendly, Strict, or Bar Raiser personas to be ready for any interview style.",
    detail: "The Bar Raiser persona simulates Amazon's famously rigorous bar-raising interview process.",
  },
  {
    icon: Building2,
    title: "Company-Specific Preparation",
    description: "Questions and rubrics tailored to Google, Amazon, Meta, Microsoft, Stripe, and more.",
    detail: "We analyze each company's interview culture, leadership principles, and common question patterns.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Features Built to Help You <span className="text-primary">Get Hired</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every feature is designed with one goal: helping you perform your best in real interviews.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((f) => (
                <Card key={f.title} className="border shadow-sm">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                      <f.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{f.title}</CardTitle>
                    <CardDescription>{f.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{f.detail}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Practicing?</h2>
            <p className="text-primary-foreground/80 mb-8">Get 3 free sessions — no credit card required.</p>
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="gap-2 text-primary font-semibold">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
