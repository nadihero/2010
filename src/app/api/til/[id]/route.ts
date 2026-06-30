import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serializeTil, type TilPayload } from "@/lib/til";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const body = (await request.json()) as TilPayload;
    if (!body.date || !body.title?.trim() || !body.description?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const entry = await prisma.tilEntry.update({
      where: { id },
      data: {
        date: new Date(body.date),
        title: body.title.trim(),
        description: body.description.trim(),
        codeSnippet: body.codeSnippet?.trim() || null,
      },
    });

    return NextResponse.json(serializeTil(entry));
  } catch {
    return NextResponse.json({ error: "Failed to update TIL entry" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    await prisma.tilEntry.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete TIL entry" }, { status: 500 });
  }
}