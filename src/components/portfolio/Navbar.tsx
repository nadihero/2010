"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_ITEMS, pathnameToSectionId, sectionIdToPath } from "@/types/sections";

export function Navbar() {
  const pathname = usePathname();
  const activeSection = pathnameToSectionId(pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <nav
      className="sticky top-0 z-40 bg-newsprint border-y-2 border-black transition-shadow duration-150"
      style={{ boxShadow: scrolled ? "0 4px 0 0 #000" : "none" }}
    >
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden font-sans text-xs uppercase tracking-widest border-2 border-black px-3 py-1 bg-newsprint-accent"
            aria-label="Toggle menu"
          >
            ☰ Menu
          </button>
          <ul
            className={`${
              menuOpen ? "max-h-[500px]" : "max-h-0"
            } md:max-h-none overflow-hidden md:overflow-visible transition-[max-height] duration-200 md:flex w-full md:w-auto flex-col md:flex-row items-center justify-center gap-1 md:gap-8 font-sans text-xs uppercase tracking-widest`}
          >
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <Link
                  href={sectionIdToPath(item.id)}
                  className={`nav-link block px-3 py-2 hover:underline w-full md:w-auto text-left md:text-center ${
                    activeSection === item.id ? "active" : ""
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}