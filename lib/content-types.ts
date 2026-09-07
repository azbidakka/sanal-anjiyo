/**
 * Sayfadaki tüm düzenlenebilir içeriğin tip tanımları.
 * Tek kaynak: content/site-content.json
 */

export type NavLink = { label: string; href: string };

export type IconCard = {
  icon: string;
  title: string;
  text: string;
};

export type NumberedCard = IconCard & { number: string };

export type Step = { number: string; title: string; text: string };

export type ComparisonRow = {
  feature: string;
  virtual: string;
  classic: string;
};

export type Doctor = {
  id: string;
  title: string;
  name: string;
  specialty: string;
  image: string;
  profileUrl: string;
  description: string;
};

export type FaqItem = { id: string; question: string; answer: string };

export type StatItem = { key: string; value: string };

export type LegalDocument = {
  id: string;
  title: string;
  updatedAt: string;
  body: string;
};

export type SiteContent = {
  meta: {
    title: string;
    description: string;
    keywords: string[];
  };
  contact: {
    hospitalName: string;
    phoneDisplay: string;
    phoneE164: string;
    addressStreet: string;
    addressDistrict: string;
    addressCity: string;
    mapsQuery: string;
    corporateUrl: string;
  };
  header: {
    ctaLabel: string;
    nav: NavLink[];
  };
  hero: {
    label: string;
    title: string;
    description: string;
    ctaPrimary: string;
    trustLine: string;
    image: string;
    imageAlt: string;
    badgeTitle: string;
    badgeText: string;
  };
  trustStrip: { items: IconCard[] };
  whatIs: {
    label: string;
    title: string;
    paragraph1: string;
    paragraph2: string;
    note: string;
    cards: NumberedCard[];
  };
  candidates: {
    label: string;
    title: string;
    intro: string;
    cards: IconCard[];
    footnote: string;
  };
  process: {
    label: string;
    title: string;
    image: string;
    imageAlt: string;
    steps: Step[];
  };
  comparison: {
    label: string;
    title: string;
    columnFeature: string;
    columnVirtual: string;
    columnClassic: string;
    rows: ComparisonRow[];
    note: string;
  };
  preparation: {
    label: string;
    title: string;
    items: IconCard[];
    note: string;
  };
  ctaBanner: {
    eyebrow: string;
    title: string;
    text: string;
    image: string;
    imageAlt: string;
    formTitle: string;
    formText: string;
    submitLabel: string;
  };
  hospital: {
    label: string;
    title: string;
    intro: string;
    image: string;
    imageAlt: string;
    items: IconCard[];
  };
  doctors: {
    label: string;
    title: string;
    intro: string;
    profileLabel: string;
    infoLabel: string;
    list: Doctor[];
  };
  tech: {
    label: string;
    title: string;
    text: string;
    image: string;
    imageAlt: string;
    stats: StatItem[];
  };
  faq: {
    label: string;
    title: string;
    items: FaqItem[];
  };
  contactSection: {
    label: string;
    title: string;
    intro: string;
    appointmentLabel: string;
    appointmentText: string;
    kvkkLabel: string;
    formNote: string;
    submitLabel: string;
    successTitle: string;
    successText: string;
  };
  location: {
    label: string;
    callLabel: string;
    directionsLabel: string;
    mapButtonLabel: string;
  };
  legal: {
    pages: LegalDocument[];
  };
  footer: {
    tagline: string;
    pagesTitle: string;
    legalTitle: string;
    legalLinks: NavLink[];
    disclaimer: string;
    copyright: string;
  };
};

/** Formdan gelen tek bir iletişim talebi. */
export type Submission = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  source: string;
  read: boolean;
  utm?: Record<string, string>;
};
