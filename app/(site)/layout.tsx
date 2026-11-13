import { GoogleTagManager } from "@next/third-parties/google";
import { siteConfig } from "@/lib/site-config";

/**
 * Herkese açık sayfaların düzeni.
 *
 * Google Tag Manager yalnızca burada yüklenir; yönetim paneli bu grubun
 * dışında kaldığı için panel görüntülemeleri analitiğe karışmaz ve
 * etiket yöneticisi oturum açılmış alanda çalışmaz.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {siteConfig.gtmId ? (
        <>
          <GoogleTagManager gtmId={siteConfig.gtmId} />
          {/* JavaScript kapalıyken GTM'in kendi kurulum yönergesindeki yedek */}
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${siteConfig.gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        </>
      ) : null}

      {children}
    </>
  );
}
