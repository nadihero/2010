"use client";

import { useEffect } from "react";
import { usePortfolioSettings } from "@/contexts/PortfolioSettingsContext";

type CvModalProps = {
  open: boolean;
  onClose: () => void;
};

export function CvModal({ open, onClose }: CvModalProps) {
  const { settings } = usePortfolioSettings();
  const cvUrl = settings?.cvUrl ?? "/CV_Asdarium.pdf";
  const name = settings?.heroName ?? "Asdarium D.";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay open fixed inset-0 z-50 bg-black/80 flex items-start justify-center pt-8 md:pt-12 px-4 pb-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cv-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content bg-newsprint border-4 border-black shadow-hard-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center border-b-4 border-black px-6 py-4">
          <h2 id="cv-modal-title" className="font-serif text-xl font-black uppercase">
            Curriculum Vitae
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="font-sans text-2xl leading-none border-2 border-black w-10 h-10 flex items-center justify-center bg-newsprint-accent hover:bg-black hover:text-newsprint transition-colors duration-150"
            aria-label="Close CV modal"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-hidden p-4 md:p-6">
          <iframe
            src={cvUrl}
            title={`${name} Curriculum Vitae`}
            className="w-full h-[60vh] md:h-[70vh] border-4 border-black"
          />
        </div>
        <div className="border-t-2 border-black px-6 py-3 flex justify-between items-center">
          <p className="font-mono text-[10px] uppercase text-ink-faded">{name} — Full-Stack Web Developer</p>
          <a
            href={cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-xs uppercase tracking-widest hover:underline"
          >
            Open in New Tab ↗
          </a>
        </div>
      </div>
    </div>
  );
}