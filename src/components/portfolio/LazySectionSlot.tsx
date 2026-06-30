"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { SectionSkeleton } from "@/components/ui/SectionSkeleton";
import type { LazySectionId } from "@/types/sections";

const SECTION_COMPONENTS: Record<LazySectionId, ReturnType<typeof dynamic>> = {
  achievements: dynamic(() => import("@/components/sections/Achievements"), {
    loading: () => <SectionSkeleton />,
  }),
  experience: dynamic(() => import("@/components/sections/Experience"), {
    loading: () => <SectionSkeleton />,
  }),
  projects: dynamic(() => import("@/components/sections/Projects"), {
    loading: () => <SectionSkeleton />,
  }),
  til: dynamic(() => import("@/components/sections/Til"), {
    loading: () => <SectionSkeleton />,
  }),
  contact: dynamic(() => import("@/components/sections/Contact"), {
    loading: () => <SectionSkeleton />,
  }),
};

type LazySectionSlotProps = {
  id: LazySectionId;
};

export function LazySectionSlot({ id }: LazySectionSlotProps) {
  const Component = SECTION_COMPONENTS[id];

  return (
    <Suspense fallback={<SectionSkeleton />}>
      <Component />
    </Suspense>
  );
}