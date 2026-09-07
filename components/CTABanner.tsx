import Image from "next/image";
import type { SiteContent } from "@/lib/content-types";
import AccentText from "./AccentText";
import CTABannerForm from "./CTABannerForm";

type Props = {
  content: SiteContent["ctaBanner"];
  successTitle: string;
  successText: string;
  phoneDisplay: string;
  phoneHref: string;
};

export default function CTABanner({
  content,
  successTitle,
  successText,
  phoneDisplay,
  phoneHref,
}: Props) {
  return (
    <section
      aria-labelledby="cta-banner-title"
      className="bg-offwhite py-16 md:py-24"
    >
      <div className="container-page">
        <div
          data-reveal
          className="grid overflow-hidden rounded-[24px] border border-line bg-white md:rounded-[32px] lg:min-h-[500px] lg:grid-cols-[1.35fr_1fr]"
        >
          {/* Sol: görsel + metin */}
          <div className="group relative min-h-[320px] overflow-hidden lg:min-h-full">
            <Image
              src={content.image}
              alt={content.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover brightness-[0.92] transition-transform duration-700 ease-out md:group-hover:scale-[1.02]"
            />

            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(4,38,25,0.42) 0%, rgba(4,38,25,0.42) 100%), linear-gradient(90deg, rgba(4,38,25,0.9) 0%, rgba(4,38,25,0.68) 52%, rgba(4,38,25,0.24) 100%)",
              }}
            />

            <div className="relative flex h-full flex-col justify-end p-7 md:p-10 lg:justify-center lg:p-12">
              <p className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-white/75">
                {content.eyebrow}
              </p>
              <h2
                id="cta-banner-title"
                className="mt-4 max-w-[520px] text-[1.875rem] font-semibold leading-[1.15] tracking-[-0.025em] text-white md:text-[2.5rem]"
              >
                <AccentText text={content.title} tone="dark" />
              </h2>
              <p className="mt-5 max-w-[520px] text-[0.9375rem] leading-relaxed text-white/82 md:text-base">
                {content.text}
              </p>
            </div>
          </div>

          {/* Sağ: mini form */}
          <div className="bg-green-050/60 p-5 md:p-8 lg:flex lg:items-center">
            <div className="w-full">
              <CTABannerForm
                title={content.formTitle}
                text={content.formText}
                submitLabel={content.submitLabel}
                successTitle={successTitle}
                successText={successText}
                phoneDisplay={phoneDisplay}
                phoneHref={phoneHref}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
