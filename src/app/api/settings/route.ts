import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-utils";
import { serializeSettings, type SiteSettingsPayload } from "@/lib/content";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
    if (!settings) {
      return NextResponse.json({ error: "Settings not found" }, { status: 404 });
    }
    return NextResponse.json(serializeSettings(settings));
  } catch {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = (await request.json()) as SiteSettingsPayload;
    const settings = await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: {
        heroEyebrow: body.heroEyebrow?.trim(),
        heroHeadlines: body.heroHeadlines ?? [],
        heroName: body.heroName?.trim(),
        heroTagline: body.heroTagline?.trim(),
        statYears: body.statYears?.trim(),
        statYearsLabel: body.statYearsLabel?.trim(),
        statProjects: body.statProjects?.trim(),
        statProjectsLabel: body.statProjectsLabel?.trim(),
        statShipped: body.statShipped?.trim(),
        statShippedLabel: body.statShippedLabel?.trim(),
        aboutParagraph1: body.aboutParagraph1?.trim(),
        aboutParagraph2: body.aboutParagraph2?.trim(),
        aboutParagraph3: body.aboutParagraph3?.trim(),
        aboutSignature: body.aboutSignature?.trim(),
        profileImageUrl: body.profileImageUrl?.trim(),
        profileCaption: body.profileCaption?.trim(),
        contactHeadlines: body.contactHeadlines ?? [],
        contactIntro: body.contactIntro?.trim(),
        contactWhoami: body.contactWhoami?.trim(),
        contactStatus: body.contactStatus?.trim(),
        contactLocation: body.contactLocation?.trim(),
        contactEmail: body.contactEmail?.trim(),
        cvUrl: body.cvUrl?.trim(),
        githubUrl: body.githubUrl?.trim(),
        projectsGithubUrl: body.projectsGithubUrl?.trim(),
        footerCopyright: body.footerCopyright?.trim(),
      },
      create: {
        id: "singleton",
        heroEyebrow: body.heroEyebrow?.trim() ?? "",
        heroHeadlines: body.heroHeadlines ?? [],
        heroName: body.heroName?.trim() ?? "",
        heroTagline: body.heroTagline?.trim() ?? "",
        statYears: body.statYears?.trim() ?? "",
        statYearsLabel: body.statYearsLabel?.trim() ?? "",
        statProjects: body.statProjects?.trim() ?? "",
        statProjectsLabel: body.statProjectsLabel?.trim() ?? "",
        statShipped: body.statShipped?.trim() ?? "",
        statShippedLabel: body.statShippedLabel?.trim() ?? "",
        aboutParagraph1: body.aboutParagraph1?.trim() ?? "",
        aboutParagraph2: body.aboutParagraph2?.trim() ?? "",
        aboutParagraph3: body.aboutParagraph3?.trim() ?? "",
        aboutSignature: body.aboutSignature?.trim() ?? "",
        profileImageUrl: body.profileImageUrl?.trim() ?? "/asdar.jpg",
        profileCaption: body.profileCaption?.trim() ?? "",
        contactHeadlines: body.contactHeadlines ?? [],
        contactIntro: body.contactIntro?.trim() ?? "",
        contactWhoami: body.contactWhoami?.trim() ?? "",
        contactStatus: body.contactStatus?.trim() ?? "",
        contactLocation: body.contactLocation?.trim() ?? "",
        contactEmail: body.contactEmail?.trim() ?? "",
        cvUrl: body.cvUrl?.trim() ?? "/CV_Asdarium.pdf",
        githubUrl: body.githubUrl?.trim() ?? "",
        projectsGithubUrl: body.projectsGithubUrl?.trim() ?? "",
        footerCopyright: body.footerCopyright?.trim() ?? "",
      },
    });

    return NextResponse.json(serializeSettings(settings));
  } catch {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}