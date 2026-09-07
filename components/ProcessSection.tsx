import Image from "next/image";
import type { SiteContent } from "@/lib/content-types";
import SectionHeading from "./SectionHeading";

export default function ProcessSection({
  content,
}: {
  content: SiteContent["process"];
}) {
  return (
    <section id="surec" className="section-y bg-white">
      <div className="container-page">
        <SectionHeading label={content.label} title={content.title} />

        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16">
          <div
            data-reveal
            className="group overflow-hidden rounded-[28px] border border-line lg:sticky lg:top-28"
          >
            <Image
              src={content.image}
              alt={content.imageAlt}
              width={1600}
              height={1200}
              sizes="(max-width: 1024px) 92vw, 42vw"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
          </div>

          <ol className="relative">
            {content.steps.map((step, index) => (
              <li
                key={`${step.title}-${index}`}
                data-reveal
                style={
                  { "--reveal-delay": `${index * 80}ms` } as React.CSSProperties
                }
                className="relative border-b border-line py-8 pl-16 first:pt-0 last:border-b-0 last:pb-0"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-8 flex h-11 w-11 items-center justify-center rounded-full border border-green-100 bg-green-050 text-sm font-medium text-green-800"
                  style={index === 0 ? { top: 0 } : undefined}
                >
                  {step.number}
                </span>
                <h3 className="h3-display text-[1.25rem]">{step.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
