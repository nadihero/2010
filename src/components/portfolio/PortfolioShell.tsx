"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { About } from "@/components/sections/About";
import { Hero } from "@/components/sections/Hero";
import { CvModal } from "@/components/portfolio/CvModal";
import { Footer } from "@/components/portfolio/Footer";
import { LazySectionSlot } from "@/components/portfolio/LazySectionSlot";
import { Navbar } from "@/components/portfolio/Navbar";
import { PortfolioSettingsProvider } from "@/contexts/PortfolioSettingsContext";
import {
  isLazyView,
  isValidRouteSlug,
  type ActiveView,
} from "@/types/sections";

type PortfolioShellProps = {
  initialView: ActiveView;
};

export function PortfolioShell({ initialView }: PortfolioShellProps) {
  const router = useRouter();
  const [cvOpen, setCvOpen] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    if (hash === "hero") {
      router.replace("/");
      return;
    }
    if (isValidRouteSlug(hash)) {
      router.replace(`/${hash}`);
    }
  }, [router]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [initialView]);

  return (
    <PortfolioSettingsProvider>
      <Navbar />
      <main>
        {initialView === "home" && (
          <>
            <Hero
              onShowCv={() => setCvOpen(true)}
              onViewProjects={() => router.push("/projects")}
            />
            <About />
          </>
        )}

        {initialView === "about" && <About />}

        {isLazyView(initialView) && (
          <LazySectionSlot key={initialView} id={initialView} />
        )}
      </main>
      <Footer />
      <CvModal open={cvOpen} onClose={() => setCvOpen(false)} />
    </PortfolioSettingsProvider>
  );
}