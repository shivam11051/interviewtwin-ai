import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Target, Users, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <div className="flex justify-center mb-6">
              <Brain className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About InterviewTwin
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We built InterviewTwin because we believe everyone deserves a fair shot
              at their dream job. Interview performance is a skill — and like any skill,
              it can be practiced and improved with the right feedback.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12">Our Mission</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: Target,
                  title: "Democratize Interview Prep",
                  description: "Not everyone can afford $500/hr coaching sessions. We make world-class interview preparation accessible to everyone.",
                },
                {
                  icon: Zap,
                  title: "AI-Powered, Human-Focused",
                  description: "Our AI provides the rigor and consistency of expert evaluation, at scale, available 24/7 whenever you need to practice.",
                },
                {
                  icon: Users,
                  title: "Built for Real Candidates",
                  description: "Created by engineers and PMs who've been through FAANG interviews themselves. We know what it takes.",
                },
                {
                  icon: Brain,
                  title: "Continuous Improvement",
                  description: "Our AI models are continuously updated with the latest interview patterns and feedback from successful candidates.",
                },
              ].map((item) => (
                <Card key={item.title} className="border shadow-sm">
                  <CardContent className="pt-6">
                    <item.icon className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed text-left">
              <p>
                InterviewTwin was founded after our team went through the gauntlet of
                Big Tech interviews. We noticed a consistent pattern: the candidates
                who performed best weren&apos;t necessarily the most technically skilled —
                they were the ones who had practiced the most.
              </p>
              <p>
                But finding quality practice opportunities is hard. Mock interviews with
                senior engineers cost hundreds of dollars. Peer practice lacks expert
                feedback. And generic interview guides don&apos;t adapt to your specific
                situation.
              </p>
              <p>
                We built InterviewTwin to solve this. Using the latest AI technology,
                we create a realistic interview environment that adapts to you — your
                target role, company, experience level, and specific areas for growth.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
