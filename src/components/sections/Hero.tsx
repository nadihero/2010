"use client";

import { usePortfolioSettings } from "@/contexts/PortfolioSettingsContext";

type HeroProps = {
  onShowCv: () => void;
  onViewProjects: () => void;
};

export function Hero({ onShowCv, onViewProjects }: HeroProps) {
  const { settings, loading } = usePortfolioSettings();

  if (loading || !settings) {
    return (
      <section id="hero" className="py-16 md:py-20 px-4 border-b-4 border-double border-black">
        <div className="max-w-[1200px] mx-auto font-mono text-xs uppercase text-ink-faded">Loading...</div>
      </section>
    );
  }

  const stats = [
    { value: settings.statYears, label: settings.statYearsLabel },
    { value: settings.statProjects, label: settings.statProjectsLabel },
    { value: settings.statShipped, label: settings.statShippedLabel },
  ];

  return (
    <section id="hero" className="py-16 md:py-20 px-4 border-b-4 border-double border-black section-reveal">
      <div className="max-w-[1200px] mx-auto">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-faded mb-4">{settings.heroEyebrow}</p>
        <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tight mb-6">
          {settings.heroHeadlines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        <div className="grid md:grid-cols-2 gap-8 items-end">
          <div>
            <p className="font-serif text-2xl md:text-3xl font-bold border-l-4 border-black pl-4 mb-2">
              {settings.heroName}
            </p>
            <p className="font-serif text-lg text-ink-faded italic pl-4">{settings.heroTagline}</p>
          </div>
          <div className="flex flex-wrap gap-4 md:justify-end">
            <button
              type="button"
              onClick={onShowCv}
              className="btn-vintage font-sans text-sm uppercase tracking-widest border-4 border-black bg-newsprint-accent px-8 py-3 shadow-hard"
            >
              Show CV ↗
            </button>
            <button
              type="button"
              onClick={onViewProjects}
              className="btn-vintage font-sans text-sm uppercase tracking-widest border-4 border-black bg-black text-newsprint px-8 py-3 shadow-hard"
            >
              View Projects
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-12 border-t-2 border-black pt-8">
          {stats.map((stat, i) => (
            <div key={stat.label} className={`text-center ${i < 2 ? "border-r-2 border-black" : ""}`}>
              <p className="font-serif text-3xl md:text-4xl font-black">{stat.value}</p>
              <p className="font-mono text-[10px] uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}