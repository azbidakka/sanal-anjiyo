import { Clock, MapPin, Phone } from "lucide-react";
import type { SiteContent } from "@/lib/content-types";
import ContactForm from "./ContactForm";
import SectionHeading from "./SectionHeading";

type Props = {
  content: SiteContent["contactSection"];
  phoneDisplay: string;
  phoneHref: string;
  address: string;
};

export default function ContactSection({
  content,
  phoneDisplay,
  phoneHref,
  address,
}: Props) {
  return (
    <section id="iletisim" className="section-y bg-green-050">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <SectionHeading
              label={content.label}
              title={content.title}
              intro={content.intro}
            />

            <ul
              data-reveal
              style={{ "--reveal-delay": "160ms" } as React.CSSProperties}
              className="mt-10 space-y-5"
            >
              <li className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-green-800 ring-1 ring-line">
                  <Phone size={18} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted">
                    Telefon
                  </p>
                  <a
                    href={phoneHref}
                    data-cta="contact-phone"
                    className="text-[1.0625rem] font-medium text-ink transition-colors hover:text-green-800"
                  >
                    {phoneDisplay}
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-green-800 ring-1 ring-line">
                  <MapPin size={18} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted">
                    Adres
                  </p>
                  <p className="text-[1.0625rem] text-ink">{address}</p>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-green-800 ring-1 ring-line">
                  <Clock size={18} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted">
                    {content.appointmentLabel}
                  </p>
                  <p className="text-[1.0625rem] text-ink">
                    {content.appointmentText}
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div
            data-reveal
            style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
          >
            <ContactForm
              kvkkLabel={content.kvkkLabel}
              formNote={content.formNote}
              submitLabel={content.submitLabel}
              successTitle={content.successTitle}
              successText={content.successText}
              phoneDisplay={phoneDisplay}
              phoneHref={phoneHref}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
