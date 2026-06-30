import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-utils";
import { serializeSkill, type SkillPayload } from "@/lib/content";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.skillGroup.findMany({ orderBy: { sortOrder: "asc" } });
    return NextResponse.json(items.map(serializeSkill));
  } catch {
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = (await request.json()) as SkillPayload;
    if (!body.label?.trim() || !body.value?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const count = await prisma.skillGroup.count();
    const item = await prisma.skillGroup.create({
      data: {
        label: body.label.trim(),
        value: body.value.trim(),
        sortOrder: body.sortOrder ?? count,
      },
    });

    return NextResponse.json(serializeSkill(item), { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
  }
}