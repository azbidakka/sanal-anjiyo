/** Ortama göre değişmeyen, panelden düzenlenmeyen sabitler. */
export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://sanalanjiyo.tusahastanesi.com",
  locale: "tr_TR",
  ogImage: "/images/og.jpg",
  logo: "/images/brand/tusa-logo.png",
  logoWhite: "/images/brand/tusa-logo-white.png",

  /**
   * Google Tag Manager konteyner kimliği.
   * Depoda sabit tutulur: NEXT_PUBLIC_* değişkenleri derleme anında gömüldüğü
   * için, ortam dosyası bulunmayan bir makinede derlenirse sessizce devre dışı
   * kalırdı. Boş bırakılırsa GTM hiç yüklenmez.
   */
  gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-K9QV37M3",
} as const;

/**
 * Panelden yüklenen görsellerin servis edildiği yol.
 * Dosyalar content/uploads altında tutulur ve /uploads/... üzerinden sunulur;
 * böylece yeni yüklenen görseller sunucuyu yeniden başlatmadan yayına girer.
 */
export const UPLOAD_DIR_URL = "/uploads";
