import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-utils";
import { serializeExperience, type ExperiencePayload } from "@/lib/content";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.experience.findMany({ orderBy: { sortOrder: "asc" } });
    return NextResponse.json(items.map(serializeExperience));
  } catch {
    return NextResponse.json({ error: "Failed to fetch experience" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = (await request.json()) as ExperiencePayload;
    if (
      !body.period?.trim() ||
      !body.title?.trim() ||
      !body.company?.trim() ||
      !body.type?.trim() ||
      !body.description?.trim()
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const count = await prisma.experience.count();
    const item = await prisma.experience.create({
      data: {
        period: body.period.trim(),
        title: body.title.trim(),
        company: body.company.trim(),
        type: body.type.trim(),
        description: body.description.trim(),
        tags: body.tags ?? [],
        sortOrder: body.sortOrder ?? count,
      },
    });

    return NextResponse.json(serializeExperience(item), { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 });
  }
}