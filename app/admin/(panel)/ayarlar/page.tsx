import { Download, Info, KeyRound, Mail, Server } from "lucide-react";
import MailSettingsForm from "@/components/admin/MailSettingsForm";
import PasswordForm from "@/components/admin/PasswordForm";
import RestoreForm from "@/components/admin/RestoreForm";
import { getAdminUser } from "@/lib/auth";
import { getSettings } from "@/lib/settings";

export default async function SettingsPage() {
  const [settings, user] = await Promise.all([getSettings(), getAdminUser()]);

  const passwordChangedAt = settings.account.updatedAt
    ? new Date(settings.account.updatedAt).toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="max-w-[860px]">
      <header className="mb-8">
        <h1 className="text-[1.5rem] font-semibold text-ink">Ayarlar</h1>
        <p className="mt-2 text-sm text-muted">
          E-posta bildirimleri, panel hesabı ve içerik yedeği.
        </p>
      </header>

      {/* E-posta */}
      <section className="mb-12">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-050 text-green-800">
            <Mail size={17} aria-hidden="true" />
          </span>
          <h2 className="text-[1.125rem] font-semibold text-ink">
            E-posta bildirimleri
          </h2>
        </div>

        <div className="mb-5 flex gap-3 rounded-2xl border border-green-100 bg-green-050 p-5">
          <Server size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-green-800" />
          <div className="text-sm leading-relaxed text-text">
            <p className="font-medium text-ink">
              Sunucunuz Exchange 2010 olarak tespit edildi
            </p>
            <p className="mt-1.5">
              <strong>mail.tusahastanesi.com</strong> · 587 portu açık ve
              STARTTLS destekliyor. Sertifika geçerli, TLS 1.2 çalışıyor.
              Şifreli kanal kurulduktan sonra kullanıcı adı/şifre ile gönderim
              yapılabiliyor. Aşağıdaki varsayılanlar buna göre hazırlandı;
              yalnızca posta kutusu şifresini girmeniz yeterli.
            </p>
          </div>
        </div>

        <MailSettingsForm
          settings={settings.mail}
          hasPassword={Boolean(settings.mail.passwordEnc)}
        />
      </section>

      {/* Hesap */}
      <section className="mb-12">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-050 text-green-800">
            <KeyRound size={17} aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-[1.125rem] font-semibold text-ink">
              Panel hesabı
            </h2>
            {passwordChangedAt ? (
              <p className="text-xs text-muted">
                Son güncelleme: {passwordChangedAt}
              </p>
            ) : (
              <p className="text-xs text-muted">
                Şu anda sunucudaki ortam değişkeni kullanılıyor.
              </p>
            )}
          </div>
        </div>

        <PasswordForm username={settings.account.username ?? user ?? ""} />
      </section>

      {/* Yedekleme */}
      <section>
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-050 text-green-800">
            <Download size={17} aria-hidden="true" />
          </span>
          <h2 className="text-[1.125rem] font-semibold text-ink">
            İçerik yedeği
          </h2>
        </div>

        <div className="rounded-[20px] border border-line bg-white p-6 md:p-7">
          <p className="flex gap-3 text-sm leading-relaxed text-text">
            <Info size={17} aria-hidden="true" className="mt-0.5 shrink-0 text-green-800" />
            Sayfadaki tüm metinler tek bir dosyada tutulur. Büyük değişiklikler
            öncesinde yedek almanız, hatalı bir düzenlemeden dönmenizi sağlar.
          </p>

          <a
            href="/admin/ayarlar/yedek"
            className="btn-primary mt-5 !h-12 !px-7"
            download
          >
            <Download size={16} aria-hidden="true" />
            Yedeği indir
          </a>

          <RestoreForm />
        </div>
      </section>
    </div>
  );
}
