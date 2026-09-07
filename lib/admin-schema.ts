import type { SiteContent } from "@/lib/content-types";

export type AdminFieldType =
  | "text"
  | "textarea"
  | "image"
  | "icon"
  | "url"
  | "lines";

export type AdminField = {
  name: string;
  label: string;
  type: AdminFieldType;
  help?: string;
  rows?: number;
};

export type AdminList = {
  name: string;
  label: string;
  itemLabel: string;
  addLabel: string;
  /** Listedeki bir öğenin başlığında gösterilecek alan. */
  titleField: string;
  fields: AdminField[];
};

export type AdminSection = {
  id: keyof SiteContent;
  group: string;
  title: string;
  description: string;
  fields: AdminField[];
  lists: AdminList[];
};

const iconCardFields: AdminField[] = [
  { name: "icon", label: "İkon", type: "icon" },
  { name: "title", label: "Başlık", type: "text" },
  { name: "text", label: "Açıklama", type: "textarea", rows: 3 },
];

export const adminSections: AdminSection[] = [
  {
    id: "meta",
    group: "Genel",
    title: "SEO ve sayfa bilgileri",
    description:
      "Arama sonuçlarında ve paylaşımlarda görünen başlık, açıklama ve anahtar kelimeler.",
    fields: [
      { name: "title", label: "Sayfa başlığı (title)", type: "text" },
      {
        name: "description",
        label: "Meta açıklama",
        type: "textarea",
        rows: 3,
        help: "Google sonuçlarında görünen özet. 150–160 karakter önerilir.",
      },
      {
        name: "keywords",
        label: "Anahtar kelimeler",
        type: "lines",
        help: "Her satıra bir kelime öbeği yazın.",
      },
    ],
    lists: [],
  },
  {
    id: "contact",
    group: "Genel",
    title: "İletişim bilgileri",
    description:
      "Telefon, adres ve kurum bilgileri; sayfadaki tüm arama bağlantılarında kullanılır.",
    fields: [
      { name: "hospitalName", label: "Kurum adı", type: "text" },
      {
        name: "phoneDisplay",
        label: "Telefon (görünen)",
        type: "text",
        help: "Örn. 0216 581 42 00",
      },
      {
        name: "phoneE164",
        label: "Telefon (arama bağlantısı)",
        type: "text",
        help: "Ülke kodlu, boşluksuz. Örn. +902165814200",
      },
      { name: "addressStreet", label: "Adres — sokak/no", type: "text" },
      { name: "addressDistrict", label: "İlçe", type: "text" },
      { name: "addressCity", label: "İl", type: "text" },
      {
        name: "mapsQuery",
        label: "Google Haritalar araması",
        type: "text",
        help: "Harita ve yol tarifi bu metinle açılır.",
      },
      { name: "corporateUrl", label: "Kurumsal site adresi", type: "url" },
    ],
    lists: [],
  },
  {
    id: "header",
    group: "Genel",
    title: "Üst menü",
    description: "Menü bağlantıları ve sağ üstteki buton.",
    fields: [{ name: "ctaLabel", label: "Buton metni", type: "text" }],
    lists: [
      {
        name: "nav",
        label: "Menü bağlantıları",
        itemLabel: "Bağlantı",
        addLabel: "Bağlantı ekle",
        titleField: "label",
        fields: [
          { name: "label", label: "Etiket", type: "text" },
          {
            name: "href",
            label: "Hedef",
            type: "text",
            help: "Sayfa içi bağlantı için # ile başlayın. Örn. #surec",
          },
        ],
      },
    ],
  },
  {
    id: "hero",
    group: "Sayfa bölümleri",
    title: "Hero (üst alan)",
    description: "Sayfanın açılışındaki ana başlık, açıklama ve görsel.",
    fields: [
      { name: "label", label: "Üst etiket", type: "text" },
      {
        name: "title",
        label: "Ana başlık (H1)",
        type: "textarea",
        rows: 3,
        help: "Vurgulamak istediğiniz bölümü yıldız arasına alın: *örnek metin*. Bu kısım alt satırda italik yeşil yazıyla gösterilir.",
      },
      { name: "description", label: "Açıklama", type: "textarea", rows: 5 },
      { name: "ctaPrimary", label: "Birincil buton metni", type: "text" },
      { name: "trustLine", label: "Alt güven satırı", type: "text" },
      { name: "image", label: "Görsel", type: "image" },
      { name: "imageAlt", label: "Görsel alternatif metni", type: "textarea", rows: 2 },
      { name: "badgeTitle", label: "Rozet başlığı", type: "text" },
      { name: "badgeText", label: "Rozet metni", type: "text" },
    ],
    lists: [],
  },
  {
    id: "trustStrip",
    group: "Sayfa bölümleri",
    title: "Bilgi şeridi",
    description: "Hero altındaki dört kısa madde.",
    fields: [],
    lists: [
      {
        name: "items",
        label: "Maddeler",
        itemLabel: "Madde",
        addLabel: "Madde ekle",
        titleField: "title",
        fields: [
          { name: "icon", label: "İkon", type: "icon" },
          { name: "title", label: "Metin", type: "text" },
        ],
      },
    ],
  },
  {
    id: "whatIs",
    group: "Sayfa bölümleri",
    title: "01 · Sanal Anjiyo nedir?",
    description: "Tanım paragrafları, uyarı kutusu ve dört özellik kartı.",
    fields: [
      { name: "label", label: "Bölüm etiketi", type: "text" },
      {
        name: "title",
        label: "Başlık (H2)",
        type: "textarea",
        rows: 3,
        help: "Vurgulamak istediğiniz bölümü yıldız arasına alın: *örnek metin*. Bu kısım alt satırda italik yeşil yazıyla gösterilir.",
      },
      { name: "paragraph1", label: "Birinci paragraf", type: "textarea", rows: 5 },
      { name: "paragraph2", label: "İkinci paragraf", type: "textarea", rows: 5 },
      { name: "note", label: "Uyarı kutusu", type: "textarea", rows: 4 },
    ],
    lists: [
      {
        name: "cards",
        label: "Özellik kartları",
        itemLabel: "Kart",
        addLabel: "Kart ekle",
        titleField: "title",
        fields: [
          { name: "number", label: "Numara", type: "text" },
          ...iconCardFields,
        ],
      },
    ],
  },
  {
    id: "candidates",
    group: "Sayfa bölümleri",
    title: "02 · Kimler için?",
    description: "Değerlendirme başlıkları ve kartlar.",
    fields: [
      { name: "label", label: "Bölüm etiketi", type: "text" },
      {
        name: "title",
        label: "Başlık (H2)",
        type: "textarea",
        rows: 3,
        help: "Vurgulamak istediğiniz bölümü yıldız arasına alın: *örnek metin*. Bu kısım alt satırda italik yeşil yazıyla gösterilir.",
      },
      { name: "intro", label: "Giriş metni", type: "textarea", rows: 4 },
      { name: "footnote", label: "Alt not", type: "textarea", rows: 3 },
    ],
    lists: [
      {
        name: "cards",
        label: "Kartlar",
        itemLabel: "Kart",
        addLabel: "Kart ekle",
        titleField: "title",
        fields: iconCardFields,
      },
    ],
  },
  {
    id: "process",
    group: "Sayfa bölümleri",
    title: "03 · Süreç",
    description: "Dört aşamalı süreç anlatımı ve bölüm görseli.",
    fields: [
      { name: "label", label: "Bölüm etiketi", type: "text" },
      {
        name: "title",
        label: "Başlık (H2)",
        type: "textarea",
        rows: 2,
        help: "Vurgulamak istediğiniz bölümü yıldız arasına alın: *örnek metin*. Bu kısım alt satırda italik yeşil yazıyla gösterilir.",
      },
      { name: "image", label: "Görsel", type: "image" },
      { name: "imageAlt", label: "Görsel alternatif metni", type: "textarea", rows: 2 },
    ],
    lists: [
      {
        name: "steps",
        label: "Aşamalar",
        itemLabel: "Aşama",
        addLabel: "Aşama ekle",
        titleField: "title",
        fields: [
          { name: "number", label: "Numara", type: "text" },
          { name: "title", label: "Başlık", type: "text" },
          { name: "text", label: "Açıklama", type: "textarea", rows: 4 },
        ],
      },
    ],
  },
  {
    id: "comparison",
    group: "Sayfa bölümleri",
    title: "04 · Karşılaştırma",
    description: "Sanal Anjiyo ile klasik anjiyografi karşılaştırma tablosu.",
    fields: [
      { name: "label", label: "Bölüm etiketi", type: "text" },
      {
        name: "title",
        label: "Başlık (H2)",
        type: "textarea",
        rows: 3,
        help: "Vurgulamak istediğiniz bölümü yıldız arasına alın: *örnek metin*. Bu kısım alt satırda italik yeşil yazıyla gösterilir.",
      },
      { name: "columnFeature", label: "1. sütun başlığı", type: "text" },
      { name: "columnVirtual", label: "2. sütun başlığı", type: "text" },
      { name: "columnClassic", label: "3. sütun başlığı", type: "text" },
      { name: "note", label: "Tablo altı açıklama", type: "textarea", rows: 4 },
    ],
    lists: [
      {
        name: "rows",
        label: "Tablo satırları",
        itemLabel: "Satır",
        addLabel: "Satır ekle",
        titleField: "feature",
        fields: [
          { name: "feature", label: "Özellik", type: "text" },
          { name: "virtual", label: "Sanal Anjiyo / Koroner BT", type: "textarea", rows: 2 },
          { name: "classic", label: "Klasik anjiyografi", type: "textarea", rows: 2 },
        ],
      },
    ],
  },
  {
    id: "preparation",
    group: "Sayfa bölümleri",
    title: "05 · Hazırlık",
    description: "İşlem öncesi dikkat edilecekler.",
    fields: [
      { name: "label", label: "Bölüm etiketi", type: "text" },
      {
        name: "title",
        label: "Başlık (H2)",
        type: "textarea",
        rows: 2,
        help: "Vurgulamak istediğiniz bölümü yıldız arasına alın: *örnek metin*. Bu kısım alt satırda italik yeşil yazıyla gösterilir.",
      },
      { name: "note", label: "Alt not", type: "textarea", rows: 3 },
    ],
    lists: [
      {
        name: "items",
        label: "Maddeler",
        itemLabel: "Madde",
        addLabel: "Madde ekle",
        titleField: "title",
        fields: iconCardFields,
      },
    ],
  },
  {
    id: "ctaBanner",
    group: "Sayfa bölümleri",
    title: "CTA banner",
    description: "Sayfa ortasındaki görselli çağrı alanı ve mini form metinleri.",
    fields: [
      { name: "eyebrow", label: "Üst etiket", type: "text" },
      {
        name: "title",
        label: "Başlık",
        type: "textarea",
        rows: 3,
        help: "Vurgulamak istediğiniz bölümü yıldız arasına alın: *örnek metin*. Bu kısım alt satırda italik yeşil yazıyla gösterilir.",
      },
      { name: "text", label: "Açıklama", type: "textarea", rows: 4 },
      { name: "image", label: "Arka plan görseli", type: "image" },
      { name: "imageAlt", label: "Görsel alternatif metni", type: "textarea", rows: 2 },
      { name: "formTitle", label: "Form başlığı", type: "text" },
      { name: "formText", label: "Form açıklaması", type: "textarea", rows: 3 },
      { name: "submitLabel", label: "Buton metni", type: "text" },
    ],
    lists: [],
  },
  {
    id: "hospital",
    group: "Sayfa bölümleri",
    title: "06 · Hastane",
    description: "Hastane anlatımı, görseli ve dört madde.",
    fields: [
      { name: "label", label: "Bölüm etiketi", type: "text" },
      {
        name: "title",
        label: "Başlık (H2)",
        type: "textarea",
        rows: 3,
        help: "Vurgulamak istediğiniz bölümü yıldız arasına alın: *örnek metin*. Bu kısım alt satırda italik yeşil yazıyla gösterilir.",
      },
      { name: "intro", label: "Giriş metni", type: "textarea", rows: 5 },
      { name: "image", label: "Görsel", type: "image" },
      { name: "imageAlt", label: "Görsel alternatif metni", type: "textarea", rows: 2 },
    ],
    lists: [
      {
        name: "items",
        label: "Maddeler",
        itemLabel: "Madde",
        addLabel: "Madde ekle",
        titleField: "title",
        fields: iconCardFields,
      },
    ],
  },
  {
    id: "doctors",
    group: "Sayfa bölümleri",
    title: "07 · Hekimler",
    description:
      "Hekim kartları. Fotoğraf ve unvan bilgilerini kurumsal siteyle uyumlu tutun.",
    fields: [
      { name: "label", label: "Bölüm etiketi", type: "text" },
      {
        name: "title",
        label: "Başlık (H2)",
        type: "textarea",
        rows: 3,
        help: "Vurgulamak istediğiniz bölümü yıldız arasına alın: *örnek metin*. Bu kısım alt satırda italik yeşil yazıyla gösterilir.",
      },
      { name: "intro", label: "Giriş metni", type: "textarea", rows: 5 },
      { name: "profileLabel", label: "Profil bağlantısı metni", type: "text" },
      { name: "infoLabel", label: "İkincil bağlantı metni", type: "text" },
    ],
    lists: [
      {
        name: "list",
        label: "Hekimler",
        itemLabel: "Hekim",
        addLabel: "Hekim ekle",
        titleField: "name",
        fields: [
          { name: "title", label: "Unvan", type: "text", help: "Örn. Uzm. Dr." },
          { name: "name", label: "Ad Soyad", type: "text" },
          { name: "specialty", label: "Branş", type: "text" },
          {
            name: "image",
            label: "Fotoğraf",
            type: "image",
            help: "4:5 dikey oran önerilir.",
          },
          { name: "profileUrl", label: "Profil bağlantısı", type: "url" },
          { name: "description", label: "Kısa açıklama", type: "textarea", rows: 3 },
        ],
      },
    ],
  },
  {
    id: "tech",
    group: "Sayfa bölümleri",
    title: "Teknoloji vurgusu",
    description: "Koyu yeşil bölümdeki başlık, metin ve üç kutu.",
    fields: [
      { name: "label", label: "Bölüm etiketi", type: "text" },
      {
        name: "title",
        label: "Başlık (H2)",
        type: "textarea",
        rows: 3,
        help: "Vurgulamak istediğiniz bölümü yıldız arasına alın: *örnek metin*. Bu kısım alt satırda italik yeşil yazıyla gösterilir.",
      },
      { name: "text", label: "Açıklama", type: "textarea", rows: 5 },
      { name: "image", label: "Görsel", type: "image" },
      {
        name: "imageAlt",
        label: "Görsel alternatif metni",
        type: "textarea",
        rows: 2,
      },
    ],
    lists: [
      {
        name: "stats",
        label: "Kutular",
        itemLabel: "Kutu",
        addLabel: "Kutu ekle",
        titleField: "key",
        fields: [
          { name: "key", label: "Üst etiket", type: "text" },
          { name: "value", label: "Değer", type: "text" },
        ],
      },
    ],
  },
  {
    id: "faq",
    group: "Sayfa bölümleri",
    title: "08 · Sık sorulan sorular",
    description:
      "Buradaki sorular hem sayfada hem de Google için yapılandırılmış veride kullanılır.",
    fields: [
      { name: "label", label: "Bölüm etiketi", type: "text" },
      {
        name: "title",
        label: "Başlık (H2)",
        type: "textarea",
        rows: 2,
        help: "Vurgulamak istediğiniz bölümü yıldız arasına alın: *örnek metin*. Bu kısım alt satırda italik yeşil yazıyla gösterilir.",
      },
    ],
    lists: [
      {
        name: "items",
        label: "Sorular",
        itemLabel: "Soru",
        addLabel: "Soru ekle",
        titleField: "question",
        fields: [
          { name: "question", label: "Soru", type: "textarea", rows: 2 },
          { name: "answer", label: "Cevap", type: "textarea", rows: 5 },
        ],
      },
    ],
  },
  {
    id: "contactSection",
    group: "Sayfa bölümleri",
    title: "09 · İletişim bölümü",
    description: "İletişim formu çevresindeki tüm metinler.",
    fields: [
      { name: "label", label: "Bölüm etiketi", type: "text" },
      {
        name: "title",
        label: "Başlık (H2)",
        type: "textarea",
        rows: 3,
        help: "Vurgulamak istediğiniz bölümü yıldız arasına alın: *örnek metin*. Bu kısım alt satırda italik yeşil yazıyla gösterilir.",
      },
      { name: "intro", label: "Giriş metni", type: "textarea", rows: 4 },
      { name: "appointmentLabel", label: "Randevu kutusu etiketi", type: "text" },
      { name: "appointmentText", label: "Randevu kutusu metni", type: "textarea", rows: 3 },
      {
        name: "kvkkLabel",
        label: "KVKK onay metni",
        type: "textarea",
        rows: 3,
        help: "Metnin sonuna otomatik olarak “Aydınlatma Metni’ni okudum.” bağlantısı eklenir.",
      },
      { name: "formNote", label: "Form altı uyarı", type: "textarea", rows: 4 },
      { name: "submitLabel", label: "Gönder butonu", type: "text" },
      { name: "successTitle", label: "Başarı başlığı", type: "text" },
      { name: "successText", label: "Başarı metni", type: "textarea", rows: 3 },
    ],
    lists: [],
  },
  {
    id: "location",
    group: "Sayfa bölümleri",
    title: "Konum bölümü",
    description: "Harita alanındaki etiket ve buton metinleri.",
    fields: [
      { name: "label", label: "Bölüm etiketi", type: "text" },
      { name: "callLabel", label: "Arama butonu", type: "text" },
      { name: "directionsLabel", label: "Yol tarifi butonu", type: "text" },
      { name: "mapButtonLabel", label: "Haritayı göster butonu", type: "text" },
    ],
    lists: [],
  },
  {
    id: "legal",
    group: "Alt bilgi",
    title: "Yasal sayfalar",
    description:
      "KVKK, gizlilik, çerez ve aydınlatma metinleri. Kimlik alanı sayfa adresini belirler; değiştirmeyin.",
    fields: [],
    lists: [
      {
        name: "pages",
        label: "Sayfalar",
        itemLabel: "Sayfa",
        addLabel: "Sayfa ekle",
        titleField: "title",
        fields: [
          {
            name: "id",
            label: "Adres (slug)",
            type: "text",
            help: "Sayfa /kvkk gibi bu değerle açılır. Mevcut sayfalarda değiştirmeyin.",
          },
          { name: "title", label: "Başlık", type: "text" },
          { name: "updatedAt", label: "Son güncelleme", type: "text" },
          {
            name: "body",
            label: "Metin",
            type: "textarea",
            rows: 22,
            help: "Alt başlık için satırın başına ## yazın, madde için - kullanın. Bağlantı: [metin](/adres). Paragrafları boş satırla ayırın.",
          },
        ],
      },
    ],
  },
  {
    id: "footer",
    group: "Alt bilgi",
    title: "Footer",
    description: "Alt bilgi metinleri ve yasal sayfa bağlantıları.",
    fields: [
      { name: "tagline", label: "Kurum açıklaması", type: "textarea", rows: 3 },
      { name: "pagesTitle", label: "1. sütun başlığı", type: "text" },
      { name: "legalTitle", label: "2. sütun başlığı", type: "text" },
      { name: "disclaimer", label: "Yasal uyarı", type: "textarea", rows: 3 },
      { name: "copyright", label: "Telif satırı", type: "text" },
    ],
    lists: [
      {
        name: "legalLinks",
        label: "Yasal bağlantılar",
        itemLabel: "Bağlantı",
        addLabel: "Bağlantı ekle",
        titleField: "label",
        fields: [
          { name: "label", label: "Etiket", type: "text" },
          { name: "href", label: "Adres", type: "text" },
        ],
      },
    ],
  },
];

export function findSection(id: string): AdminSection | undefined {
  return adminSections.find((section) => section.id === id);
}

export const sectionGroups = Array.from(
  new Set(adminSections.map((section) => section.group)),
);
