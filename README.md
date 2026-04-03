# InterviewTwin AI

AI-powered mock interview platform to help you ace your next technical or behavioral interview.

## Tech Stack

- **Framework**: Next.js 16 (App Router, React 19)
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL + Prisma 7
- **Auth**: NextAuth v5 (JWT + Google OAuth)
- **AI**: OpenAI GPT-4o-mini
- **Storage**: AWS S3 (resumes, JD uploads)
- **Queue**: BullMQ + Redis (async report generation)
- **UI**: Tailwind CSS v4 + Radix UI + shadcn/ui
- **Notifications**: Sonner

## Features

- 🎯 **AI-generated questions** tailored to company, role, level, and interview type
- 🎤 **Voice transcription** via browser MediaRecorder API
- 📊 **6-dimension scoring**: Clarity, Correctness, Structure, Depth, Confidence, Adaptability
- 🤖 **Multiple personas**: Friendly, Strict, Bar Raiser
- 🏢 **Company-specific prep**: Google, Amazon, Meta, Microsoft, Stripe
- 📄 **Resume & JD upload** for personalized questions
- 📈 **Comprehensive reports** with 7-day improvement plans

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL
- Redis
- OpenAI API key
- AWS S3 bucket (for document uploads)
- Google OAuth credentials (optional)

### 1. Clone & Install

```bash
git clone https://github.com/your-org/interviewtwin-ai
cd interviewtwin-ai
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/interviewtwin"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
OPENAI_API_KEY="sk-..."
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="us-east-1"
S3_BUCKET_NAME="interviewtwin-uploads"
REDIS_URL="redis://localhost:6379"
```

### 3. Database Setup

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Docker (Recommended)

Run the full stack with Docker Compose:

```bash
cp .env.example .env
# Edit .env with your API keys
docker-compose up -d
```

This starts PostgreSQL, Redis, and the Next.js app.

## Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/                # API routes
│   │   ├── auth/           # NextAuth handlers
│   │   ├── sessions/       # Interview session CRUD
│   │   ├── reports/        # Report retrieval
│   │   └── uploads/        # S3 presigned URL generation
│   ├── auth/               # Sign in / sign up pages
│   ├── dashboard/          # User dashboard
│   ├── interview/          # Interview setup & live session
│   └── report/             # Performance report viewer
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── layout/             # Navbar, Footer
├── lib/
│   ├── ai/                 # OpenAI integration
│   │   ├── interview-service.ts   # Question generation & evaluation
│   │   ├── prompts.ts             # Prompt templates
│   │   └── openai.ts              # OpenAI client
│   ├── prisma.ts           # Prisma client singleton
│   ├── queue.ts            # BullMQ job queue
│   └── storage.ts          # S3 utilities
├── auth.ts                 # NextAuth configuration
└── proxy.ts                # Route protection (Next.js 16 proxy)

prisma/
├── schema.prisma           # Database schema
└── seed.ts                 # Seed data (rubrics, company profiles)
```

## Interview Flow

1. **Setup** (`/interview/setup`): Choose company, role, level, type, difficulty, persona
2. **Live Session** (`/interview/[sessionId]`): AI generates questions → candidate answers → real-time evaluation
3. **Report** (`/report/[sessionId]`): Comprehensive scorecard, per-question feedback, improvement plan

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET/POST | `/api/sessions` | List/create sessions |
| GET | `/api/sessions/[id]` | Get session details |
| POST | `/api/sessions/[id]/start` | Generate questions & start |
| POST | `/api/sessions/[id]/answer` | Submit & evaluate answer |
| POST | `/api/sessions/[id]/next-question` | Get next question |
| POST | `/api/sessions/[id]/complete` | Complete session |
| GET | `/api/reports/[sessionId]` | Get full report |
| POST | `/api/uploads` | Get S3 presigned upload URL |

