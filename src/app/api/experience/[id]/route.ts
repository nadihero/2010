import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-utils";
import { serializeExperience, type ExperiencePayload } from "@/lib/content";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: RouteContext) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await context.params;

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

    const item = await prisma.experience.update({
      where: { id },
      data: {
        period: body.period.trim(),
        title: body.title.trim(),
        company: body.company.trim(),
        type: body.type.trim(),
        description: body.description.trim(),
        tags: body.tags ?? [],
        sortOrder: body.sortOrder,
      },
    });

    return NextResponse.json(serializeExperience(item));
  } catch {
    return NextResponse.json({ error: "Failed to update experience" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await context.params;

  try {
    await prisma.experience.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 });
  }
}