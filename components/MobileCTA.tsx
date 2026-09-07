import { MessageSquareText, Phone } from "lucide-react";

type Props = {
  callLabel: string;
  infoLabel: string;
  phoneHref: string;
};

export default function MobileCTA({ callLabel, infoLabel, phoneHref }: Props) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex gap-3 px-4 py-3">
        <a
          href={phoneHref}
          data-cta="mobile-phone"
          className="btn-secondary !h-12 flex-1 !text-sm"
        >
          <Phone size={16} aria-hidden="true" />
          {callLabel}
        </a>
        <a
          href="#iletisim"
          data-cta="mobile-info"
          className="btn-primary !h-12 flex-1 !text-sm"
        >
          <MessageSquareText size={16} aria-hidden="true" />
          {infoLabel}
        </a>
      </div>
    </div>
  );
}
