import "server-only";

import crypto from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { CONTENT_DIR } from "@/lib/content";

const SETTINGS_FILE = path.join(CONTENT_DIR, "settings.json");

export type MailSettings = {
  enabled: boolean;
  host: string;
  port: number;
  /** 465 için true (örtük TLS); 587 için false (STARTTLS). */
  secure: boolean;
  requireTls: boolean;
  /** Kendinden imzalı sertifikalarda kapatılabilir. */
  rejectUnauthorized: boolean;
  user: string;
  /** Şifrelenmiş olarak saklanır; hiçbir zaman düz metin dönmez. */
  passwordEnc: string | null;
  fromName: string;
  fromAddress: string;
  /** Bildirimlerin gideceği adresler, virgülle ayrılır. */
  to: string;
  subjectPrefix: string;
  /** Yanıtla düğmesi doğrudan talebi bırakan kişiye gitsin mi? */
  replyToSubmitter: boolean;
};

export type AdminAccount = {
  username: string | null;
  /** scrypt özeti; düz şifre saklanmaz. */
  passwordHash: string | null;
  updatedAt: string | null;
};

export type Settings = {
  mail: MailSettings;
  account: AdminAccount;
};

export const defaultSettings: Settings = {
  mail: {
    enabled: false,
    host: "mail.tusahastanesi.com",
    port: 587,
    secure: false,
    requireTls: true,
    rejectUnauthorized: true,
    user: "info@tusahastanesi.com",
    passwordEnc: null,
    fromName: "TUSA Hastanesi — Sanal Anjiyo",
    fromAddress: "info@tusahastanesi.com",
    to: "info@tusahastanesi.com",
    subjectPrefix: "[Sanal Anjiyo]",
    replyToSubmitter: false,
  },
  account: {
    username: null,
    passwordHash: null,
    updatedAt: null,
  },
};

export async function getSettings(): Promise<Settings> {
  try {
    const raw = await fs.readFile(SETTINGS_FILE, "utf8");
    const stored = JSON.parse(raw) as Partial<Settings>;

    return {
      mail: { ...defaultSettings.mail, ...stored.mail },
      account: { ...defaultSettings.account, ...stored.account },
    };
  } catch {
    return defaultSettings;
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  await fs.mkdir(CONTENT_DIR, { recursive: true });
  const temporary = `${SETTINGS_FILE}.${process.pid}.tmp`;
  await fs.writeFile(temporary, JSON.stringify(settings, null, 2), {
    encoding: "utf8",
    mode: 0o600,
  });
  await fs.rename(temporary, SETTINGS_FILE);
}

/* ------------------------------------------------------------- şifreleme */

function secretKey(): Buffer {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET tanımlı değil; e-posta şifresi güvenle saklanamaz.",
    );
  }
  return crypto.scryptSync(secret, "tusa-settings-v1", 32);
}

/** Değeri AES-256-GCM ile şifreler. Anahtar ADMIN_SESSION_SECRET'ten türetilir. */
export function encryptSecret(value: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", secretKey(), iv);
  const data = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);

  return [
    "v1",
    iv.toString("base64"),
    cipher.getAuthTag().toString("base64"),
    data.toString("base64"),
  ].join(":");
}

/** Çözülemezse null döner (ör. ADMIN_SESSION_SECRET değişmişse). */
export function decryptSecret(value: string | null): string | null {
  if (!value) return null;

  try {
    const [version, iv, tag, data] = value.split(":");
    if (version !== "v1" || !iv || !tag || !data) return null;

    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      secretKey(),
      Buffer.from(iv, "base64"),
    );
    decipher.setAuthTag(Buffer.from(tag, "base64"));

    return Buffer.concat([
      decipher.update(Buffer.from(data, "base64")),
      decipher.final(),
    ]).toString("utf8");
  } catch {
    return null;
  }
}

/* --------------------------------------------------------- şifre özetleme */

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64);
  return `scrypt:${salt.toString("hex")}:${hash.toString("hex")}`;
}

export function verifyPasswordHash(password: string, stored: string): boolean {
  try {
    const [scheme, salt, hash] = stored.split(":");
    if (scheme !== "scrypt" || !salt || !hash) return false;

    const expected = Buffer.from(hash, "hex");
    const actual = crypto.scryptSync(
      password,
      Buffer.from(salt, "hex"),
      expected.length,
    );

    return crypto.timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}
