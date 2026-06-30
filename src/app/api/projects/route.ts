import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-utils";
import { serializeProject, type ProjectPayload } from "@/lib/content";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.project.findMany({ orderBy: { sortOrder: "asc" } });
    return NextResponse.json(items.map(serializeProject));
  } catch {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

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

    const count = await prisma.project.count();
    const item = await prisma.project.create({
      data: {
        num: body.num.trim(),
        category: body.category.trim(),
        title: body.title.trim(),
        description: body.description.trim(),
        tags: body.tags ?? [],
        repoUrl: body.repoUrl?.trim() || null,
        sortOrder: body.sortOrder ?? count,
      },
    });

    return NextResponse.json(serializeProject(item), { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}