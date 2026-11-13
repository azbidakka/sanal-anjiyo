import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegalBody from "@/components/LegalBody";
import LegalPage from "@/components/LegalPage";
import { getContent } from "@/lib/content";

const SLUG = "gizlilik";

async function getDocument() {
  const content = await getContent();
  return content.legal.pages.find((page) => page.id === SLUG) ?? null;
}

export async function generateMetadata(): Promise<Metadata> {
  const document = await getDocument();
  if (!document) return { title: "Sayfa bulunamadı" };

  return {
    title: `${document.title} | TUSA Hastanesi — Sanal Anjiyo`,
    description: "Sanal Anjiyo bilgilendirme sayfasında toplanan bilgilerin nasıl kullanıldığına ilişkin gizlilik politikası.",
    alternates: { canonical: `/${SLUG}` },
    robots: { index: true, follow: true },
  };
}

export default async function Page() {
  const document = await getDocument();
  if (!document) notFound();

  return (
    <LegalPage title={document.title} updatedAt={document.updatedAt}>
      <LegalBody body={document.body} />
    </LegalPage>
  );
}
