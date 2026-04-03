import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>

          <div className="space-y-8">
            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using InterviewTwin AI (&ldquo;the Service&rdquo;), you agree to be
                bound by these Terms of Service. If you do not agree to these terms, please
                do not use the Service.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed">
                InterviewTwin AI provides an AI-powered mock interview practice platform.
                The Service includes interview simulation, AI evaluation, performance scoring,
                and personalized feedback. The Service is intended for personal career
                development purposes.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">3. User Accounts</h2>
              <p className="text-muted-foreground leading-relaxed">
                You must create an account to use most features of the Service. You are
                responsible for maintaining the confidentiality of your account credentials.
                You must provide accurate information when creating your account. You must
                be at least 16 years old to use the Service.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">4. Acceptable Use</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree not to: attempt to reverse engineer or scrape the AI models,
                share your account with others, use the Service for any illegal purpose,
                upload harmful or malicious content, or attempt to circumvent our
                subscription system.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">5. Subscription & Payments</h2>
              <p className="text-muted-foreground leading-relaxed">
                Paid subscriptions are billed monthly or annually as selected. We offer a
                30-day money-back guarantee for new subscribers. Subscriptions auto-renew
                unless cancelled. You can cancel at any time through your account settings.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">6. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                The Service and its original content are the exclusive property of
                InterviewTwin AI. You retain ownership of content you upload (resumes,
                etc.). By uploading content, you grant us a license to use it to provide
                the Service to you.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">7. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground leading-relaxed">
                The Service is provided &ldquo;as is&rdquo; without warranties of any kind. AI
                evaluations are provided for practice purposes only and do not guarantee
                outcomes in real interviews. We do not guarantee that using our Service
                will result in employment.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">8. Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these terms, contact us at{" "}
                <a
                  href="mailto:legal@interviewtwin.ai"
                  className="text-primary hover:underline"
                >
                  legal@interviewtwin.ai
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
