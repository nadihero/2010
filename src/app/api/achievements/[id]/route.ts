import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-utils";
import { serializeAchievement, type AchievementPayload } from "@/lib/content";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: RouteContext) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await context.params;

  try {
    const body = (await request.json()) as AchievementPayload;
    if (!body.year?.trim() || !body.title?.trim() || !body.description?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const item = await prisma.achievement.update({
      where: { id },
      data: {
        year: body.year.trim(),
        title: body.title.trim(),
        description: body.description.trim(),
        sortOrder: body.sortOrder,
      },
    });

    return NextResponse.json(serializeAchievement(item));
  } catch {
    return NextResponse.json({ error: "Failed to update achievement" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await context.params;

  try {
    await prisma.achievement.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete achievement" }, { status: 500 });
  }
}