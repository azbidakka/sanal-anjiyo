import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Poppins } from "next/font/google";
import { getContent } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-poppins",
});

/** Başlıklardaki italik vurgular için serif yazı tipi. */
const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400"],
  style: ["italic"],
  display: "swap",
  variable: "--font-cormorant",
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent();
  const { title, description, keywords } = content.meta;

  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    keywords,
    alternates: { canonical: "/" },
    authors: [
      { name: content.contact.hospitalName, url: content.contact.corporateUrl },
    ],
    openGraph: {
      title,
      description,
      url: siteConfig.url,
      siteName: content.contact.hospitalName,
      locale: siteConfig.locale,
      type: "website",
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: "Koroner BT Anjiyografi görüntüleme kompozisyonu",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteConfig.ogImage],
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#0d6734",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const content = await getContent();

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      name: "Sanal Anjiyo (Koroner BT Anjiyografi)",
      description: "Koroner BT Anjiyografi hakkında hasta bilgilendirme sayfası.",
      url: `${siteConfig.url}/`,
      inLanguage: "tr-TR",
      about: { "@type": "MedicalProcedure", name: "Koroner BT Anjiyografi" },
    },
    {
      "@context": "https://schema.org",
      "@type": "Hospital",
      name: content.contact.hospitalName,
      url: content.contact.corporateUrl,
      telephone: content.contact.phoneE164,
      address: {
        "@type": "PostalAddress",
        streetAddress: content.contact.addressStreet,
        addressLocality: content.contact.addressDistrict,
        addressRegion: content.contact.addressCity,
        addressCountry: "TR",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: content.faq.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ];

  return (
    // Aşağıdaki script hydration öncesi <html> sınıfını değiştirir.
    <html
      lang="tr"
      className={`${poppins.variable} ${cormorant.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Reveal animasyonları yalnızca JavaScript çalışıyorsa devreye girer. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
