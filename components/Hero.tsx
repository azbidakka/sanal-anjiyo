import Image from "next/image";
import { Phone } from "lucide-react";
import type { SiteContent } from "@/lib/content-types";
import AccentText from "./AccentText";

type Props = {
  hero: SiteContent["hero"];
  phoneDisplay: string;
  phoneHref: string;
};

export default function Hero({ hero, phoneDisplay, phoneHref }: Props) {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-gradient-to-b from-white via-white to-green-050"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-green-100/60 blur-3xl"
      />

      <div className="container-page relative pt-[104px] pb-16 md:pt-[132px] md:pb-24 lg:pt-[148px] lg:pb-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <p
              data-reveal
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-050 px-4 py-2 text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-green-900 md:text-xs"
            >
              {hero.label}
            </p>

            <h1
              data-reveal
              style={{ "--reveal-delay": "60ms" } as React.CSSProperties}
              className="h1-display max-w-[16ch]"
            >
              <AccentText text={hero.title} />
            </h1>

            <p
              data-reveal
              style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
              className="lead mt-7 max-w-[58ch] text-muted"
            >
              {hero.description}
            </p>

            <div
              data-reveal
              style={{ "--reveal-delay": "180ms" } as React.CSSProperties}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <a
                href="#iletisim"
                data-cta="hero-info"
                className="btn-primary w-full sm:w-auto"
              >
                {hero.ctaPrimary}
              </a>
              <a
                href={phoneHref}
                data-cta="hero-phone"
                className="btn-secondary w-full sm:w-auto"
              >
                <Phone size={17} aria-hidden="true" />
                {phoneDisplay}
              </a>
            </div>

            <p
              data-reveal
              style={{ "--reveal-delay": "240ms" } as React.CSSProperties}
              className="mt-7 flex items-center gap-2 text-sm text-muted"
            >
              <span
                aria-hidden="true"
                className="inline-block h-1.5 w-1.5 rounded-full bg-green-700"
              />
              {hero.trustLine}
            </p>
          </div>

          <div
            data-reveal
            style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
            className="relative"
          >
            <div className="overflow-hidden rounded-[28px] border border-line bg-white shadow-[0_18px_50px_rgba(10,81,53,0.08)]">
              <Image
                src={hero.image}
                alt={hero.imageAlt}
                width={1266}
                height={1200}
                priority
                sizes="(max-width: 1024px) 92vw, 46vw"
                className="h-auto w-full"
              />
            </div>

            {hero.badgeTitle ? (
              <div className="absolute -bottom-5 left-5 hidden rounded-2xl border border-line bg-white px-5 py-4 shadow-[0_18px_50px_rgba(10,81,53,0.08)] sm:block">
                <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-green-800">
                  {hero.badgeTitle}
                </p>
                <p className="mt-1 text-sm text-muted">{hero.badgeText}</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
