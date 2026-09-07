import { after, NextResponse } from "next/server";
import { addSubmission } from "@/lib/content";
import { sendSubmissionNotification } from "@/lib/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** IP başına basit hız sınırı (tek sunucu için yeterli). */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);

  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }

  recent.push(now);
  hits.set(ip, recent);

  // Bellek büyümesin diye eski kayıtlar aralıklı temizlenir.
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((time) => now - time > WINDOW_MS)) hits.delete(key);
    }
  }

  return false;
}

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Çok fazla deneme yapıldı. Lütfen biraz sonra tekrar deneyin." },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const name = clean(body.name, 120);
  const phone = clean(body.phone, 30);
  const email = clean(body.email, 160);
  const message = clean(body.message, 2000);
  const source = clean(body.source, 40) || "bilinmiyor";

  if (name.length < 3 || phone.replace(/\D/g, "").length < 10) {
    return NextResponse.json(
      { error: "Ad soyad ve telefon bilgisi gereklidir." },
      { status: 400 },
    );
  }

  if (body.kvkkAccepted !== true) {
    return NextResponse.json(
      { error: "Aydınlatma metni onayı gereklidir." },
      { status: 400 },
    );
  }

  const utm: Record<string, string> = {};
  for (const key of [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ]) {
    const value = clean(body[key], 180);
    if (value) utm[key] = value;
  }

  let submission;
  try {
    submission = await addSubmission({
      name,
      phone,
      email: email || undefined,
      message: message || undefined,
      source,
      utm: Object.keys(utm).length > 0 ? utm : undefined,
    });
  } catch {
    return NextResponse.json(
      { error: "Talep kaydedilemedi. Lütfen bizi arayın." },
      { status: 500 },
    );
  }

  // Bildirim, yanıt gönderildikten sonra iletilir: ziyaretçi SMTP turunu
  // beklemez ve posta sunucusundaki bir aksaklık formu yavaşlatmaz.
  // Talep her hâlükârda panele kaydedilmiştir.
  after(async () => {
    const notification = await sendSubmissionNotification(submission).catch(
      (error: unknown) => ({
        ok: false as const,
        error: error instanceof Error ? error.message : "bilinmeyen hata",
      }),
    );

    if (!notification.ok) {
      console.warn(
        `[iletisim] ${submission.id} numaralı talep için e-posta gönderilemedi: ${notification.error}`,
      );
    }
  });

  return NextResponse.json({ ok: true });
}
