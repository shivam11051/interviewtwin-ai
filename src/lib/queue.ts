import { Queue, Worker, Job } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(
  process.env.REDIS_URL ?? "redis://localhost:6379",
  {
    maxRetriesPerRequest: null,
  }
);

export const reportQueue = new Queue("report-generation", { connection });

export interface ReportJobData {
  sessionId: string;
}

export function createReportWorker() {
  return new Worker<ReportJobData>(
    "report-generation",
    async (job: Job<ReportJobData>) => {
      const { generateFinalReport } = await import(
        "@/lib/ai/interview-service"
      );
      await generateFinalReport(job.data.sessionId);
    },
    { connection }
  );
}

export async function queueReportGeneration(sessionId: string): Promise<void> {
  await reportQueue.add(
    "generate-report",
    { sessionId },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
    }
  );
}
