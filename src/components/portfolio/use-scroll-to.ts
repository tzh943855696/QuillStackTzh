"use client";

import { useLenis } from "lenis/react";

export type SectionId = "home" | "services" | "works" | "about" | "contact";

export function useScrollTo() {
  const lenis = useLenis();

  return (sectionId: SectionId | string) => {
    const target = sectionId === "home" ? 0 : `#${sectionId}`;
    if (lenis) {
      lenis.scrollTo(target as string | number, { duration: 1.2 });
    } else {
      if (sectionId === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };
}
