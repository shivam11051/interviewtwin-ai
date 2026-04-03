import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>

          <div className="prose prose-gray max-w-none space-y-8">
            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed">
                We collect information you provide when you create an account (name, email), conduct
                interview sessions (audio recordings, transcripts, answers), and upload documents
                (resumes, job descriptions). We also collect usage data and analytics to improve
                our service.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use your information to provide and improve the InterviewTwin service, generate
                AI-powered feedback and evaluations, send you account notifications, and analyze
                usage patterns to enhance our product. We do not sell your personal data to third parties.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">3. Data Storage & Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your data is stored on encrypted servers (AWS) in the United States. We use
                industry-standard encryption (TLS/SSL) for all data in transit and AES-256
                encryption for data at rest. Interview recordings are stored securely in
                Amazon S3 with restricted access.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">4. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your interview data for as long as your account is active. You can
                delete your account and all associated data at any time from your account
                settings. We will permanently delete your data within 30 days of receiving
                a deletion request.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">5. Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use the following third-party services: OpenAI (for AI evaluation),
                Amazon Web Services (for storage and infrastructure), Google (for OAuth
                authentication). Each service has their own privacy policies which govern
                their use of your data.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">6. Your Rights (GDPR)</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you are in the EU/EEA, you have the right to access, correct, or delete
                your personal data. You may also request data portability or object to
                processing. Contact us at privacy@interviewtwin.ai to exercise these rights.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">7. Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                For privacy-related questions, contact us at{" "}
                <a href="mailto:privacy@interviewtwin.ai" className="text-primary hover:underline">
                  privacy@interviewtwin.ai
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
