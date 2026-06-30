import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-utils";
import { serializeProject, type ProjectPayload } from "@/lib/content";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: RouteContext) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await context.params;

  try {
    const body = (await request.json()) as ProjectPayload;
    if (
      !body.num?.trim() ||
      !body.category?.trim() ||
      !body.title?.trim() ||
      !body.description?.trim()
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const item = await prisma.project.update({
      where: { id },
      data: {
        num: body.num.trim(),
        category: body.category.trim(),
        title: body.title.trim(),
        description: body.description.trim(),
        tags: body.tags ?? [],
        repoUrl: body.repoUrl?.trim() || null,
        sortOrder: body.sortOrder,
      },
    });

    return NextResponse.json(serializeProject(item));
  } catch {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await context.params;

  try {
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}