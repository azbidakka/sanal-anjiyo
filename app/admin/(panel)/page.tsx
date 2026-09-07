import Link from "next/link";
import { ArrowRight, Inbox, Stethoscope, HelpCircle, ImageIcon } from "lucide-react";
import { getContent, getSubmissions } from "@/lib/content";

const shortcuts = [
  {
    href: "/admin/icerik?b=hero",
    title: "Hero alanı",
    text: "Ana başlık, açıklama ve görsel.",
    icon: ImageIcon,
  },
  {
    href: "/admin/icerik?b=doctors",
    title: "Hekimler",
    text: "Kartları düzenleyin, fotoğraf yükleyin.",
    icon: Stethoscope,
  },
  {
    href: "/admin/icerik?b=faq",
    title: "Sık sorulan sorular",
    text: "Soru ekleyin, sırasını değiştirin.",
    icon: HelpCircle,
  },
  {
    href: "/admin/icerik?b=contact",
    title: "İletişim bilgileri",
    text: "Telefon ve adres tüm sayfada güncellenir.",
    icon: Inbox,
  },
];

export default async function DashboardPage() {
  const [content, submissions] = await Promise.all([
    getContent(),
    getSubmissions(),
  ]);

  const unread = submissions.filter((item) => !item.read).length;
  const latest = submissions.slice(0, 5);

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-[1.5rem] font-semibold text-ink">Panel özeti</h1>
        <p className="mt-2 text-sm text-muted">
          {content.contact.hospitalName} · Sanal Anjiyo sayfası
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[20px] border border-line bg-white p-6">
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-muted">
            Toplam talep
          </p>
          <p className="mt-2 text-[2rem] font-semibold text-ink">
            {submissions.length}
          </p>
        </div>

        <div className="rounded-[20px] border border-line bg-white p-6">
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-muted">
            Okunmamış
          </p>
          <p className="mt-2 text-[2rem] font-semibold text-green-800">{unread}</p>
        </div>

        <div className="rounded-[20px] border border-line bg-white p-6">
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-muted">
            Sayfadaki soru sayısı
          </p>
          <p className="mt-2 text-[2rem] font-semibold text-ink">
            {content.faq.items.length}
          </p>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-[1.0625rem] font-semibold text-ink">
          Hızlı düzenleme
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {shortcuts.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group flex items-start gap-4 rounded-[20px] border border-line bg-white p-6 transition-colors hover:border-green-800/30"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-050 text-green-800">
                  <item.icon size={19} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-2 text-[0.9375rem] font-medium text-ink">
                    {item.title}
                    <ArrowRight
                      size={15}
                      aria-hidden="true"
                      className="text-green-800 transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </span>
                  <span className="mt-1 block text-sm text-muted">{item.text}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-[1.0625rem] font-semibold text-ink">Son talepler</h2>
          <Link
            href="/admin/talepler"
            className="text-sm font-medium text-green-800 transition-colors hover:text-green-900"
          >
            Tümünü gör
          </Link>
        </div>

        {latest.length === 0 ? (
          <p className="rounded-[20px] border border-dashed border-line bg-white p-8 text-center text-sm text-muted">
            Henüz talep yok.
          </p>
        ) : (
          <ul className="divide-y divide-line overflow-hidden rounded-[20px] border border-line bg-white">
            {latest.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
              >
                <div className="min-w-0">
                  <p className="text-[0.9375rem] font-medium text-ink">
                    {item.name}
                    {!item.read ? (
                      <span className="ml-2 rounded-full bg-green-800 px-2 py-0.5 text-[0.625rem] font-medium text-white">
                        Yeni
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-0.5 text-sm text-muted">{item.phone}</p>
                </div>
                <p className="text-xs text-muted">
                  {new Date(item.createdAt).toLocaleString("tr-TR", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
