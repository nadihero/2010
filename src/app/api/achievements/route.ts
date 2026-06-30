import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-utils";
import { serializeAchievement, type AchievementPayload } from "@/lib/content";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.achievement.findMany({ orderBy: { sortOrder: "asc" } });
    return NextResponse.json(items.map(serializeAchievement));
  } catch {
    return NextResponse.json({ error: "Failed to fetch achievements" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = (await request.json()) as AchievementPayload;
    if (!body.year?.trim() || !body.title?.trim() || !body.description?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const count = await prisma.achievement.count();
    const item = await prisma.achievement.create({
      data: {
        year: body.year.trim(),
        title: body.title.trim(),
        description: body.description.trim(),
        sortOrder: body.sortOrder ?? count,
      },
    });

    return NextResponse.json(serializeAchievement(item), { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create achievement" }, { status: 500 });
  }
}