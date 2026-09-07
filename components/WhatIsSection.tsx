import { Info } from "lucide-react";
import { getIcon } from "@/lib/icons";
import type { SiteContent } from "@/lib/content-types";
import SectionHeading from "./SectionHeading";

export default function WhatIsSection({
  content,
}: {
  content: SiteContent["whatIs"];
}) {
  return (
    <section id="sanal-anjiyo" className="section-y bg-white">
      <div className="container-page">
        <SectionHeading label={content.label} title={content.title} />

        <div className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-2 lg:gap-16">
          <div data-reveal className="space-y-6">
            <p className="lead text-muted">{content.paragraph1}</p>
            <p className="lead text-muted">{content.paragraph2}</p>
          </div>

          {content.note ? (
            <aside
              data-reveal
              style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
              className="flex gap-4 rounded-[20px] border border-green-100 bg-green-050 p-6 md:p-8"
            >
              <Info
                size={20}
                aria-hidden="true"
                className="mt-1 shrink-0 text-green-800"
              />
              <p className="text-[0.9375rem] leading-relaxed text-text">
                {content.note}
              </p>
            </aside>
          ) : null}
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {content.cards.map((card, index) => {
            const Icon = getIcon(card.icon);

            return (
              <li
                key={`${card.title}-${index}`}
                data-reveal
                style={
                  { "--reveal-delay": `${index * 70}ms` } as React.CSSProperties
                }
                className="card-surface group p-7 hover:border-green-800/30 hover:shadow-[0_18px_50px_rgba(10,81,53,0.08)]"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-green-050 text-green-800 transition-colors group-hover:bg-green-100">
                    <Icon size={19} aria-hidden="true" />
                  </span>
                  <span className="text-xs font-medium tracking-[0.16em] text-muted/70">
                    {card.number}
                  </span>
                </div>

                <h3 className="h3-display mt-6 text-[1.125rem]">{card.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
                  {card.text}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
