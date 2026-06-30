"use client";

import { useEffect, useState } from "react";
import {
  AdminField,
  adminButtonPrimaryClass,
  adminInputClass,
  adminTextareaClass,
} from "@/components/admin/shared/AdminField";
import type { SiteSettingsPayload } from "@/lib/content";

type SettingsFormModuleProps = {
  title: string;
  subtitle: string;
  fields: Array<{
    key: keyof SiteSettingsPayload;
    label: string;
    type: "text" | "textarea" | "lines";
    hint?: string;
    rows?: number;
  }>;
  onSaved: (msg: string) => void;
  extra?: React.ReactNode;
};

export function SettingsFormModule({ title, subtitle, fields, onSaved, extra }: SettingsFormModuleProps) {
  const [form, setForm] = useState<SiteSettingsPayload | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data: SiteSettingsPayload) => setForm(data))
      .catch(() => setForm(null));
  }, []);

  if (!form) {
    return <p className="font-mono text-xs uppercase text-ink-faded">Loading settings...</p>;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    onSaved(res.ok ? "Settings saved." : "Failed to save settings.");
  }

  function updateField(key: keyof SiteSettingsPayload, value: string) {
    setForm((prev) => {
      if (!prev) return prev;
      if (key === "heroHeadlines" || key === "contactHeadlines") {
        return { ...prev, [key]: value.split("\n").map((line) => line.trim()).filter(Boolean) };
      }
      return { ...prev, [key]: value };
    });
  }

  function fieldValue(key: keyof SiteSettingsPayload): string {
    if (!form) return "";
    const value = form[key];
    if (key === "heroHeadlines" || key === "contactHeadlines") {
      return Array.isArray(value) ? value.join("\n") : "";
    }
    return typeof value === "string" ? value : "";
  }

  return (
    <section className="border-4 border-black bg-newsprint p-6 shadow-hard">
      <p className="font-mono text-xs text-ink-faded mb-1">{subtitle}</p>
      <h2 className="font-serif text-2xl font-black uppercase border-b-4 border-double border-black pb-3 mb-6">
        {title}
      </h2>
      {extra}
      <form onSubmit={handleSubmit} className="space-y-5">
        {fields.map((field) => (
          <AdminField key={field.key} label={field.label} htmlFor={field.key} hint={field.hint}>
            {field.type === "textarea" || field.type === "lines" ? (
              <textarea
                id={field.key}
                rows={field.rows ?? 4}
                value={fieldValue(field.key)}
                onChange={(e) => updateField(field.key, e.target.value)}
                className={adminTextareaClass}
              />
            ) : (
              <input
                id={field.key}
                type="text"
                value={fieldValue(field.key)}
                onChange={(e) => updateField(field.key, e.target.value)}
                className={adminInputClass}
              />
            )}
          </AdminField>
        ))}
        <button type="submit" disabled={saving} className={adminButtonPrimaryClass}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </section>
  );
}