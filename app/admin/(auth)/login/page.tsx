import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { getAdminUser, isAdminConfigured } from "@/lib/auth";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Panel Girişi | TUSA Sanal Anjiyo",
  robots: { index: false, follow: false },
};

// Panel sayfaları hiçbir koşulda önceden üretilip önbelleğe alınmamalı.
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getAdminUser()) redirect("/admin");

  const configured = await isAdminConfigured();

  return (
    <div className="flex min-h-screen items-center justify-center bg-offwhite px-5 py-16">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 flex justify-center">
          <Image
            src={siteConfig.logo}
            alt="TUSA Hastanesi"
            width={2324}
            height={380}
            priority
            className="h-[28px] w-auto"
          />
        </div>

        <div className="rounded-[24px] border border-line bg-white p-8">
          <h1 className="text-[1.375rem] font-semibold text-ink">
            Yönetim Paneli
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Sanal Anjiyo sayfasının içeriğini düzenlemek için giriş yapın.
          </p>

          {configured ? (
            <LoginForm />
          ) : (
            <div className="mt-6 rounded-2xl border border-line bg-green-050 p-5 text-sm leading-relaxed text-text">
              <p className="font-medium text-ink">Panel henüz yapılandırılmadı.</p>
              <p className="mt-2">
                Proje kök dizinindeki <code>.env.local</code> dosyasına
                aşağıdaki değişkenleri ekleyip sunucuyu yeniden başlatın:
              </p>
              <pre className="mt-3 overflow-x-auto rounded-xl bg-white p-3 text-xs text-ink">
{`ADMIN_USERNAME=...
ADMIN_PASSWORD=...
ADMIN_SESSION_SECRET=...`}
              </pre>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          Bu alan yalnızca yetkili personel içindir.
        </p>
      </div>
    </div>
  );
}
