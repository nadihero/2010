import type { TilEntry } from "@prisma/client";

export type TilPayload = {
  date: string;
  title: string;
  description: string;
  codeSnippet?: string | null;
};

export function formatTilDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date + "T00:00:00") : date;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatTilDateISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function serializeTil(entry: TilEntry) {
  return {
    id: entry.id,
    date: formatTilDateISO(entry.date),
    title: entry.title,
    description: entry.description,
    codeSnippet: entry.codeSnippet,
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  };
}