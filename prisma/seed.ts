import {
  PrismaClient,
  InterviewType,
  Difficulty,
  Persona,
} from "@prisma/client";

// Suppress unused variable warnings for imported enums used for type context
void InterviewType;
void Difficulty;
void Persona;

const prisma = new PrismaClient();

async function main() {
  // RubricProfiles
  await prisma.rubricProfile.upsert({
    where: { id: "rubric-generic" },
    create: {
      id: "rubric-generic",
      name: "Generic",
      description: "Balanced rubric for general interviews",
      isDefault: true,
      weights: {
        clarity: 1.0,
        correctness: 1.0,
        structure: 1.0,
        depth: 1.0,
        confidence: 1.0,
        adaptability: 1.0,
      },
    },
    update: {},
  });

  await prisma.rubricProfile.upsert({
    where: { id: "rubric-amazon" },
    create: {
      id: "rubric-amazon",
      name: "Amazon-style",
      description: "Leadership Principles focused rubric",
      isDefault: false,
      weights: {
        clarity: 1.2,
        correctness: 1.0,
        structure: 1.5,
        depth: 1.3,
        confidence: 1.0,
        adaptability: 1.0,
      },
    },
    update: {},
  });

  await prisma.rubricProfile.upsert({
    where: { id: "rubric-google" },
    create: {
      id: "rubric-google",
      name: "Google-style",
      description: "Googliness and cognitive ability focused",
      isDefault: false,
      weights: {
        clarity: 1.3,
        correctness: 1.5,
        structure: 1.2,
        depth: 1.5,
        confidence: 0.8,
        adaptability: 1.2,
      },
    },
    update: {},
  });

  // CompanyProfiles
  const companies = [
    {
      id: "company-google",
      name: "Google",
      description: "Search & Cloud giant",
      interviewStyle:
        "Highly technical with focus on algorithms and system design. Googliness assessed.",
      commonTopics: [
        "Algorithms",
        "Data Structures",
        "System Design",
        "Leadership",
        "Problem Solving",
      ],
    },
    {
      id: "company-amazon",
      name: "Amazon",
      description: "E-commerce & Cloud leader",
      interviewStyle:
        "Leadership Principles based. STAR method essential. Bar Raiser interview included.",
      commonTopics: [
        "Leadership Principles",
        "Customer Obsession",
        "Ownership",
        "System Design",
        "STAR Stories",
      ],
    },
    {
      id: "company-microsoft",
      name: "Microsoft",
      description: "Enterprise software leader",
      interviewStyle:
        "Mix of technical and behavioral. Problem-solving and collaboration emphasized.",
      commonTopics: [
        "Coding",
        "Design",
        "Collaboration",
        "Growth Mindset",
        "Azure",
      ],
    },
    {
      id: "company-meta",
      name: "Meta",
      description: "Social media & VR company",
      interviewStyle:
        "Fast-paced technical. Product sense and impact metrics heavily weighted.",
      commonTopics: [
        "Coding",
        "System Design",
        "Product Sense",
        "Impact",
        "Cross-functional",
      ],
    },
    {
      id: "company-stripe",
      name: "Stripe",
      description: "Payments infrastructure",
      interviewStyle:
        "High bar for communication and technical depth. Writing skills valued.",
      commonTopics: [
        "APIs",
        "Distributed Systems",
        "Craft",
        "Customer Focus",
        "Payments Domain",
      ],
    },
  ];

  for (const company of companies) {
    await prisma.companyProfile.upsert({
      where: { name: company.name },
      create: company,
      update: {},
    });
  }

  console.log("Seed completed successfully.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
