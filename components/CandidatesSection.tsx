import { getIcon } from "@/lib/icons";
import type { SiteContent } from "@/lib/content-types";
import SectionHeading from "./SectionHeading";

export default function CandidatesSection({
  content,
}: {
  content: SiteContent["candidates"];
}) {
  return (
    <section id="kimler-icin" className="section-y bg-offwhite">
      <div className="container-page">
        <SectionHeading
          label={content.label}
          title={content.title}
          intro={content.intro}
        />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {content.cards.map((card, index) => {
            const Icon = getIcon(card.icon);

            return (
              <li
                key={`${card.title}-${index}`}
                data-reveal
                style={
                  {
                    "--reveal-delay": `${(index % 3) * 70}ms`,
                  } as React.CSSProperties
                }
                className="card-surface group p-7 hover:border-green-800/30 hover:shadow-[0_18px_50px_rgba(10,81,53,0.08)] md:p-8"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-green-050 text-green-800 transition-colors group-hover:bg-green-100">
                  <Icon size={19} aria-hidden="true" />
                </span>
                <h3 className="h3-display mt-6 text-[1.125rem]">{card.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
                  {card.text}
                </p>
              </li>
            );
          })}
        </ul>

        {content.footnote ? (
          <p
            data-reveal
            className="mt-10 border-t border-line pt-6 text-sm text-muted"
          >
            {content.footnote}
          </p>
        ) : null}
      </div>
    </section>
  );
}
