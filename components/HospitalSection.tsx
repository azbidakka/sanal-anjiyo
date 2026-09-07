import Image from "next/image";
import { getIcon } from "@/lib/icons";
import type { SiteContent } from "@/lib/content-types";
import SectionHeading from "./SectionHeading";

export default function HospitalSection({
  content,
}: {
  content: SiteContent["hospital"];
}) {
  return (
    <section className="section-y bg-white">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
          <div
            data-reveal
            className="group order-2 overflow-hidden rounded-[28px] border border-line lg:order-1"
          >
            <Image
              src={content.image}
              alt={content.imageAlt}
              width={1439}
              height={801}
              sizes="(max-width: 1024px) 92vw, 46vw"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
          </div>

          <div className="order-1 lg:order-2">
            <SectionHeading
              label={content.label}
              title={content.title}
              intro={content.intro}
            />
          </div>
        </div>

        <ul className="mt-14 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {content.items.map((item, index) => {
            const Icon = getIcon(item.icon);

            return (
              <li
                key={`${item.title}-${index}`}
                data-reveal
                style={
                  { "--reveal-delay": `${index * 70}ms` } as React.CSSProperties
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
      </div>
    </section>
  );
}
