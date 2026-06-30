"use client";

import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TilDescription } from "@/components/til/TilDescription";
import { formatTilDate } from "@/lib/til";

type TilItem = {
  id: string;
  date: string;
  title: string;
  description: string;
  codeSnippet: string | null;
};

export default function Til() {
  const [entries, setEntries] = useState<TilItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/til")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((data: TilItem[]) => setEntries(data))
      .catch(() => setError("Unable to load TIL entries."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="til" className="py-16 md:py-20 px-4 border-b-2 border-black section-reveal">
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader number="06." title="Today I Learned" />
        <div className="border-2 border-black divide-y-2 divide-black">
          {loading && (
            <div className="p-6 text-center font-mono text-xs uppercase text-ink-faded">Loading entries...</div>
          )}
          {error && (
            <div className="p-6 text-center font-mono text-xs uppercase text-red-800 border-2 border-red-800 bg-red-50">
              {error}
            </div>
          )}
          {!loading && !error && entries.length === 0 && (
            <div className="p-6 text-center font-mono text-xs uppercase text-ink-faded">No TIL entries yet.</div>
          )}
          {!loading &&
            !error &&
            entries.map((entry) => (
              <div
                key={entry.id}
                className="grid md:grid-cols-[100px_1fr] p-4 bg-newsprint hover:bg-newsprint-accent transition-colors duration-150"
              >
                <time className="font-mono text-[10px] uppercase text-ink-faded" dateTime={entry.date}>
                  {formatTilDate(entry.date)}
                </time>
                <p className="text-sm">
                  <TilDescription
                    title={entry.title}
                    description={entry.description}
                    codeSnippet={entry.codeSnippet}
                  />
                </p>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}