import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const [achievements, experiences, skills, projects, til, links] = await Promise.all([
      prisma.achievement.count(),
      prisma.experience.count(),
      prisma.skillGroup.count(),
      prisma.project.count(),
      prisma.tilEntry.count(),
      prisma.contactLink.count(),
    ]);

    return NextResponse.json({
      achievements,
      experiences,
      skills,
      projects,
      til,
      links,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}