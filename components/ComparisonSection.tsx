import type { SiteContent } from "@/lib/content-types";
import SectionHeading from "./SectionHeading";

export default function ComparisonSection({
  content,
}: {
  content: SiteContent["comparison"];
}) {
  return (
    <section className="section-y bg-offwhite">
      <div className="container-page">
        <SectionHeading label={content.label} title={content.title} />

        {/* Masaüstü tablo */}
        <div
          data-reveal
          className="mt-12 hidden overflow-hidden rounded-[20px] border border-line bg-white md:block lg:mt-16"
        >
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">
              Sanal Anjiyo (Koroner BT) ile klasik koroner anjiyografinin
              karşılaştırması
            </caption>
            <thead>
              <tr className="bg-green-050">
                <th
                  scope="col"
                  className="w-[24%] px-6 py-5 text-[0.75rem] font-medium uppercase tracking-[0.14em] text-muted"
                >
                  {content.columnFeature}
                </th>
                <th
                  scope="col"
                  className="w-[38%] border-x border-green-800 bg-green-800 px-6 py-5 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-white"
                >
                  {content.columnVirtual}
                </th>
                <th
                  scope="col"
                  className="w-[38%] px-6 py-5 text-[0.75rem] font-medium uppercase tracking-[0.14em] text-muted"
                >
                  {content.columnClassic}
                </th>
              </tr>
            </thead>
            <tbody>
              {content.rows.map((row, index) => (
                <tr key={`${row.feature}-${index}`} className="border-t border-line">
                  <th
                    scope="row"
                    className="px-6 py-5 align-top text-[0.9375rem] font-medium text-ink"
                  >
                    {row.feature}
                  </th>
                  <td className="border-x border-green-100 bg-green-100 px-6 py-5 align-top text-[0.9375rem] font-medium text-green-900">
                    {row.virtual}
                  </td>
                  <td className="px-6 py-5 align-top text-[0.9375rem] text-muted">
                    {row.classic}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobil kartlar */}
        <ul className="mt-10 grid gap-4 md:hidden">
          {content.rows.map((row, index) => (
            <li
              key={`${row.feature}-${index}`}
              data-reveal
              style={
                { "--reveal-delay": `${index * 50}ms` } as React.CSSProperties
              }
              className="card-surface p-6"
            >
              <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted">
                {row.feature}
              </p>

              <div className="mt-4 overflow-hidden rounded-2xl border border-green-100 bg-green-100">
                <p className="bg-green-800 px-4 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white">
                  {content.columnVirtual}
                </p>
                <p className="px-4 py-3.5 text-[0.9375rem] font-medium text-green-900">
                  {row.virtual}
                </p>
              </div>

              <div className="mt-3 rounded-2xl border border-line p-4">
                <p className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-muted">
                  {content.columnClassic}
                </p>
                <p className="mt-1.5 text-[0.9375rem] text-text">{row.classic}</p>
              </div>
            </li>
          ))}
        </ul>

        {content.note ? (
          <p
            data-reveal
            className="measure mt-10 text-[0.9375rem] leading-relaxed text-muted"
          >
            {content.note}
          </p>
        ) : null}
      </div>
    </section>
  );
}
