import CandidatesSection from "@/components/CandidatesSection";
import CTABanner from "@/components/CTABanner";
import ComparisonSection from "@/components/ComparisonSection";
import ContactSection from "@/components/ContactSection";
import DoctorsSection from "@/components/DoctorsSection";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HospitalSection from "@/components/HospitalSection";
import LocationSection from "@/components/LocationSection";
import MobileCTA from "@/components/MobileCTA";
import PreparationSection from "@/components/PreparationSection";
import ProcessSection from "@/components/ProcessSection";
import ScrollReveal from "@/components/ScrollReveal";
import TechSection from "@/components/TechSection";
import TrustStrip from "@/components/TrustStrip";
import WhatIsSection from "@/components/WhatIsSection";
import {
  fullAddress,
  getContent,
  mapsDirectionsUrl,
  mapsEmbedUrl,
  phoneHref,
} from "@/lib/content";

export default async function HomePage() {
  const content = await getContent();

  const address = fullAddress(content);
  const tel = phoneHref(content);
  const phoneDisplay = content.contact.phoneDisplay;

  return (
    <>
      <Header
        hospitalName={content.contact.hospitalName}
        nav={content.header.nav}
        ctaLabel={content.header.ctaLabel}
        phoneDisplay={phoneDisplay}
        phoneHref={tel}
      />

      <main>
        <Hero hero={content.hero} phoneDisplay={phoneDisplay} phoneHref={tel} />
        <TrustStrip items={content.trustStrip.items} />
        <WhatIsSection content={content.whatIs} />
        <CandidatesSection content={content.candidates} />
        <ProcessSection content={content.process} />
        <ComparisonSection content={content.comparison} />
        <PreparationSection content={content.preparation} />
        <CTABanner
          content={content.ctaBanner}
          successTitle={content.contactSection.successTitle}
          successText={content.contactSection.successText}
          phoneDisplay={phoneDisplay}
          phoneHref={tel}
        />
        <HospitalSection content={content.hospital} />
        <DoctorsSection content={content.doctors} />
        <TechSection content={content.tech} />
        <FAQ content={content.faq} />
        <ContactSection
          content={content.contactSection}
          phoneDisplay={phoneDisplay}
          phoneHref={tel}
          address={address}
        />
        <LocationSection
          content={content.location}
          hospitalName={content.contact.hospitalName}
          address={address}
          phoneDisplay={phoneDisplay}
          phoneHref={tel}
          directionsUrl={mapsDirectionsUrl(content)}
          embedUrl={mapsEmbedUrl(content)}
          image={content.hospital.image}
        />
      </main>

      <Footer
        content={content.footer}
        nav={content.header.nav}
        hospitalName={content.contact.hospitalName}
        corporateUrl={content.contact.corporateUrl}
        address={address}
        phoneDisplay={phoneDisplay}
        phoneHref={tel}
      />
      <MobileCTA
        callLabel={content.location.callLabel}
        infoLabel={content.header.ctaLabel}
        phoneHref={tel}
      />
      <ScrollReveal />
    </>
  );
}
