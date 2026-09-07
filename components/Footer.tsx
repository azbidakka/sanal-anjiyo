import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import type { NavLink, SiteContent } from "@/lib/content-types";

type Props = {
  content: SiteContent["footer"];
  nav: NavLink[];
  hospitalName: string;
  corporateUrl: string;
  address: string;
  phoneDisplay: string;
  phoneHref: string;
};

export default function Footer({
  content,
  nav,
  hospitalName,
  corporateUrl,
  address,
  phoneDisplay,
  phoneHref,
}: Props) {
  const corporateLabel = corporateUrl.replace(/^https?:\/\//, "");

  return (
    <footer className="bg-green-900 text-white">
      <div className="container-page py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-16">
          <div>
            <Image
              src={siteConfig.logoWhite}
              alt={hospitalName}
              width={2324}
              height={380}
              sizes="200px"
              className="h-[28px] w-auto"
            />

            <p className="mt-6 max-w-[42ch] text-[0.9375rem] leading-relaxed text-white/70">
              {content.tagline}
            </p>

            <div className="mt-7 space-y-3 text-[0.9375rem] text-white/80">
              <p className="flex items-start gap-3">
                <MapPin
                  size={17}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-white/50"
                />
                {address}
              </p>
              <p className="flex items-center gap-3">
                <Phone
                  size={17}
                  aria-hidden="true"
                  className="shrink-0 text-white/50"
                />
                <a
                  href={phoneHref}
                  data-cta="footer-phone"
                  className="transition-colors hover:text-white"
                >
                  {phoneDisplay}
                </a>
              </p>
            </div>
          </div>

          <nav aria-label="Sayfa bölümleri">
            <h2 className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-white/50">
              {content.pagesTitle}
            </h2>
            <ul className="mt-5 space-y-3">
              {nav.map((link) => (
                <li key={link.href}>
                  <a
                    href={`/${link.href}`}
                    className="text-[0.9375rem] text-white/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Yasal bilgiler">
            <h2 className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-white/50">
              {content.legalTitle}
            </h2>
            <ul className="mt-5 space-y-3">
              {content.legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[0.9375rem] text-white/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 border-t border-white/12 pt-8">
          <p className="max-w-[70ch] text-[0.8125rem] leading-relaxed text-white/60">
            {content.disclaimer}
          </p>

          <div className="mt-6 flex flex-col gap-3 text-[0.8125rem] text-white/60 sm:flex-row sm:items-center sm:justify-between">
            <p>{content.copyright}</p>
            <a
              href={corporateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              {corporateLabel}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
