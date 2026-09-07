# TUSA Hastanesi — Sanal Anjiyo

`sanalanjiyo.tusahastanesi.com` için Sanal Anjiyo (Koroner BT Anjiyografi)
hizmetini anlatan tek sayfalık landing page.

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · lucide-react · Poppins

## Kurulum

```bash
npm install
npm run dev
```

http://localhost:3000

## Production

```bash
npm run build
npm start
```

## Yönetim paneli

Sayfadaki tüm metinler, kartlar, hekimler, SSS ve görseller
`http://localhost:3000/admin` adresindeki panelden düzenlenir.

| Bölüm | Ne yapılır |
|---|---|
| **Özet** | Talep sayıları ve sık kullanılan bölümlere kısayollar |
| **İçerik** | 16 bölümün tamamı: metinler, kartlar, tablo satırları, hekimler, SSS, görseller |
| **Görseller** | Yüklenen dosyalar; önizleme, yol kopyalama, kullanılmayanları silme |
| **Talepler** | Formdan gelen kayıtlar; arama, durum filtresi, okundu işaretleme, silme, CSV indirme |
| **Ayarlar** | E-posta bildirimleri, panel şifresi, içerik yedeği al/geri yükle |

Listelerde öğe eklenebilir, silinebilir ve ok tuşlarıyla sırası
değiştirilebilir. Kartlardaki ikonlar hazır listeden seçilir. Görsel alanları
hem dosya yükleyerek hem de yol yazarak doldurulabilir.

**Kaydet'e basıldığında site anında güncellenir** — yeniden derleme veya
sunucu yeniden başlatma gerekmez.

### Giriş bilgileri

`.env.local` dosyasında tanımlıdır:

```bash
ADMIN_USERNAME=...
ADMIN_PASSWORD=...
ADMIN_SESSION_SECRET=...   # rastgele uzun bir dize
```

Şifreyi panelden de değiştirebilirsiniz (Ayarlar → Panel hesabı); bu durumda
yeni şifre `content/settings.json` içinde scrypt özeti olarak saklanır ve
ortam değişkeninin yerine geçer. Oturum, imzalı ve
`httpOnly` bir çerezle 7 gün boyunca korunur. `/admin` dizini `robots.txt`
ile aramaya kapatılmıştır.

### E-posta bildirimleri (Exchange)

Formdan gelen her talep, panelde saklanmanın yanında hastanenin kurumsal
adresine e-posta olarak da iletilir. Ayarlar → E-posta bildirimleri
bölümünden yapılandırılır.

Sunucu tespiti ve doğrulanmış değerler:

| Ayar | Değer |
|---|---|
| Sunucu | `mail.tusahastanesi.com` (Exchange 2010) |
| Port | 587 · STARTTLS |
| TLS | TLS 1.2, geçerli `*.tusahastanesi.com` sertifikası (doğrulama açık) |
| Kimlik doğrulama | STARTTLS sonrası `AUTH LOGIN` |
| Kullanıcı adı | `info@gisbirhastanesi.local` — **e-posta adresi değil, AD oturum açma adı** |
| Gönderen / alıcı | `info@tusahastanesi.com` |

Yalnızca posta kutusu şifresinin panele girilmesi gerekir. Şifre sunucuda
`content/settings.json` içinde **AES-256-GCM ile şifrelenerek** saklanır;
anahtar `ADMIN_SESSION_SECRET` değerinden türetilir. Bu değişken değişirse
şifrenin yeniden girilmesi gerekir.

"Test e-postası gönder" düğmesi önce bağlantıyı doğrular, sonra örnek bir
bildirim yollar; hata durumunda nedenini Türkçe açıklar (kimlik doğrulama,
zaman aşımı, sertifika, relay izni).

**Kullanıcı adı hakkında:** mail alan adı `tusahastanesi.com`, Active Directory
alan adı ise `gisbirhastanesi.local`. Exchange `AUTH LOGIN` sırasında SMTP
adresini değil oturum açma adını ister; bu yüzden `info@tusahastanesi.com`
ile `535 5.7.3` hatası alınır. Doğru değer `info@gisbirhastanesi.local`
(alternatifi `GISBIRHASTANESI\kullanici`).

**Dayanıklılık:** bildirim, Next.js `after()` ile yanıt gönderildikten sonra
iletilir. Ziyaretçi SMTP turunu beklemez (form yanıtı ~0,3 sn) ve posta
sunucusundaki bir aksaklık formu yavaşlatmaz. Gönderim başarısız olsa bile
talep panele kaydedilir, ziyaretçiye hata gösterilmez, neden sunucu
günlüğüne yazılır.

### Veri nerede duruyor?

```text
content/site-content.json   # sayfanın tüm içeriği (yedeklenmeli)
content/settings.json       # e-posta ve hesap ayarları — şifreli, git'e girmez
content/submissions.json    # form talepleri — kişisel veri, git'e girmez
content/uploads/            # panelden yüklenen görseller
```

`content/` klasörü sunucuda **yazılabilir ve kalıcı** olmalıdır. Deploy
sırasında bu klasör silinmemeli; farklı bir konum kullanmak isterseniz
`CONTENT_DIR` ortam değişkeniyle yol verebilirsiniz.

Yüklenen görseller `public/` yerine `content/uploads` altında tutulur ve
`/uploads/...` adresinden servis edilir; böylece yeni yüklenen bir görsel
sunucu yeniden başlatılmadan yayına girer.

## Proje yapısı

```text
app/
  layout.tsx              # metadata, Poppins, JSON-LD (MedicalWebPage · Hospital · FAQPage)
  page.tsx                # sayfa kompozisyonu — içeriği content/'ten alır
  globals.css             # tasarım sistemi (renk, tipografi, utility'ler)
  robots.ts · sitemap.ts
  kvkk · gizlilik · cerez-politikasi · aydinlatma-metni   # yasal sayfalar
  icon.png · apple-icon.png
  admin/
    actions.ts            # server action'lar (giriş, kayıt, yükleme, talepler)
    (auth)/login          # panel girişi
    (panel)/              # korumalı panel: özet, icerik, talepler
  api/contact/route.ts    # form talebi kaydı (hız sınırlı)
  uploads/[file]/route.ts # panelden yüklenen görsellerin servisi
components/
  Header · Hero · TrustStrip · WhatIsSection · CandidatesSection
  ProcessSection · ComparisonSection · PreparationSection
  CTABanner + CTABannerForm · HospitalSection · DoctorsSection
  CoronaryGraphic · TechSection · FAQ
  ContactSection + ContactForm · LocationSection · Footer · MobileCTA
  SectionHeading · ScrollReveal · LegalPage · DynamicIcon
  admin/                  # AdminNav · LoginForm · SectionEditor · ImageField · IconSelect
content/
  site-content.json       # sayfanın tüm düzenlenebilir içeriği
lib/
  content.ts              # içerik okuma/yazma, talep kaydı
  content-types.ts        # içerik tip tanımları
  admin-schema.ts         # panelin hangi alanı nasıl göstereceği
  auth.ts                 # oturum imzalama ve doğrulama
  icons.ts                # panelden seçilebilen ikon listesi
  contact.ts              # form doğrulama, UTM saklama, submit helper
  site-config.ts          # domain, logo gibi sabitler
public/images/            # hero, ct-room, cta-banner, hospital, og, doctors, brand
```

## İçerik ve görsel notları

- Hekim fotoğrafları, unvan/branş bilgileri ve TUSA logosu doğrudan
  `tusahastanesi.com` üzerinden alınmış, WebP/PNG olarak `public/images/`
  altına indirilmiştir. Hotlink kullanılmaz.
- Hero görseli TUSA'nın Sanal Anjiyo kurumsal görsel setinden alınan
  koroner BT / 3B kalp kompozisyonudur.
- CTA banner görseli tek noktadan değiştirilebilir:
  `components/CTABanner.tsx` içindeki `CTA_BANNER_IMAGE` sabiti.
  Aynı dosya adıyla (`public/images/cta-banner.webp`) değiştirmek yeterlidir.

## Form entegrasyonu

Her iki form da `lib/contact.ts` içindeki `submitContact()` fonksiyonunu
kullanır. Hedef uç nokta `NEXT_PUBLIC_CONTACT_ENDPOINT` ortam değişkeni ile
tanımlanır:

```bash
# .env.local
NEXT_PUBLIC_CONTACT_ENDPOINT=/api/contact
```

Uç nokta `app/api/contact/route.ts` içinde hazırdır: talebi doğrular,
IP başına dakikada 5 istekle sınırlar ve `content/submissions.json`
dosyasına yazar. Kayıtlar panelin **Talepler** bölümünde görünür.

Değişken tanımlı değilse ağ isteği yapılmaz ve talep yerelde başarılı kabul
edilir (form yine de çalışır, ancak kayıt tutulmaz).

Payload:

```ts
{ name, phone, email?, message?, kvkkAccepted, source, utm_* }
```

`source` değeri: `cta-banner` (banner mini formu) veya `contact-section`
(alt iletişim formu). URL'deki UTM parametreleri oturum boyunca saklanır ve
payload'a eklenir.

## Analytics

CTA'lar `data-cta` attribute'u taşır (`hero-info`, `hero-phone`,
`mobile-phone`, `banner-submit`, `contact-submit` vb.). GTM ile doğrudan
tetikleyici tanımlanabilir.

## Deploy notu (DigitalOcean / Ubuntu)

- Node 22
- `npm ci && npm run build`
- PM2 veya systemd ile `npm start` (varsayılan port 3000)
- Nginx reverse proxy → `sanalanjiyo.tusahastanesi.com`
- Let's Encrypt ile TLS
- Sunucuda `.env.local` tanımlı olmalı:
  `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`,
  `NEXT_PUBLIC_CONTACT_ENDPOINT=/api/contact`,
  `NEXT_PUBLIC_SITE_URL=https://sanalanjiyo.tusahastanesi.com`
- `content/` klasörü yazılabilir olmalı ve deploy'lar arasında korunmalı;
  düzenli yedeklenmesi önerilir
- Sunucudan `mail.tusahastanesi.com:587` erişimi açık olmalı (güvenlik duvarı)

### Yayın öncesi kontrol listesi

1. **HTTPS zorunlu.** Oturum çerezi üretimde `secure` işaretiyle yazılır;
   site düz HTTP üzerinden yayınlanırsa panele giriş yapılamaz.
2. **`ADMIN_SESSION_SECRET` ile `content/settings.json` birbirine bağlıdır.**
   E-posta şifresi bu anahtardan türetilen bir anahtarla şifrelenir. Sunucuda
   farklı bir secret kullanacaksanız `settings.json` dosyasını kopyalamayın;
   panelden e-posta şifresini yeniden girin.
3. Panel şifresini değiştirin (Ayarlar → Panel hesabı).
4. Ayarlar → E-posta bölümünden "Test e-postası gönder" ile doğrulayın.
5. `content/` için düzenli yedek (cron ile `site-content.json` kopyası).

## Yasal uyarı

Sayfadaki tıbbi içerik genel bilgilendirme amaçlıdır; sonuç garantisi veya
kesin tanı vaadi içermez. İçerik değişikliklerinde bu yaklaşım korunmalıdır.
