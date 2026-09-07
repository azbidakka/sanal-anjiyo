import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import defaultContent from "@/content/site-content.json";
import type { SiteContent, Submission } from "@/lib/content-types";

/** İçerik dosyalarının bulunduğu dizin. Sunucuda yazılabilir olmalıdır. */
export const CONTENT_DIR =
  process.env.CONTENT_DIR ?? path.join(process.cwd(), "content");

const CONTENT_FILE = path.join(CONTENT_DIR, "site-content.json");
const SUBMISSIONS_FILE = path.join(CONTENT_DIR, "submissions.json");

/** Dosya okunamazsa kullanılan, projeyle birlikte gelen içerik. */
export const fallbackContent = defaultContent as SiteContent;

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, value: unknown): Promise<void> {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const temporary = `${file}.${process.pid}.tmp`;
  await fs.writeFile(temporary, JSON.stringify(value, null, 2), "utf8");
  await fs.rename(temporary, file);
}

/* ------------------------------------------------------------------ içerik */

export async function getContent(): Promise<SiteContent> {
  const stored = await readJson<SiteContent>(CONTENT_FILE, fallbackContent);

  // Yeni alanlar eklendiğinde eski dosyanın sayfayı kırmaması için
  // varsayılan içerikle üst düzeyde birleştirilir.
  return { ...fallbackContent, ...stored };
}

export async function saveContent(content: SiteContent): Promise<void> {
  await writeJson(CONTENT_FILE, content);
}

/* -------------------------------------------------------------- talepler */

export async function getSubmissions(): Promise<Submission[]> {
  const list = await readJson<Submission[]>(SUBMISSIONS_FILE, []);
  return Array.isArray(list) ? list : [];
}

export async function saveSubmissions(list: Submission[]): Promise<void> {
  await writeJson(SUBMISSIONS_FILE, list);
}

export async function addSubmission(
  submission: Omit<Submission, "id" | "createdAt" | "read">,
): Promise<Submission> {
  const list = await getSubmissions();
  const entry: Submission = {
    ...submission,
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    read: false,
  };

  // En yeni kayıt başta; dosya sınırsız büyümesin diye üst sınır uygulanır.
  await saveSubmissions([entry, ...list].slice(0, 5000));
  return entry;
}

/* ----------------------------------------------------------------- medya */

export type UploadedFile = {
  name: string;
  url: string;
  size: number;
  modifiedAt: string;
  inUse: boolean;
};

/** Panelden yüklenmiş görselleri, içerikte kullanılıp kullanılmadıklarıyla listeler. */
export async function listUploads(): Promise<UploadedFile[]> {
  const directory = path.join(CONTENT_DIR, "uploads");

  let names: string[];
  try {
    names = await fs.readdir(directory);
  } catch {
    return [];
  }

  const contentJson = JSON.stringify(await getContent());

  const files = await Promise.all(
    names
      .filter((name) => !name.endsWith(".tmp"))
      .map(async (name) => {
        const stats = await fs.stat(path.join(directory, name));
        const url = `/uploads/${name}`;

        return {
          name,
          url,
          size: stats.size,
          modifiedAt: stats.mtime.toISOString(),
          inUse: contentJson.includes(url),
        };
      }),
  );

  return files.sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt));
}

export async function deleteUpload(name: string): Promise<void> {
  // Dizin dışına çıkışı engelle.
  if (!/^[a-z0-9][a-z0-9._-]{0,120}$/i.test(name) || name.includes("..")) {
    throw new Error("Geçersiz dosya adı.");
  }

  await fs.unlink(path.join(CONTENT_DIR, "uploads", name));
}

/* --------------------------------------------------------------- türetilen */

export function fullAddress(content: SiteContent): string {
  const { addressStreet, addressDistrict, addressCity } = content.contact;
  return `${addressStreet}, ${addressDistrict} / ${addressCity}`;
}

export function phoneHref(content: SiteContent): string {
  return `tel:${content.contact.phoneE164}`;
}

export function mapsDirectionsUrl(content: SiteContent): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    content.contact.mapsQuery,
  )}`;
}

export function mapsEmbedUrl(content: SiteContent): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(
    content.contact.mapsQuery,
  )}&output=embed`;
}
