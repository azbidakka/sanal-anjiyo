/** Ortama göre değişmeyen, panelden düzenlenmeyen sabitler. */
export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://sanalanjiyo.tusahastanesi.com",
  locale: "tr_TR",
  ogImage: "/images/og.jpg",
  logo: "/images/brand/tusa-logo.png",
  logoWhite: "/images/brand/tusa-logo-white.png",
} as const;

/**
 * Panelden yüklenen görsellerin servis edildiği yol.
 * Dosyalar content/uploads altında tutulur ve /uploads/... üzerinden sunulur;
 * böylece yeni yüklenen görseller sunucuyu yeniden başlatmadan yayına girer.
 */
export const UPLOAD_DIR_URL = "/uploads";
