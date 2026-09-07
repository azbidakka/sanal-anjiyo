"use client";

import { useEffect } from "react";
import { captureUtmParams } from "@/lib/contact";

/**
 * Sayfadaki [data-reveal] öğelerini tek bir IntersectionObserver ile
 * görünür hale getirir ve URL'deki UTM parametrelerini oturuma alır.
 */
export default function ScrollReveal() {
  useEffect(() => {
    captureUtmParams();

    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return null;
}
