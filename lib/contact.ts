export type ContactSource = "cta-banner" | "contact-section";

export type UtmParams = Partial<
  Record<
    "utm_source" | "utm_medium" | "utm_campaign" | "utm_content" | "utm_term",
    string
  >
>;

export type ContactPayload = {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  kvkkAccepted: boolean;
  source: ContactSource;
} & UtmParams;

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

const STORAGE_KEY = "tusa_utm";

/** URL'de UTM parametresi varsa oturum boyunca saklar. */
export function captureUtmParams(): void {
  if (typeof window === "undefined") return;

  try {
    const params = new URLSearchParams(window.location.search);
    const found: UtmParams = {};

    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) found[key] = value.slice(0, 180);
    }

    if (Object.keys(found).length > 0) {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found));
    }
  } catch {
    /* sessionStorage kullanılamıyorsa sessizce geç */
  }
}

export function readUtmParams(): UtmParams {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UtmParams) : {};
  } catch {
    return {};
  }
}

/* ------------------------------------------------------------------ doğrulama */

export function isValidName(value: string): boolean {
  return value.trim().length >= 3 && value.trim().includes(" ");
}

export function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 13;
}

export function isValidEmail(value: string): boolean {
  if (!value.trim()) return true; // isteğe bağlı alan
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

/** 0555 123 45 67 / 555 123 45 67 biçiminde canlı maskeleme. */
export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  const groups = digits.startsWith("0") ? [4, 3, 2, 2] : [3, 3, 2, 2];

  const parts: string[] = [];
  let index = 0;
  for (const size of groups) {
    const part = digits.slice(index, index + size);
    if (!part) break;
    parts.push(part);
    index += size;
  }

  return parts.join(" ");
}

/* -------------------------------------------------------------------- gönderim */

export type SubmitResult = { ok: true } | { ok: false; message: string };

/**
 * Formları tek bir noktadan gönderir. Uç nokta adresi
 * `NEXT_PUBLIC_CONTACT_ENDPOINT` ile tanımlanır; tanımlı değilse talep
 * yerelde kabul edilir ve gereksiz ağ isteği yapılmaz.
 */
export async function submitContact(
  payload: ContactPayload,
): Promise<SubmitResult> {
  const body: ContactPayload = { ...payload, ...readUtmParams() };
  const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;

  if (endpoint) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        return {
          ok: false,
          message:
            "Talebiniz şu anda iletilemedi. Lütfen tekrar deneyin veya bizi arayın.",
        };
      }

      return { ok: true };
    } catch {
      return {
        ok: false,
        message:
          "Bağlantı kurulamadı. Lütfen tekrar deneyin veya bizi arayın.",
      };
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 550));
  return { ok: true };
}
