import { Download, Mail, MailOpen, Phone, Trash2 } from "lucide-react";
import {
  deleteReadSubmissions,
  deleteSubmission,
  toggleSubmissionRead,
} from "@/app/admin/actions";
import { getSubmissions } from "@/lib/content";

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const sourceLabels: Record<string, string> = {
  "cta-banner": "Banner formu",
  "contact-section": "İletişim formu",
};

type Search = { q?: string; durum?: string };

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { q = "", durum = "" } = await searchParams;
  const all = await getSubmissions();

  const unread = all.filter((item) => !item.read).length;
  const readCount = all.length - unread;

  const needle = q.trim().toLocaleLowerCase("tr");
  const submissions = all.filter((item) => {
    if (durum === "yeni" && item.read) return false;
    if (durum === "okundu" && !item.read) return false;
    if (!needle) return true;

    return [item.name, item.phone, item.email, item.message]
      .filter(Boolean)
      .some((value) => value!.toLocaleLowerCase("tr").includes(needle));
  });

  const filtreVar = Boolean(needle) || Boolean(durum);

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[1.375rem] font-semibold text-ink">Talepler</h1>
          <p className="mt-2 text-sm text-muted">
            {all.length} kayıt · {unread} okunmamış
            {filtreVar ? ` · ${submissions.length} sonuç gösteriliyor` : ""}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/admin/talepler/export"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-text transition-colors hover:border-green-800 hover:text-green-800"
          >
            <Download size={15} aria-hidden="true" />
            CSV indir
          </a>

          {readCount > 0 ? (
            <form action={deleteReadSubmissions}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-text transition-colors hover:border-[#b4483f] hover:text-[#b4483f]"
              >
                <Trash2 size={15} aria-hidden="true" />
                Okunanları sil ({readCount})
              </button>
            </form>
          ) : null}
        </div>
      </header>

      {all.length > 0 ? (
        <form
          method="get"
          className="mb-6 flex flex-wrap items-end gap-3 rounded-[20px] border border-line bg-white p-4"
        >
          <div className="min-w-[220px] flex-1">
            <label
              htmlFor="talep-ara"
              className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-muted"
            >
              Ara
            </label>
            <input
              id="talep-ara"
              name="q"
              type="search"
              defaultValue={q}
              placeholder="Ad, telefon, e-posta veya mesaj"
              className="field !h-11 text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="talep-durum"
              className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-muted"
            >
              Durum
            </label>
            <select
              id="talep-durum"
              name="durum"
              defaultValue={durum}
              className="field !h-11 text-sm"
            >
              <option value="">Tümü</option>
              <option value="yeni">Okunmamış</option>
              <option value="okundu">Okunmuş</option>
            </select>
          </div>

          <button type="submit" className="btn-primary !h-11 !px-6 !text-sm">
            Filtrele
          </button>

          {filtreVar ? (
            <a
              href="/admin/talepler"
              className="text-sm text-muted underline underline-offset-4 transition-colors hover:text-green-800"
            >
              Temizle
            </a>
          ) : null}
        </form>
      ) : null}

      {submissions.length === 0 ? (
        <p className="rounded-[20px] border border-dashed border-line bg-white p-12 text-center text-sm text-muted">
          {filtreVar
            ? "Aramanızla eşleşen talep bulunamadı."
            : "Henüz talep yok. Formdan gelen kayıtlar burada listelenir."}
        </p>
      ) : (
        <ul className="space-y-3">
          {submissions.map((item) => (
            <li
              key={item.id}
              className={[
                "rounded-[20px] border bg-white p-6",
                item.read ? "border-line" : "border-green-800/30 bg-green-050/40",
              ].join(" ")}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-[1.0625rem] font-semibold text-ink">
                      {item.name}
                    </h2>
                    {!item.read ? (
                      <span className="rounded-full bg-green-800 px-2.5 py-0.5 text-[0.6875rem] font-medium text-white">
                        Yeni
                      </span>
                    ) : null}
                    <span className="text-xs text-muted">
                      {sourceLabels[item.source] ?? item.source}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-muted">
                    {formatDate(item.createdAt)}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                    <a
                      href={`tel:${item.phone.replace(/\s/g, "")}`}
                      className="inline-flex items-center gap-2 font-medium text-green-800 transition-colors hover:text-green-900"
                    >
                      <Phone size={15} aria-hidden="true" />
                      {item.phone}
                    </a>
                    {item.email ? (
                      <a
                        href={`mailto:${item.email}`}
                        className="inline-flex items-center gap-2 text-text transition-colors hover:text-green-800"
                      >
                        <Mail size={15} aria-hidden="true" />
                        {item.email}
                      </a>
                    ) : null}
                  </div>

                  {item.message ? (
                    <p className="mt-4 max-w-[70ch] whitespace-pre-line rounded-2xl bg-offwhite p-4 text-sm leading-relaxed text-text">
                      {item.message}
                    </p>
                  ) : null}

                  {item.utm && Object.keys(item.utm).length > 0 ? (
                    <p className="mt-3 text-xs text-muted">
                      {Object.entries(item.utm)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(" · ")}
                    </p>
                  ) : null}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <form action={toggleSubmissionRead.bind(null, item.id, !item.read)}>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-2 text-xs font-medium text-text transition-colors hover:border-green-800 hover:text-green-800"
                    >
                      {item.read ? (
                        <>
                          <Mail size={14} aria-hidden="true" />
                          Okunmadı yap
                        </>
                      ) : (
                        <>
                          <MailOpen size={14} aria-hidden="true" />
                          Okundu
                        </>
                      )}
                    </button>
                  </form>

                  <form action={deleteSubmission.bind(null, item.id)}>
                    <button
                      type="submit"
                      aria-label="Talebi sil"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-[#b4483f] hover:text-[#b4483f]"
                    >
                      <Trash2 size={15} aria-hidden="true" />
                    </button>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
