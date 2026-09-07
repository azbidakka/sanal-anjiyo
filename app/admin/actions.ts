"use server";

import { promises as fs } from "node:fs";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createSession,
  destroySession,
  isAdminConfigured,
  requireAdmin,
  verifyCredentials,
} from "@/lib/auth";
import {
  CONTENT_DIR,
  deleteUpload,
  getContent,
  getSubmissions,
  saveContent,
  saveSubmissions,
} from "@/lib/content";
import {
  encryptSecret,
  getSettings,
  hashPassword,
  saveSettings,
} from "@/lib/settings";
import { sendTestMail, verifyMailSettings } from "@/lib/mailer";
import { findSection, type AdminField } from "@/lib/admin-schema";
import { UPLOAD_DIR_URL } from "@/lib/site-config";
import type { SiteContent } from "@/lib/content-types";

/* ----------------------------------------------------------------- oturum */

export type LoginState = { error?: string };

export async function loginAction(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!(await isAdminConfigured())) {
    return {
      error:
        "Panel yapılandırılmamış. Sunucuda ADMIN_USERNAME, ADMIN_PASSWORD ve ADMIN_SESSION_SECRET tanımlanmalı.",
    };
  }

  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "Kullanıcı adı ve şifre gerekli." };
  }

  if (!(await verifyCredentials(username, password))) {
    return { error: "Kullanıcı adı veya şifre hatalı." };
  }

  await createSession(username);
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

/* ---------------------------------------------------------------- içerik */

function cleanText(value: unknown): string {
  return typeof value === "string" ? value.replace(/\r\n/g, "\n").trim() : "";
}

function cleanField(field: AdminField, value: unknown): string | string[] {
  if (field.type === "lines") {
    const raw = Array.isArray(value) ? value.join("\n") : cleanText(value);
    return raw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  }

  return cleanText(value);
}

function slugify(value: string): string {
  const map: Record<string, string> = {
    ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u",
    Ç: "c", Ğ: "g", İ: "i", Ö: "o", Ş: "s", Ü: "u",
  };

  return value
    .replace(/[çğıöşüÇĞİÖŞÜ]/g, (char) => map[char] ?? char)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Gelen veriyi şemaya göre süzer; bilinmeyen alanlar yok sayılır. */
function normalizeSection(
  sectionId: string,
  raw: Record<string, unknown>,
): Record<string, unknown> {
  const section = findSection(sectionId);
  if (!section) throw new Error("Bilinmeyen bölüm.");

  const result: Record<string, unknown> = {};

  for (const field of section.fields) {
    result[field.name] = cleanField(field, raw[field.name]);
  }

  for (const list of section.lists) {
    const items = Array.isArray(raw[list.name]) ? (raw[list.name] as unknown[]) : [];

    result[list.name] = items.map((item, index) => {
      const source = (item ?? {}) as Record<string, unknown>;
      const entry: Record<string, unknown> = {};

      for (const field of list.fields) {
        entry[field.name] = cleanField(field, source[field.name]);
      }

      // Kimlik gerektiren listelerde (SSS, hekimler) sabit bir id üretilir.
      if (sectionId === "faq" || sectionId === "doctors") {
        const existing = cleanText(source.id);
        const base =
          existing ||
          slugify(String(entry[list.titleField] ?? "")) ||
          `${sectionId}-${index + 1}`;
        entry.id = base;
      }

      return entry;
    });
  }

  return result;
}

export type SaveState = { ok?: boolean; error?: string; savedAt?: string };

export async function saveSectionAction(
  _previous: SaveState,
  formData: FormData,
): Promise<SaveState> {
  try {
    await requireAdmin();

    const sectionId = String(formData.get("sectionId") ?? "");
    const payload = String(formData.get("payload") ?? "");
    const section = findSection(sectionId);

    if (!section) return { error: "Bilinmeyen bölüm." };

    const parsed = JSON.parse(payload) as Record<string, unknown>;
    const normalized = normalizeSection(sectionId, parsed);

    const content = await getContent();
    const next: SiteContent = {
      ...content,
      [sectionId]: {
        ...(content[section.id] as Record<string, unknown>),
        ...normalized,
      },
    };

    await saveContent(next);
    revalidatePath("/", "layout");

    return {
      ok: true,
      savedAt: new Date().toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Kayıt sırasında hata oluştu.",
    };
  }
}

/* --------------------------------------------------------------- görsel */

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export type UploadResult = { ok: true; url: string } | { ok: false; error: string };

export async function uploadImageAction(
  formData: FormData,
): Promise<UploadResult> {
  try {
    await requireAdmin();

    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return { ok: false, error: "Dosya seçilmedi." };
    }

    const extension = ALLOWED_TYPES[file.type];
    if (!extension) {
      return {
        ok: false,
        error: "Yalnızca JPG, PNG, WebP veya AVIF yükleyebilirsiniz.",
      };
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return { ok: false, error: "Dosya boyutu 8 MB'ı aşamaz." };
    }

    const baseName =
      slugify(file.name.replace(/\.[^.]+$/, "")) || "gorsel";
    const fileName = `${baseName}-${Date.now().toString(36)}.${extension}`;

    const directory = path.join(CONTENT_DIR, "uploads");
    await fs.mkdir(directory, { recursive: true });
    await fs.writeFile(
      path.join(directory, fileName),
      Buffer.from(await file.arrayBuffer()),
    );

    return { ok: true, url: `${UPLOAD_DIR_URL}/${fileName}` };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Yükleme sırasında hata oluştu.",
    };
  }
}

/* -------------------------------------------------------------- talepler */

export async function toggleSubmissionRead(
  id: string,
  read: boolean,
): Promise<void> {
  await requireAdmin();

  const list = await getSubmissions();
  await saveSubmissions(
    list.map((item) => (item.id === id ? { ...item, read } : item)),
  );
  revalidatePath("/admin/talepler");
}

export async function deleteSubmission(id: string): Promise<void> {
  await requireAdmin();

  const list = await getSubmissions();
  await saveSubmissions(list.filter((item) => item.id !== id));
  revalidatePath("/admin/talepler");
}

export async function deleteReadSubmissions(): Promise<void> {
  await requireAdmin();

  const list = await getSubmissions();
  await saveSubmissions(list.filter((item) => !item.read));
  revalidatePath("/admin/talepler");
}

/* ---------------------------------------------------------------- medya */

export async function deleteUploadAction(name: string): Promise<void> {
  await requireAdmin();
  await deleteUpload(name);
  revalidatePath("/admin/gorseller");
}

/* --------------------------------------------------------------- ayarlar */

export type SettingsState = {
  ok?: boolean;
  error?: string;
  message?: string;
};

function toBool(value: FormDataEntryValue | null): boolean {
  return value === "on" || value === "true";
}

/** Ayarlar formundan gelen değerleri okur. */
function readMailForm(formData: FormData) {
  return {
    enabled: toBool(formData.get("enabled")),
    host: String(formData.get("host") ?? "").trim(),
    port: Number(formData.get("port") ?? 587) || 587,
    secure: String(formData.get("port") ?? "") === "465",
    requireTls: toBool(formData.get("requireTls")),
    rejectUnauthorized: toBool(formData.get("rejectUnauthorized")),
    user: String(formData.get("user") ?? "").trim(),
    fromName: String(formData.get("fromName") ?? "").trim(),
    fromAddress: String(formData.get("fromAddress") ?? "").trim(),
    to: String(formData.get("to") ?? "").trim(),
    subjectPrefix: String(formData.get("subjectPrefix") ?? "").trim(),
    replyToSubmitter: toBool(formData.get("replyToSubmitter")),
    password: String(formData.get("password") ?? ""),
  };
}

export async function saveMailSettingsAction(
  _previous: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  try {
    await requireAdmin();

    const input = readMailForm(formData);
    if (!input.host || !input.user) {
      return { error: "Sunucu adresi ve kullanıcı adı zorunludur." };
    }

    const settings = await getSettings();
    const { password, ...mail } = input;

    settings.mail = {
      ...settings.mail,
      ...mail,
      // Şifre alanı boş bırakıldıysa kayıtlı şifre korunur.
      passwordEnc: password
        ? encryptSecret(password)
        : settings.mail.passwordEnc,
    };

    await saveSettings(settings);
    revalidatePath("/admin/ayarlar");

    return { ok: true, message: "E-posta ayarları kaydedildi." };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Ayarlar kaydedilemedi.",
    };
  }
}

export async function testMailAction(
  _previous: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  try {
    await requireAdmin();

    const input = readMailForm(formData);
    const { password, ...mail } = input;

    const connection = await verifyMailSettings({
      ...mail,
      password: password || undefined,
    });

    if (!connection.ok) {
      return { error: `Bağlantı kurulamadı — ${connection.error}` };
    }

    const sent = await sendTestMail({ ...mail, password: password || undefined });
    if (!sent.ok) return { error: `Gönderim başarısız — ${sent.error}` };

    return {
      ok: true,
      message: `Test e-postası ${mail.to} adresine gönderildi.`,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Test gönderilemedi.",
    };
  }
}

export async function changePasswordAction(
  _previous: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  try {
    const currentUser = await requireAdmin();

    const username =
      String(formData.get("username") ?? "").trim() || currentUser;
    const current = String(formData.get("currentPassword") ?? "");
    const next = String(formData.get("newPassword") ?? "");
    const repeat = String(formData.get("repeatPassword") ?? "");

    if (!(await verifyCredentials(currentUser, current))) {
      return { error: "Mevcut şifre hatalı." };
    }

    if (next.length < 10) {
      return { error: "Yeni şifre en az 10 karakter olmalı." };
    }

    if (next !== repeat) {
      return { error: "Yeni şifreler birbiriyle eşleşmiyor." };
    }

    const settings = await getSettings();
    settings.account = {
      username,
      passwordHash: hashPassword(next),
      updatedAt: new Date().toISOString(),
    };

    await saveSettings(settings);

    // Kimlik bilgisi değişti; yeni bilgilerle giriş yapılması istenir.
    await destroySession();
    redirect("/admin/login?sifre=degisti");
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") throw error;

    return {
      error: error instanceof Error ? error.message : "Şifre değiştirilemedi.",
    };
  }
}

/* -------------------------------------------------------------- yedekleme */

export async function restoreContentAction(
  _previous: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  try {
    await requireAdmin();

    const file = formData.get("backup");
    if (!(file instanceof File) || file.size === 0) {
      return { error: "Yedek dosyası seçilmedi." };
    }

    if (file.size > 4 * 1024 * 1024) {
      return { error: "Yedek dosyası 4 MB'ı aşamaz." };
    }

    const parsed = JSON.parse(await file.text()) as Record<string, unknown>;

    // Beklenen bölümler yoksa yanlış dosya seçilmiş demektir.
    for (const key of ["hero", "contact", "faq", "footer"]) {
      if (!parsed[key]) {
        return { error: "Dosya geçerli bir içerik yedeği değil." };
      }
    }

    const current = await getContent();
    await saveContent({ ...current, ...(parsed as unknown as SiteContent) });
    revalidatePath("/", "layout");

    return { ok: true, message: "İçerik yedekten geri yüklendi." };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? `Geri yükleme başarısız: ${error.message}`
          : "Geri yükleme başarısız.",
    };
  }
}
