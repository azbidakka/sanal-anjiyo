import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { fullAddress, getContent, phoneHref } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";
import Footer from "./Footer";

type Props = {
  title: string;
  updatedAt: string;
  children: ReactNode;
};

export default async function LegalPage({ title, updatedAt, children }: Props) {
  const content = await getContent();
  const address = fullAddress(content);
  const tel = phoneHref(content);
  const hospitalName = content.contact.hospitalName;

  return (
    <>
      <header className="border-b border-line bg-white">
        <div className="container-page flex h-[76px] items-center justify-between gap-6">
          <Link href="/" className="flex items-center" aria-label={hospitalName}>
            <Image
              src={siteConfig.logo}
              alt={hospitalName}
              width={2324}
              height={380}
              priority
              className="h-[26px] w-auto md:h-[30px]"
            />
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[0.9375rem] text-muted transition-colors hover:text-green-800"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Sanal Anjiyo sayfası
          </Link>
        </div>
      </header>

      <main className="bg-white">
        <div className="container-page py-16 md:py-24">
          <div className="measure">
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-green-800">
              {hospitalName}
            </p>
            <h1 className="h2-display mt-4">{title}</h1>
            <p className="mt-4 text-sm text-muted">
              Son güncelleme: {updatedAt}
            </p>

            <div className="mt-10 space-y-6 text-[0.9375rem] leading-relaxed text-text [&_h2]:pt-4 [&_h2]:text-[1.125rem] [&_h2]:font-semibold [&_li]:leading-relaxed [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
              {children}
            </div>

            <div className="mt-12 rounded-[20px] border border-line bg-green-050 p-6 md:p-7">
              <h2 className="text-[1.0625rem] font-semibold text-ink">
                Başvuru ve iletişim
              </h2>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-text">
                Bu metinde yer alan konularla ilgili taleplerinizi {address}{" "}
                adresine yazılı olarak iletebilir veya{" "}
                <a
                  href={tel}
                  className="font-medium text-green-800 underline underline-offset-4"
                >
                  {content.contact.phoneDisplay}
                </a>{" "}
                numaralı telefondan bize ulaşabilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer
        content={content.footer}
        nav={content.header.nav}
        hospitalName={hospitalName}
        corporateUrl={content.contact.corporateUrl}
        address={address}
        phoneDisplay={content.contact.phoneDisplay}
        phoneHref={tel}
      />
    </>
  );
}
