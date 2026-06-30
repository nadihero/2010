"use client";

import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";

type AchievementItem = {
  id: string;
  year: string;
  title: string;
  description: string;
};

export default function Achievements() {
  const [items, setItems] = useState<AchievementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/achievements")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((data: AchievementItem[]) => setItems(data))
      .catch(() => setError("Unable to load achievements."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="achievements" className="py-16 md:py-20 px-4 border-b-2 border-black bg-newsprint-accent section-reveal">
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader number="02." title="Achievements & Credentials" />
        {loading && (
          <div className="font-mono text-xs uppercase text-ink-faded text-center">Loading achievements...</div>
        )}
        {error && (
          <div className="p-6 text-center font-mono text-xs uppercase text-red-800 border-2 border-red-800 bg-red-50">
            {error}
          </div>
        )}
        {!loading && !error && items.length === 0 && (
          <div className="font-mono text-xs uppercase text-ink-faded text-center">No achievements yet.</div>
        )}
        {!loading && !error && items.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <article key={item.id} className="card-vintage border-4 border-black bg-newsprint p-6 shadow-hard">
                <span className="font-mono text-xs border-2 border-black px-2 py-0.5 inline-block mb-4">{item.year}</span>
                <h4 className="font-serif text-xl font-bold uppercase mb-2">{item.title}</h4>
                <p className="text-sm text-ink-faded text-justify">{item.description}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}