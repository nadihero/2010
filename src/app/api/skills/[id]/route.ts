import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-utils";
import { serializeSkill, type SkillPayload } from "@/lib/content";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: RouteContext) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await context.params;

  try {
    const body = (await request.json()) as SkillPayload;
    if (!body.label?.trim() || !body.value?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const item = await prisma.skillGroup.update({
      where: { id },
      data: {
        label: body.label.trim(),
        value: body.value.trim(),
        sortOrder: body.sortOrder,
      },
    });

    return NextResponse.json(serializeSkill(item));
  } catch {
    return NextResponse.json({ error: "Failed to update skill" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await context.params;

  try {
    await prisma.skillGroup.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 });
  }
}