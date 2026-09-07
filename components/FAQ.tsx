"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { SiteContent } from "@/lib/content-types";
import SectionHeading from "./SectionHeading";

export default function FAQ({ content }: { content: SiteContent["faq"] }) {
  // İlk soru varsayılan olarak açıktır; #sss ile gelindiğinde de içerik görünür.
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="sss" className="section-y bg-white">
      <div className="container-page">
        <SectionHeading label={content.label} title={content.title} />

        <div className="mt-12 lg:mt-16">
          <ul className="border-t border-line">
            {content.items.map((item, index) => {
              const isOpen = openIndex === index;
              const panelId = `faq-panel-${index}`;
              const buttonId = `faq-button-${index}`;

              return (
                <li key={item.id} className="border-b border-line">
                  <h3>
                    <button
                      type="button"
                      id={buttonId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="flex w-full items-start justify-between gap-6 py-6 text-left transition-colors hover:text-green-800"
                    >
                      <span className="text-[1.0625rem] font-medium leading-snug text-ink md:text-[1.125rem]">
                        {item.question}
                      </span>
                      <span
                        aria-hidden="true"
                        className={[
                          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-green-800 transition-transform duration-300",
                          isOpen ? "rotate-45 bg-green-050" : "",
                        ].join(" ")}
                      >
                        <Plus size={16} />
                      </span>
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    aria-hidden={!isOpen}
                    className="grid transition-[grid-template-rows] duration-300 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="measure pb-7 pr-4 text-[0.9375rem] leading-relaxed text-muted md:pr-12">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
