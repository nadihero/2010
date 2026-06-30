"use client";

import Image from "next/image";
import { useState } from "react";
import { adminButtonSecondaryClass } from "@/components/admin/shared/AdminField";

type ProfileUploadProps = {
  profileImageUrl: string;
  cvUrl: string;
  onUploaded: (msg: string) => void;
  onSettingsUpdate: (profileImageUrl: string, cvUrl: string) => void;
};

export function ProfileUpload({ profileImageUrl, cvUrl, onUploaded, onSettingsUpdate }: ProfileUploadProps) {
  const [uploading, setUploading] = useState<"profile" | "cv" | null>(null);

  async function handleUpload(type: "profile" | "cv", file: File | null) {
    if (!file) return;
    setUploading(type);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    setUploading(null);

    if (!res.ok) {
      onUploaded(type === "profile" ? "Profile upload failed." : "CV upload failed.");
      return;
    }

    const data = await res.json();
    onSettingsUpdate(data.settings.profileImageUrl, data.settings.cvUrl);
    onUploaded(type === "profile" ? "Profile image updated." : "CV updated.");
  }

  return (
    <div className="grid sm:grid-cols-2 gap-6 mb-8 p-5 border-2 border-black bg-newsprint-accent">
      <div>
        <p className="font-sans text-xs uppercase tracking-widest text-ink-faded mb-3">Profile Photo</p>
        <div className="border-4 border-black p-2 bg-newsprint mb-3 max-w-[200px]">
          <Image
            src={profileImageUrl}
            alt="Profile preview"
            width={200}
            height={266}
            className="img-grayscale w-full aspect-[3/4] object-cover border-2 border-black"
            unoptimized={profileImageUrl.startsWith("/uploads/")}
          />
        </div>
        <label className={`${adminButtonSecondaryClass} inline-block cursor-pointer`}>
          {uploading === "profile" ? "Uploading..." : "Upload Photo"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            disabled={uploading !== null}
            onChange={(e) => handleUpload("profile", e.target.files?.[0] ?? null)}
          />
        </label>
      </div>
      <div>
        <p className="font-sans text-xs uppercase tracking-widest text-ink-faded mb-3">Curriculum Vitae</p>
        <p className="font-mono text-xs mb-3 break-all border-2 border-black px-3 py-2 bg-newsprint">{cvUrl}</p>
        <label className={`${adminButtonSecondaryClass} inline-block cursor-pointer`}>
          {uploading === "cv" ? "Uploading..." : "Upload CV (PDF)"}
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            disabled={uploading !== null}
            onChange={(e) => handleUpload("cv", e.target.files?.[0] ?? null)}
          />
        </label>
      </div>
    </div>
  );
}