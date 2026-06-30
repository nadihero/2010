"use client";

import { usePortfolioSettings } from "@/contexts/PortfolioSettingsContext";

export function Footer() {
  const { settings } = usePortfolioSettings();
  const copyright =
    settings?.footerCopyright ?? "© 2026 Asdarium D. — The Asdarium Gazette. All rights reserved.";

  return (
    <footer className="bg-black text-newsprint py-8 px-4">
      <div className="max-w-[1200px] mx-auto flex flex-wrap justify-between items-center gap-4">
        <p className="font-mono text-xs">{copyright}</p>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-sans text-xs uppercase tracking-widest border-2 border-newsprint px-4 py-2 hover:bg-newsprint hover:text-black transition-colors duration-150"
        >
          Back to Top ↑
        </button>
      </div>
    </footer>
  );
}