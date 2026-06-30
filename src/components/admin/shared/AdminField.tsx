"use client";

import type { ReactNode } from "react";

type AdminFieldProps = {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
};

export function AdminField({ label, htmlFor, hint, children }: AdminFieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="font-sans text-xs uppercase tracking-widest block mb-2">
        {label}
      </label>
      {children}
      {hint && <p className="font-mono text-[10px] text-ink-faded mt-1">{hint}</p>}
    </div>
  );
}

export const adminInputClass =
  "input-vintage w-full border-4 border-black bg-newsprint-accent px-4 py-3 font-mono text-sm";

export const adminTextareaClass =
  "input-vintage w-full border-4 border-black bg-newsprint-accent px-4 py-3 font-serif text-sm resize-y";

export const adminButtonPrimaryClass =
  "btn-vintage font-sans text-xs uppercase tracking-widest border-4 border-black bg-black text-newsprint px-6 py-3 shadow-hard";

export const adminButtonSecondaryClass =
  "btn-vintage font-sans text-xs uppercase tracking-widest border-4 border-black bg-newsprint-accent px-6 py-3 shadow-hard";