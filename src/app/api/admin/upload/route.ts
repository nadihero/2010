import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-utils";
import { serializeSettings } from "@/lib/content";
import { prisma } from "@/lib/prisma";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

const PROFILE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const CV_TYPE = "application/pdf";

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const uploadType = formData.get("type");

    if (!(file instanceof File) || (uploadType !== "profile" && uploadType !== "cv")) {
      return NextResponse.json({ error: "Invalid upload payload" }, { status: 400 });
    }

    if (uploadType === "profile" && !PROFILE_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Profile image must be JPEG, PNG, or WebP" }, { status: 400 });
    }

    if (uploadType === "cv" && file.type !== CV_TYPE) {
      return NextResponse.json({ error: "CV must be a PDF file" }, { status: 400 });
    }

    await mkdir(UPLOAD_DIR, { recursive: true });

    const ext =
      uploadType === "profile"
        ? file.type === "image/png"
          ? "png"
          : file.type === "image/webp"
            ? "webp"
            : "jpg"
        : "pdf";

    const filename = uploadType === "profile" ? `profile.${ext}` : "cv.pdf";
    const publicPath = `/uploads/${filename}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    await writeFile(path.join(UPLOAD_DIR, filename), buffer);

    const settings = await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: uploadType === "profile" ? { profileImageUrl: publicPath } : { cvUrl: publicPath },
      create: {
        id: "singleton",
        heroEyebrow: "",
        heroHeadlines: [],
        heroName: "",
        heroTagline: "",
        aboutParagraph1: "",
        aboutParagraph2: "",
        aboutParagraph3: "",
        aboutSignature: "",
        contactHeadlines: [],
        contactIntro: "",
        contactWhoami: "",
        contactStatus: "",
        contactLocation: "",
        contactEmail: "",
        ...(uploadType === "profile" ? { profileImageUrl: publicPath } : { cvUrl: publicPath }),
      },
    });

    return NextResponse.json({
      url: publicPath,
      settings: serializeSettings(settings),
    });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}