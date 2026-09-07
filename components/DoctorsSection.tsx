import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { SiteContent } from "@/lib/content-types";
import SectionHeading from "./SectionHeading";

export default function DoctorsSection({
  content,
}: {
  content: SiteContent["doctors"];
}) {
  if (content.list.length === 0) return null;

  return (
    <section className="section-y bg-offwhite">
      <div className="container-page">
        <SectionHeading
          label={content.label}
          title={content.title}
          intro={content.intro}
        />

        <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:mt-16 lg:gap-8">
          {content.list.map((doctor, index) => (
            <li
              key={doctor.id}
              data-reveal
              style={
                { "--reveal-delay": `${index * 90}ms` } as React.CSSProperties
              }
              className="group overflow-hidden rounded-[26px] border border-line bg-white transition-[border-color,box-shadow] duration-300 hover:border-green-800/25 hover:shadow-[0_18px_50px_rgba(10,81,53,0.08)]"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-green-050">
                <Image
                  src={doctor.image}
                  alt={`${doctor.title} ${doctor.name} — ${doctor.specialty} Uzmanı`}
                  fill
                  sizes="(max-width: 768px) 92vw, 46vw"
                  style={{ objectPosition: "50% 18%" }}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
              </div>

              <div className="p-7 md:p-8">
                <p className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-green-800">
                  {doctor.specialty}
                </p>
                <h3 className="h3-display mt-3 text-[1.375rem]">
                  {doctor.title} {doctor.name}
                </h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
                  {doctor.description}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {doctor.profileUrl ? (
                    <>
                      <a
                        href={doctor.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cta="doctor-profile"
                        className="inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-green-800 transition-colors hover:text-green-900"
                      >
                        {content.profileLabel}
                        <ArrowUpRight
                          size={16}
                          aria-hidden="true"
                          className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </a>
                      <span aria-hidden="true" className="text-line">
                        ·
                      </span>
                    </>
                  ) : null}
                  <a
                    href="#iletisim"
                    data-cta="doctor-info"
                    className="text-[0.9375rem] text-muted transition-colors hover:text-green-800"
                  >
                    {content.infoLabel}
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
