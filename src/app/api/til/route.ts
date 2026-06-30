import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serializeTil, type TilPayload } from "@/lib/til";

export async function GET() {
  try {
    const entries = await prisma.tilEntry.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json(entries.map(serializeTil));
  } catch {
    return NextResponse.json({ error: "Failed to fetch TIL entries" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as TilPayload;
    if (!body.date || !body.title?.trim() || !body.description?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const entry = await prisma.tilEntry.create({
      data: {
        date: new Date(body.date),
        title: body.title.trim(),
        description: body.description.trim(),
        codeSnippet: body.codeSnippet?.trim() || null,
      },
    });

    return NextResponse.json(serializeTil(entry), { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create TIL entry" }, { status: 500 });
  }
}