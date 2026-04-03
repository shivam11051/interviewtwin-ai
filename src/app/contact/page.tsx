import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageSquare } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-muted-foreground text-lg">
              We&apos;d love to hear from you. Reach out with any questions or feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Email Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-2">
                  For technical support and account questions
                </p>
                <a
                  href="mailto:support@interviewtwin.ai"
                  className="text-primary hover:underline font-medium"
                >
                  support@interviewtwin.ai
                </a>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Sales & Partnerships
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-2">
                  For Teams plans and partnership inquiries
                </p>
                <a
                  href="mailto:sales@interviewtwin.ai"
                  className="text-primary hover:underline font-medium"
                >
                  sales@interviewtwin.ai
                </a>
              </CardContent>
            </Card>
          </div>

          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  q: "How quickly do you respond to support requests?",
                  a: "We typically respond within 24 hours on business days. Pro plan users get priority support.",
                },
                {
                  q: "Can I get a refund?",
                  a: "Yes, we offer a 30-day money-back guarantee on all paid plans. No questions asked.",
                },
                {
                  q: "Do you offer educational discounts?",
                  a: "Yes! Students and bootcamp participants get 50% off Pro plans. Email us with proof of enrollment.",
                },
              ].map((item) => (
                <div key={item.q} className="space-y-1">
                  <p className="font-medium text-sm">{item.q}</p>
                  <p className="text-muted-foreground text-sm">{item.a}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
