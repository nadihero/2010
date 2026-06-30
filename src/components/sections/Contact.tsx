"use client";

import { useEffect, useState } from "react";
import { usePortfolioSettings } from "@/contexts/PortfolioSettingsContext";

type ContactLinkItem = {
  id: string;
  label: string;
  href: string;
  text: string;
};

export default function Contact() {
  const { settings, loading: settingsLoading } = usePortfolioSettings();
  const [links, setLinks] = useState<ContactLinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/contact-links")
      .then((res) => res.json())
      .then((data: ContactLinkItem[]) => setLinks(data))
      .finally(() => setLoading(false));
  }, []);

  async function copyEmail() {
    if (!settings?.contactEmail) return;
    try {
      await navigator.clipboard.writeText(settings.contactEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  if (settingsLoading || !settings) {
    return (
      <section id="contact" className="py-16 md:py-20 px-4 border-b-4 border-double border-black">
        <div className="max-w-[1200px] mx-auto font-mono text-xs uppercase text-ink-faded">Loading...</div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-16 md:py-20 px-4 border-b-4 border-double border-black section-reveal">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-10">
          <p className="font-mono text-xs text-ink-faded mb-1">07.</p>
          <h3 className="font-serif text-4xl md:text-5xl font-black uppercase leading-tight">
            {settings.contactHeadlines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h3>
        </div>
        <p className="font-serif text-lg text-ink-faded mb-8 max-w-2xl">{settings.contactIntro}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {!loading &&
            links.map((link) => (
              <a
                key={link.id}
                href={link.href}
                target={link.href.startsWith("mailto") ? undefined : "_blank"}
                rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                className="card-vintage border-4 border-black bg-newsprint-accent p-5 shadow-hard block group"
              >
                <p className="font-sans text-xs uppercase tracking-widest text-ink-faded mb-2">{link.label}</p>
                <p className={`font-mono text-sm group-hover:underline ${link.label === "Email" ? "break-all" : ""}`}>
                  {link.text}
                </p>
              </a>
            ))}
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <button
            type="button"
            onClick={copyEmail}
            className="btn-vintage font-sans text-xs uppercase tracking-widest border-4 border-black bg-black text-newsprint px-6 py-3 shadow-hard"
          >
            Copy Email
          </button>
          <a
            href={`mailto:${settings.contactEmail}`}
            className="btn-vintage font-sans text-xs uppercase tracking-widest border-4 border-black bg-newsprint-accent px-6 py-3 shadow-hard inline-block"
          >
            Send Message ↗
          </a>
          {copied && (
            <span className="font-mono text-xs uppercase border-2 border-black px-3 py-1 bg-newsprint-accent">
              Copied!
            </span>
          )}
        </div>
        <div className="mt-10 border-2 border-dashed border-black p-4 font-mono text-xs">
          <p>
            <span className="text-ink-faded">→ whoami</span> {settings.contactWhoami}
          </p>
          <p className="mt-1">
            <span className="text-ink-faded">→ status</span> {settings.contactStatus}
          </p>
          <p className="mt-1">
            <span className="text-ink-faded">→ location</span> {settings.contactLocation}
          </p>
        </div>
      </div>
    </section>
  );
}