"use client";

import Image from "next/image";
import { usePortfolioSettings } from "@/contexts/PortfolioSettingsContext";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function About() {
  const { settings, loading } = usePortfolioSettings();

  if (loading || !settings) {
    return (
      <section id="about" className="py-16 md:py-20 px-4 border-b-2 border-black">
        <div className="max-w-[1200px] mx-auto font-mono text-xs uppercase text-ink-faded">Loading...</div>
      </section>
    );
  }

  return (
    <section id="about" className="py-16 md:py-20 px-4 border-b-2 border-black section-reveal">
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader number="01." title="About the Developer" />
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="border-4 border-black p-2 shadow-hard bg-newsprint-accent">
            <Image
              src={settings.profileImageUrl}
              alt={`${settings.heroName} — Full-Stack Web Developer`}
              width={400}
              height={533}
              className="img-grayscale w-full aspect-[3/4] object-cover border-2 border-black"
              priority
              unoptimized={settings.profileImageUrl.startsWith("/uploads/")}
            />
            <p className="font-mono text-[10px] uppercase text-center mt-2 text-ink-faded">{settings.profileCaption}</p>
          </div>
          <div className="bio-text">
            <p className="drop-cap text-base md:text-lg">{settings.aboutParagraph1}</p>
            <p className="text-base md:text-lg mt-4">{settings.aboutParagraph2}</p>
            <p className="text-base md:text-lg mt-4">{settings.aboutParagraph3}</p>
            <p className="font-serif italic text-lg mt-8 border-t-2 border-dashed border-black pt-4">
              {settings.aboutSignature}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}