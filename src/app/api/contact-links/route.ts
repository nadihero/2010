import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-utils";
import { serializeContactLink, type ContactLinkPayload } from "@/lib/content";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.contactLink.findMany({ orderBy: { sortOrder: "asc" } });
    return NextResponse.json(items.map(serializeContactLink));
  } catch {
    return NextResponse.json({ error: "Failed to fetch contact links" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = (await request.json()) as ContactLinkPayload;
    if (!body.label?.trim() || !body.href?.trim() || !body.text?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const count = await prisma.contactLink.count();
    const item = await prisma.contactLink.create({
      data: {
        label: body.label.trim(),
        href: body.href.trim(),
        text: body.text.trim(),
        sortOrder: body.sortOrder ?? count,
      },
    });

    return NextResponse.json(serializeContactLink(item), { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create contact link" }, { status: 500 });
  }
}