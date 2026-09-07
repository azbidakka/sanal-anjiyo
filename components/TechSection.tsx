import Image from "next/image";
import type { SiteContent } from "@/lib/content-types";
import AccentText from "./AccentText";

export default function TechSection({
  content,
}: {
  content: SiteContent["tech"];
}) {
  return (
    <section className="relative overflow-hidden bg-green-900">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="container-page section-y relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div>
            <p
              data-reveal
              className="mb-5 flex items-center gap-3 text-[0.75rem] font-medium uppercase tracking-[0.18em] text-white/70"
            >
              <span
                aria-hidden="true"
                className="inline-block h-px w-8 bg-white/40"
              />
              {content.label}
            </p>

            <h2
              data-reveal
              style={{ "--reveal-delay": "60ms" } as React.CSSProperties}
              className="h2-display text-white"
            >
              <AccentText text={content.title} tone="dark" />
            </h2>

            <p
              data-reveal
              style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
              className="lead mt-7 max-w-[58ch] text-white/80"
            >
              {content.text}
            </p>

            {content.stats.length > 0 ? (
              <ul
                data-reveal
                style={{ "--reveal-delay": "180ms" } as React.CSSProperties}
                className="mt-10 grid gap-4 sm:grid-cols-3"
              >
                {content.stats.map((item, index) => (
                  <li
                    key={`${item.key}-${index}`}
                    className="rounded-2xl border border-white/12 bg-white/[0.04] p-5"
                  >
                    <p className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-white/55">
                      {item.key}
                    </p>
                    <p className="mt-2 text-[0.9375rem] text-white">
                      {item.value}
                    </p>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div
            data-reveal
            style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
            className="relative mx-auto w-full max-w-[500px]"
          >
            <div className="rounded-[28px] border border-white/12 bg-white p-6 md:p-9">
              <Image
                src={content.image}
                alt={content.imageAlt}
                width={920}
                height={1106}
                sizes="(max-width: 1024px) 88vw, 460px"
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
