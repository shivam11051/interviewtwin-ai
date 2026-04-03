import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  Brain,
  Mic,
  BarChart3,
  MessageSquare,
  Users,
  Building2,
  CheckCircle,
  Star,
  ArrowRight,
  Zap,
  Shield,
  Clock,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Real AI Evaluation",
    description:
      "GPT-4 powered evaluation across 6 key dimensions: clarity, correctness, structure, depth, confidence, and adaptability.",
  },
  {
    icon: Mic,
    title: "Live Transcription",
    description:
      "Speak naturally while our AI transcribes and analyzes your answers in real time with high accuracy.",
  },
  {
    icon: BarChart3,
    title: "6-Dimension Scoring",
    description:
      "Comprehensive scoring framework gives you precise insights into every aspect of your interview performance.",
  },
  {
    icon: MessageSquare,
    title: "Personalized Feedback",
    description:
      "Receive detailed, actionable feedback tailored to the specific role, company, and difficulty level.",
  },
  {
    icon: Users,
    title: "Multiple Personas",
    description:
      "Practice with Friendly, Strict, or Bar Raiser interviewer personas to prepare for any style.",
  },
  {
    icon: Building2,
    title: "Company-Specific Prep",
    description:
      "Tailored questions and evaluation for top companies like Google, Amazon, Meta, Microsoft, and more.",
  },
];

const steps = [
  {
    step: "1",
    title: "Setup Your Interview",
    description:
      "Choose your target company, role, level, and interview style. Upload your resume and job description for personalized questions.",
  },
  {
    step: "2",
    title: "Practice Live",
    description:
      "Answer AI-generated questions via voice or text. Get real-time transcription and immediate question-by-question feedback.",
  },
  {
    step: "3",
    title: "Improve with Analytics",
    description:
      "Review your comprehensive scorecard, detailed feedback, and a personalized 7-day improvement plan.",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer at Google",
    content:
      "InterviewTwin helped me crack Google after 3 failed attempts. The Bar Raiser persona simulations were incredibly realistic.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Product Manager at Meta",
    content:
      "The 6-dimension scoring showed me exactly where I was weak. I improved my structure score from 4.2 to 8.7 in two weeks.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Data Scientist at Amazon",
    content:
      "The Amazon Leadership Principles-focused practice was spot on. Got an offer after just 10 sessions with InterviewTwin.",
    rating: 5,
  },
];

const faqs = [
  {
    question: "How does the AI evaluation work?",
    answer:
      "Our AI uses GPT-4 to analyze your answers across 6 dimensions: clarity, correctness, structure, depth, confidence, and adaptability. It provides specific scores and actionable feedback for each dimension.",
  },
  {
    question: "Can I practice for specific companies?",
    answer:
      "Yes! We have company-specific profiles for Google, Amazon, Meta, Microsoft, Stripe, and many more. Questions and evaluation criteria are tailored to each company's interview style.",
  },
  {
    question: "What interview types are supported?",
    answer:
      "We support Behavioral (STAR method), Technical (coding, system design, domain knowledge), and Mixed interviews across Easy, Medium, and Hard difficulty levels.",
  },
  {
    question: "How accurate is the voice transcription?",
    answer:
      "Our transcription is powered by industry-leading speech recognition with 95%+ accuracy. You can also type your answers if you prefer.",
  },
  {
    question: "Can I upload my resume and job description?",
    answer:
      "Absolutely! Upload your resume and target job description to get personalized questions that highlight your specific background and the role requirements.",
  },
  {
    question: "Is my data kept private?",
    answer:
      "Yes. Your interview sessions, transcripts, and personal data are encrypted and never shared. You can delete your data at any time.",
  },
];

const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    description: "Get started with AI interview practice",
    features: [
      "3 interview sessions/month",
      "Basic AI evaluation",
      "Question-level feedback",
      "2 company profiles",
    ],
    cta: "Start Free",
    href: "/auth/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "Unlimited practice for serious job seekers",
    features: [
      "Unlimited sessions",
      "Full 6-dimension scoring",
      "Personalized improvement plans",
      "All company profiles",
      "All interviewer personas",
      "Resume & JD upload",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    href: "/auth/signup",
    highlighted: true,
  },
  {
    name: "Teams",
    price: "$99",
    period: "/month",
    description: "For bootcamps and recruiting teams",
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "Team analytics dashboard",
      "Custom rubric profiles",
      "Dedicated account manager",
      "API access",
    ],
    cta: "Contact Sales",
    href: "/contact",
    highlighted: false,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            Powered by GPT-4o
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
            Ace Your Next Interview with{" "}
            <span className="text-primary">AI-Powered Coaching</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Practice with realistic AI interviewers, get instant feedback
            across 6 key dimensions, and land your dream job at top tech
            companies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="gap-2">
                Start Practicing Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/features">
              <Button size="lg" variant="outline">
                See How It Works
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required · 3 free sessions
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              InterviewTwin combines cutting-edge AI with proven interview
              frameworks to give you the most realistic practice experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="border-0 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              How InterviewTwin Works
            </h2>
            <p className="text-muted-foreground">
              Go from nervous to confident in three simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Loved by Job Seekers Worldwide
            </h2>
            <p className="text-muted-foreground">
              Join thousands who landed their dream jobs with InterviewTwin
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="border shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    &ldquo;{t.content}&rdquo;
                  </p>
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground">
              Start free, upgrade when you need more
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingTiers.map((tier) => (
              <Card
                key={tier.name}
                className={`relative ${tier.highlighted ? "border-primary shadow-lg scale-105" : "border shadow-sm"}`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{tier.name}</CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    {tier.period && (
                      <span className="text-muted-foreground">
                        {tier.period}
                      </span>
                    )}
                  </div>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={tier.href} className="block">
                    <Button
                      className="w-full"
                      variant={tier.highlighted ? "default" : "outline"}
                    >
                      {tier.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.question} className="border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center gap-4 mb-6">
            <Shield className="h-8 w-8 opacity-80" />
            <Clock className="h-8 w-8 opacity-80" />
            <Zap className="h-8 w-8 opacity-80" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-primary-foreground/80 text-xl mb-8 max-w-xl mx-auto">
            Join thousands of successful candidates who used InterviewTwin to
            prepare and succeed.
          </p>
          <Link href="/auth/signup">
            <Button
              size="lg"
              variant="secondary"
              className="gap-2 text-primary font-semibold"
            >
              Start Practicing for Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <p className="mt-4 text-primary-foreground/60 text-sm">
            No credit card required · Cancel anytime
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
