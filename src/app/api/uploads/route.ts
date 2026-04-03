import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { generateUploadUrl, getS3Key } from "@/lib/storage";
import { DocumentType } from "@prisma/client";

const UploadSchema = z.object({
  filename: z.string(),
  contentType: z.string(),
  type: z.enum(["RESUME", "JD"]),
  sessionId: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = UploadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const s3Key = getS3Key(
    session.user.id,
    parsed.data.filename,
    parsed.data.type.toLowerCase()
  );
  const uploadUrl = await generateUploadUrl(s3Key, parsed.data.contentType);
  const s3Url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

  const document = await prisma.uploadedDocument.create({
    data: {
      userId: session.user.id,
      sessionId: parsed.data.sessionId,
      type: parsed.data.type as DocumentType,
      filename: parsed.data.filename,
      s3Key,
      s3Url,
    },
  });

  return NextResponse.json({ uploadUrl, document });
}
