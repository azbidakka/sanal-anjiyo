"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import type { NavLink } from "@/lib/content-types";

type Props = {
  hospitalName: string;
  nav: NavLink[];
  ctaLabel: string;
  phoneDisplay: string;
  phoneHref: string;
};

export default function Header({
  hospitalName,
  nav,
  ctaLabel,
  phoneDisplay,
  phoneHref,
}: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const height =
        document.documentElement.scrollHeight - window.innerHeight;

      setScrolled(scrollTop > 12);
      setProgress(height > 0 ? Math.min(scrollTop / height, 1) : 0);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || menuOpen
          ? "border-b border-line bg-white/92 backdrop-blur-md"
          : "border-b border-transparent bg-white/70 backdrop-blur-sm",
      ].join(" ")}
    >
      <div className="container-page flex h-[76px] items-center justify-between gap-6">
        <a
          href="#top"
          className="flex shrink-0 items-center"
          aria-label={`${hospitalName} — Sanal Anjiyo ana sayfa`}
          onClick={closeMenu}
        >
          <Image
            src={siteConfig.logo}
            alt={hospitalName}
            width={2324}
            height={380}
            priority
            className="h-[26px] w-auto md:h-[30px]"
          />
        </a>

        <nav aria-label="Ana menü" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {nav.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="relative text-[0.9375rem] text-text transition-colors hover:text-green-800"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={phoneHref}
            data-cta="header-phone"
            className="hidden items-center gap-2 text-[0.9375rem] font-medium text-green-900 transition-colors hover:text-green-700 md:inline-flex"
          >
            <Phone size={17} aria-hidden="true" />
            {phoneDisplay}
          </a>

          <a
            href="#iletisim"
            data-cta="header-info"
            onClick={closeMenu}
            className="btn-primary hidden !h-11 !px-6 !text-sm lg:inline-flex"
          >
            {ctaLabel}
          </a>

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-green-800 hover:text-green-800 lg:hidden"
          >
            {menuOpen ? (
              <X size={20} aria-hidden="true" />
            ) : (
              <Menu size={20} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Scroll progress */}
      <div
        aria-hidden="true"
        className="h-[2px] w-full origin-left bg-green-800 transition-[transform] duration-150 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />

      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="border-t border-line bg-white lg:hidden"
      >
        <nav aria-label="Mobil menü" className="container-page py-6">
          <ul className="flex flex-col">
            {nav.map((link) => (
              <li key={link.href} className="border-b border-line/70 last:border-0">
                <a
                  href={link.href}
                  onClick={closeMenu}
                  className="block py-4 text-lg text-ink transition-colors hover:text-green-800"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-3">
            <a
              href="#iletisim"
              data-cta="mobile-menu-info"
              onClick={closeMenu}
              className="btn-primary w-full"
            >
              {ctaLabel}
            </a>
            <a
              href={phoneHref}
              data-cta="mobile-menu-phone"
              className="btn-secondary w-full"
            >
              <Phone size={17} aria-hidden="true" />
              {phoneDisplay}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
