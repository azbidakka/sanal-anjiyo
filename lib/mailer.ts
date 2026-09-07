import "server-only";

import nodemailer, { type Transporter } from "nodemailer";
import { decryptSecret, getSettings, type MailSettings } from "@/lib/settings";
import type { Submission } from "@/lib/content-types";

export type MailResult = { ok: true } | { ok: false; error: string };

/**
 * Exchange 2010 için transport kurar.
 * 587 + STARTTLS beklenir; 465 seçilirse örtük TLS kullanılır.
 */
function createTransport(settings: MailSettings, password: string): Transporter {
  return nodemailer.createTransport({
    host: settings.host,
    port: settings.port,
    secure: settings.secure,
    requireTLS: !settings.secure && settings.requireTls,
    auth: { user: settings.user, pass: password },
    tls: {
      servername: settings.host,
      rejectUnauthorized: settings.rejectUnauthorized,
      // Exchange 2010 eski TLS sürümlerinde kalmış olabilir.
      minVersion: "TLSv1",
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });
}

type Prepared = { transport: Transporter; settings: MailSettings };

async function prepare(
  override?: Partial<MailSettings> & { password?: string },
): Promise<Prepared | { error: string }> {
  const stored = await getSettings();
  const settings: MailSettings = { ...stored.mail, ...override };

  if (!settings.host || !settings.user) {
    return { error: "Sunucu adresi ve kullanıcı adı tanımlı değil." };
  }

  const password =
    override?.password && override.password.length > 0
      ? override.password
      : decryptSecret(settings.passwordEnc);

  if (!password) {
    return {
      error:
        "E-posta şifresi kayıtlı değil. Ayarlar sayfasından şifreyi girip kaydedin.",
    };
  }

  return { transport: createTransport(settings, password), settings };
}

function friendlyError(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error);
  const code = (error as { code?: string })?.code ?? "";

  if (/535|authentication unsuccessful|5\.7\.3/i.test(raw)) {
    return "Kimlik doğrulama reddedildi. Kullanıcı adı ve şifreyi kontrol edin (Exchange'de kullanıcı adı DOMAIN\\kullanici biçiminde de olabilir).";
  }
  if (code === "ETIMEDOUT" || code === "ECONNECTION" || /timeout/i.test(raw)) {
    return `Sunucuya bağlanılamadı (${code || "zaman aşımı"}). Sunucu adresi, port ve güvenlik duvarı iznini kontrol edin.`;
  }
  if (/self.signed|unable to verify|certificate/i.test(raw)) {
    return "Sertifika doğrulanamadı. Ayarlarda “Sertifika doğrulamasını zorunlu tut” seçeneğini kapatmayı deneyin.";
  }
  if (/5\.7\.1|not permitted|relay/i.test(raw)) {
    return "Sunucu göndermeye izin vermedi. Gönderen adresin bu hesaba ait olduğundan emin olun.";
  }

  return raw;
}

/** Ayarların doğruluğunu sunucuya bağlanarak sınar. */
export async function verifyMailSettings(
  override?: Partial<MailSettings> & { password?: string },
): Promise<MailResult> {
  const prepared = await prepare(override);
  if ("error" in prepared) return { ok: false, error: prepared.error };

  try {
    await prepared.transport.verify();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: friendlyError(error) };
  } finally {
    prepared.transport.close();
  }
}

type MailInput = {
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  to?: string;
};

export async function sendMail(
  input: MailInput,
  override?: Partial<MailSettings> & { password?: string },
): Promise<MailResult> {
  const prepared = await prepare(override);
  if ("error" in prepared) return { ok: false, error: prepared.error };

  const { transport, settings } = prepared;
  const recipients = (input.to ?? settings.to)
    .split(/[,;]/)
    .map((value) => value.trim())
    .filter(Boolean);

  if (recipients.length === 0) {
    return { ok: false, error: "Alıcı adresi tanımlı değil." };
  }

  const prefix = settings.subjectPrefix ? `${settings.subjectPrefix} ` : "";

  try {
    await transport.sendMail({
      from: { name: settings.fromName, address: settings.fromAddress },
      to: recipients,
      replyTo: input.replyTo,
      subject: `${prefix}${input.subject}`,
      text: input.text,
      html: input.html,
    });

    return { ok: true };
  } catch (error) {
    return { ok: false, error: friendlyError(error) };
  } finally {
    transport.close();
  }
}

/* ------------------------------------------------------------- şablonlar */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const sourceLabels: Record<string, string> = {
  "cta-banner": "Banner formu",
  "contact-section": "İletişim formu",
};

function layout(title: string, rows: string, footer: string): string {
  return `<!doctype html>
<html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:24px;background:#f7f8f6;font-family:Segoe UI,Arial,sans-serif;color:#323834;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #dde5df;border-radius:14px;overflow:hidden;">
    <tr><td bgcolor="#0a5135" style="background:#0a5135;padding:20px 28px;">
      <p style="margin:0;color:#ffffff;font-size:16px;font-weight:600;">${escapeHtml(title)}</p>
      <p style="margin:4px 0 0;color:#bcd6c8;font-size:13px;">TUSA Hastanesi · Sanal Anjiyo sayfası</p>
    </td></tr>
    <tr><td bgcolor="#ffffff" style="padding:8px 28px 20px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">${rows}</table>
    </td></tr>
    <tr><td bgcolor="#f4f8f5" style="padding:16px 28px;background:#f4f8f5;border-top:1px solid #dde5df;">
      <p style="margin:0;font-size:12px;line-height:1.6;color:#6e756f;">${footer}</p>
    </td></tr>
  </table>
</body></html>`;
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:12px 0;border-bottom:1px solid #eef2ef;width:150px;vertical-align:top;color:#6e756f;font-size:12px;text-transform:uppercase;letter-spacing:.08em;">${escapeHtml(label)}</td>
    <td style="padding:12px 0;border-bottom:1px solid #eef2ef;color:#141816;">${value}</td>
  </tr>`;
}

/** Formdan gelen talebi hastane adresine bildirir. */
export async function sendSubmissionNotification(
  submission: Submission,
): Promise<MailResult> {
  const stored = await getSettings();
  if (!stored.mail.enabled) return { ok: false, error: "E-posta gönderimi kapalı." };

  const created = new Date(submission.createdAt).toLocaleString("tr-TR");
  const phoneDigits = submission.phone.replace(/\s/g, "");

  const rows = [
    row("Ad Soyad", escapeHtml(submission.name)),
    row(
      "Telefon",
      `<a href="tel:${escapeHtml(phoneDigits)}" style="color:#0d6734;font-weight:600;text-decoration:none;">${escapeHtml(submission.phone)}</a>`,
    ),
    submission.email
      ? row(
          "E-posta",
          `<a href="mailto:${escapeHtml(submission.email)}" style="color:#0d6734;text-decoration:none;">${escapeHtml(submission.email)}</a>`,
        )
      : "",
    submission.message
      ? row(
          "Mesaj",
          `<span style="white-space:pre-line;">${escapeHtml(submission.message)}</span>`,
        )
      : "",
    row("Kaynak", escapeHtml(sourceLabels[submission.source] ?? submission.source)),
    row("Tarih", escapeHtml(created)),
    submission.utm && Object.keys(submission.utm).length > 0
      ? row(
          "Kampanya",
          escapeHtml(
            Object.entries(submission.utm)
              .map(([key, value]) => `${key}: ${value}`)
              .join(" · "),
          ),
        )
      : "",
  ].join("");

  const text = [
    "Sanal Anjiyo sayfasından yeni bir bilgi talebi alındı.",
    "",
    `Ad Soyad : ${submission.name}`,
    `Telefon  : ${submission.phone}`,
    submission.email ? `E-posta  : ${submission.email}` : null,
    submission.message ? `Mesaj    : ${submission.message}` : null,
    `Kaynak   : ${sourceLabels[submission.source] ?? submission.source}`,
    `Tarih    : ${created}`,
    "",
    "Bu bildirim sanalanjiyo.tusahastanesi.com üzerinden otomatik gönderilmiştir.",
  ]
    .filter(Boolean)
    .join("\n");

  return sendMail({
    subject: `Yeni bilgi talebi — ${submission.name}`,
    html: layout(
      "Yeni bilgi talebi",
      rows,
      "Bu bildirim sanalanjiyo.tusahastanesi.com iletişim formundan otomatik olarak gönderilmiştir. Kişisel verileri yalnızca talebin değerlendirilmesi amacıyla kullanın.",
    ),
    text,
    replyTo:
      stored.mail.replyToSubmitter && submission.email
        ? submission.email
        : undefined,
  });
}

/** Ayarların doğrulanması için örnek bildirim gönderir. */
export async function sendTestMail(
  override?: Partial<MailSettings> & { password?: string },
): Promise<MailResult> {
  const now = new Date().toLocaleString("tr-TR");

  return sendMail(
    {
      subject: "Test e-postası",
      html: layout(
        "Test e-postası",
        row("Durum", "E-posta ayarları çalışıyor.") + row("Tarih", escapeHtml(now)),
        "Bu ileti yönetim panelindeki “Test e-postası gönder” düğmesiyle oluşturulmuştur.",
      ),
      text: `E-posta ayarları çalışıyor.\nTarih: ${now}\n\nBu ileti yönetim panelindeki test düğmesiyle gönderilmiştir.`,
    },
    override,
  );
}
