import { getIcon } from "@/lib/icons";
import type { SiteContent } from "@/lib/content-types";
import SectionHeading from "./SectionHeading";

export default function PreparationSection({
  content,
}: {
  content: SiteContent["preparation"];
}) {
  return (
    <section className="section-y bg-white">
      <div className="container-page">
        <SectionHeading label={content.label} title={content.title} />

        <ul className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {content.items.map((item, index) => {
            const Icon = getIcon(item.icon);

            return (
              <li
                key={`${item.title}-${index}`}
                data-reveal
                style={
                  {
                    "--reveal-delay": `${(index % 3) * 70}ms`,
                  } as React.CSSProperties
                }
                className="border-t border-line pt-7"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-green-050 text-green-800">
                  <Icon size={19} aria-hidden="true" />
                </span>
                <h3 className="h3-display mt-5 text-[1.125rem]">{item.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
                  {item.text}
                </p>
              </li>
            );
          })}
        </ul>

        {content.note ? (
          <p
            data-reveal
            className="measure mt-12 rounded-[20px] bg-green-050 p-6 text-[0.9375rem] leading-relaxed text-text md:p-7"
          >
            {content.note}
          </p>
        ) : null}
      </div>
    </section>
  );
}
