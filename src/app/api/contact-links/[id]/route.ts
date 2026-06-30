import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-utils";
import { serializeContactLink, type ContactLinkPayload } from "@/lib/content";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: RouteContext) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await context.params;

  try {
    const body = (await request.json()) as ContactLinkPayload;
    if (!body.label?.trim() || !body.href?.trim() || !body.text?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const item = await prisma.contactLink.update({
      where: { id },
      data: {
        label: body.label.trim(),
        href: body.href.trim(),
        text: body.text.trim(),
        sortOrder: body.sortOrder,
      },
    });

    return NextResponse.json(serializeContactLink(item));
  } catch {
    return NextResponse.json({ error: "Failed to update contact link" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await context.params;

  try {
    await prisma.contactLink.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete contact link" }, { status: 500 });
  }
}