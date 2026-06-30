import { notFound } from "next/navigation";
import { PortfolioShell } from "@/components/portfolio/PortfolioShell";
import { isValidRouteSlug, slugToView, ROUTE_SLUGS } from "@/types/sections";

type PageProps = {
  params: Promise<{ section: string }>;
};

export function generateStaticParams() {
  return ROUTE_SLUGS.map((section) => ({ section }));
}

export default async function SectionPage({ params }: PageProps) {
  const { section } = await params;

  if (!isValidRouteSlug(section)) {
    notFound();
  }

  return <PortfolioShell initialView={slugToView(section)} />;
}