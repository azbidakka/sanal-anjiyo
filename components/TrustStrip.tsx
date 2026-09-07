import { getIcon } from "@/lib/icons";
import type { IconCard } from "@/lib/content-types";

export default function TrustStrip({ items }: { items: IconCard[] }) {
  return (
    <section aria-label="Öne çıkan bilgiler" className="bg-green-050">
      <div className="container-page">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            const Icon = getIcon(item.icon);

            return (
              <li
                key={`${item.title}-${index}`}
                data-reveal
                style={
                  { "--reveal-delay": `${index * 70}ms` } as React.CSSProperties
                }
                className="flex items-center gap-4 border-t border-line py-6 first:border-t-0 sm:border-t-0 sm:py-7 lg:border-l lg:px-7 lg:first:border-l-0 lg:first:pl-0"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-green-800 ring-1 ring-line">
                  <Icon size={19} aria-hidden="true" />
                </span>
                <span className="text-[0.9375rem] leading-snug text-ink">
                  {item.title}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
