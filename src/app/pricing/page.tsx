import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CheckCircle, ArrowRight } from "lucide-react";

const tiers = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying out InterviewTwin",
    features: [
      "3 interview sessions/month",
      "Basic AI evaluation",
      "Question-level feedback",
      "2 company profiles",
      "Behavioral interviews only",
    ],
    cta: "Start Free",
    href: "/auth/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For serious job seekers",
    features: [
      "Unlimited interview sessions",
      "Full 6-dimension scoring",
      "Personalized 7-day improvement plans",
      "All 5+ company profiles",
      "All interview types (Behavioral, Technical, Mixed)",
      "All 3 interviewer personas",
      "Resume & JD upload",
      "Report export (PDF)",
      "Priority email support",
    ],
    cta: "Start 7-Day Free Trial",
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
      "Bulk session management",
      "Dedicated account manager",
      "API access",
      "SSO / SAML",
    ],
    cta: "Contact Sales",
    href: "/contact",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">
              Start for free. Upgrade when you need more power to ace your interviews.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {tiers.map((tier) => (
                <Card
                  key={tier.name}
                  className={`relative ${tier.highlighted ? "border-primary shadow-xl scale-105" : "border shadow-sm"}`}
                >
                  {tier.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-1.5 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold">{tier.price}</span>
                      {tier.period && <span className="text-muted-foreground">{tier.period}</span>}
                    </div>
                    <CardDescription>{tier.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
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
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            <p className="text-center text-muted-foreground mt-8 text-sm">
              All plans include SSL encryption and GDPR-compliant data handling.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
