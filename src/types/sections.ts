export type LazySectionId =
  | "achievements"
  | "experience"
  | "projects"
  | "til"
  | "contact";

export type SectionId = "hero" | "about" | LazySectionId;

/** home = Front Page (Hero + About), selain itu satu section saja */
export type ActiveView = "home" | "about" | LazySectionId;

export const NAV_ITEMS: { id: SectionId; label: string; lazy?: boolean }[] = [
  { id: "hero", label: "Welcome" },
  { id: "achievements", label: "Achievements", lazy: true },
  { id: "experience", label: "Experience", lazy: true },
  { id: "projects", label: "Projects", lazy: true },
  { id: "til", label: "TIL", lazy: true },
  { id: "contact", label: "Reach Me", lazy: true },
];

export const LAZY_SECTION_ORDER: LazySectionId[] = [
  "achievements",
  "experience",
  "projects",
  "til",
  "contact",
];

export function isLazySection(id: SectionId): id is LazySectionId {
  return LAZY_SECTION_ORDER.includes(id as LazySectionId);
}

export function isLazyView(view: ActiveView): view is LazySectionId {
  return isLazySection(view as SectionId);
}

export function sectionIdToView(id: SectionId): ActiveView {
  if (id === "hero") return "home";
  return id;
}

export function viewToSectionId(view: ActiveView): SectionId {
  if (view === "home") return "hero";
  return view;
}

export const ROUTE_SLUGS = ["about", ...LAZY_SECTION_ORDER] as const;

export type RouteSlug = (typeof ROUTE_SLUGS)[number];

export function isValidRouteSlug(slug: string): slug is RouteSlug {
  return (ROUTE_SLUGS as readonly string[]).includes(slug);
}

export function slugToView(slug: RouteSlug): ActiveView {
  return slug;
}

export function sectionIdToPath(id: SectionId): string {
  if (id === "hero") return "/";
  return `/${id}`;
}

export function pathnameToSectionId(pathname: string): SectionId {
  if (pathname === "/") return "hero";
  const slug = pathname.replace(/^\//, "");
  if (isValidRouteSlug(slug)) return slug;
  return "hero";
}