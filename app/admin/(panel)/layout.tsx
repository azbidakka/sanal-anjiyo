import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";
import { logoutAction } from "@/app/admin/actions";
import { getAdminUser } from "@/lib/auth";
import { getContent, getSubmissions } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Yönetim Paneli | TUSA Sanal Anjiyo",
  robots: { index: false, follow: false },
};

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  const [content, submissions] = await Promise.all([
    getContent(),
    getSubmissions(),
  ]);
  const unread = submissions.filter((item) => !item.read).length;

  return (
    <div className="min-h-screen bg-offwhite pb-16">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex w-full max-w-[1180px] flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center">
              <Image
                src={siteConfig.logo}
                alt={content.contact.hospitalName}
                width={2324}
                height={380}
                priority
                className="h-[24px] w-auto"
              />
            </Link>
            <span className="hidden text-sm text-muted sm:inline">
              Yönetim Paneli
            </span>
            <span className="hidden text-sm text-muted lg:inline">
              · {user}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-green-800"
            >
              <ExternalLink size={15} aria-hidden="true" />
              Siteyi görüntüle
            </a>

            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-sm text-text transition-colors hover:border-green-800 hover:text-green-800"
              >
                <LogOut size={15} aria-hidden="true" />
                Çıkış
              </button>
            </form>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[1180px] px-5 pb-3">
          <AdminNav unread={unread} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1180px] px-5 py-8">{children}</main>
    </div>
  );
}
