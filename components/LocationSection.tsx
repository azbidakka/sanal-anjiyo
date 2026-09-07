"use client";

import Image from "next/image";
import { useState } from "react";
import { MapPin, Navigation, Phone } from "lucide-react";
import type { SiteContent } from "@/lib/content-types";

type Props = {
  content: SiteContent["location"];
  hospitalName: string;
  address: string;
  phoneDisplay: string;
  phoneHref: string;
  directionsUrl: string;
  embedUrl: string;
  image: string;
};

export default function LocationSection({
  content,
  hospitalName,
  address,
  phoneDisplay,
  phoneHref,
  directionsUrl,
  embedUrl,
  image,
}: Props) {
  const [mapVisible, setMapVisible] = useState(false);

  return (
    <section aria-labelledby="konum-title" className="section-y bg-white">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-14">
          <div data-reveal>
            <p className="mb-5 flex items-center gap-3 text-[0.75rem] font-medium uppercase tracking-[0.18em] text-green-800">
              <span
                aria-hidden="true"
                className="inline-block h-px w-8 bg-green-800/40"
              />
              {content.label}
            </p>

            <h2 id="konum-title" className="h3-display text-[1.75rem]">
              {hospitalName}
            </h2>

            <p className="mt-4 flex items-start gap-3 text-[0.9375rem] leading-relaxed text-muted">
              <MapPin
                size={18}
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-green-800"
              />
              {address}
            </p>

            <p className="mt-3 flex items-center gap-3 text-[0.9375rem] text-muted">
              <Phone
                size={18}
                aria-hidden="true"
                className="shrink-0 text-green-800"
              />
              <a
                href={phoneHref}
                data-cta="location-phone"
                className="transition-colors hover:text-green-800"
              >
                {phoneDisplay}
              </a>
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={phoneHref}
                data-cta="location-call"
                className="btn-primary w-full sm:w-auto"
              >
                <Phone size={17} aria-hidden="true" />
                {content.callLabel}
              </a>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cta="location-directions"
                className="btn-secondary w-full sm:w-auto"
              >
                <Navigation size={17} aria-hidden="true" />
                {content.directionsLabel}
              </a>
            </div>
          </div>

          <div
            data-reveal
            style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
            className="relative aspect-[16/10] overflow-hidden rounded-[28px] border border-line bg-green-050"
          >
            {mapVisible ? (
              <iframe
                title={`${hospitalName} konum haritası`}
                src={embedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
              />
            ) : (
              <>
                <Image
                  src={image}
                  alt={`${hospitalName} binası`}
                  fill
                  sizes="(max-width: 1024px) 92vw, 56vw"
                  className="object-cover"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-green-900/20"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setMapVisible(true)}
                    data-cta="location-map"
                    className="btn-primary"
                  >
                    <MapPin size={17} aria-hidden="true" />
                    {content.mapButtonLabel}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
