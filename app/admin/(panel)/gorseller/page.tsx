import Image from "next/image";
import { ImageOff, Trash2 } from "lucide-react";
import { deleteUploadAction } from "@/app/admin/actions";
import CopyPathButton from "@/components/admin/CopyPathButton";
import { listUploads } from "@/lib/content";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function MediaPage() {
  const files = await listUploads();
  const unused = files.filter((file) => !file.inUse).length;

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-[1.5rem] font-semibold text-ink">Görseller</h1>
        <p className="mt-2 text-sm text-muted">
          {files.length} dosya
          {unused > 0 ? ` · ${unused} tanesi sayfada kullanılmıyor` : ""}
        </p>
      </header>

      {files.length === 0 ? (
        <div className="rounded-[20px] border border-dashed border-line bg-white p-12 text-center">
          <ImageOff
            size={28}
            aria-hidden="true"
            className="mx-auto text-muted/60"
          />
          <p className="mt-4 text-sm text-muted">
            Henüz görsel yüklenmedi. İçerik bölümlerindeki görsel alanlarından
            yükleme yapabilirsiniz.
          </p>
        </div>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {files.map((file) => (
            <li
              key={file.name}
              className="overflow-hidden rounded-[20px] border border-line bg-white"
            >
              <div className="relative aspect-[4/3] bg-green-050">
                <Image
                  src={file.url}
                  alt={file.name}
                  fill
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 300px"
                  className="object-cover"
                />
                {file.inUse ? (
                  <span className="absolute left-3 top-3 rounded-full bg-green-800 px-2.5 py-1 text-[0.625rem] font-medium uppercase tracking-[0.1em] text-white">
                    Kullanımda
                  </span>
                ) : null}
              </div>

              <div className="p-4">
                <p className="truncate text-sm font-medium text-ink" title={file.name}>
                  {file.name}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {formatSize(file.size)} ·{" "}
                  {new Date(file.modifiedAt).toLocaleDateString("tr-TR")}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <CopyPathButton value={file.url} />

                  {file.inUse ? (
                    <span className="text-xs text-muted">
                      Silmek için önce içerikten kaldırın
                    </span>
                  ) : (
                    <form action={deleteUploadAction.bind(null, file.name)}>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-[#b4483f] hover:text-[#b4483f]"
                      >
                        <Trash2 size={13} aria-hidden="true" />
                        Sil
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
