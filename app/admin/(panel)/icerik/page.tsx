import Link from "next/link";
import SectionEditor from "@/components/admin/SectionEditor";
import { adminSections, findSection, sectionGroups } from "@/lib/admin-schema";
import { getContent } from "@/lib/content";

export default async function ContentPage({
  searchParams,
}: {
  searchParams: Promise<{ b?: string }>;
}) {
  const { b } = await searchParams;
  const active = findSection(b ?? "") ?? adminSections[0];
  const content = await getContent();

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr] lg:gap-10">
      <aside>
        <h1 className="mb-5 text-[1.375rem] font-semibold text-ink">İçerik</h1>

        <nav aria-label="Bölümler" className="space-y-6">
          {sectionGroups.map((group) => (
            <div key={group}>
              <p className="mb-2 px-3 text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-muted">
                {group}
              </p>
              <ul className="space-y-0.5">
                {adminSections
                  .filter((section) => section.group === group)
                  .map((section) => {
                    const isActive = section.id === active.id;

                    return (
                      <li key={section.id}>
                        <Link
                          href={`/admin/icerik?b=${section.id}`}
                          aria-current={isActive ? "page" : undefined}
                          className={[
                            "block rounded-xl px-3 py-2.5 text-sm transition-colors",
                            isActive
                              ? "bg-white font-medium text-green-900 ring-1 ring-line"
                              : "text-text hover:bg-white/70",
                          ].join(" ")}
                        >
                          {section.title}
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      <div className="min-w-0">
        <header className="mb-6">
          <h2 className="text-[1.5rem] font-semibold text-ink">{active.title}</h2>
          <p className="mt-2 max-w-[70ch] text-sm leading-relaxed text-muted">
            {active.description}
          </p>
        </header>

        <SectionEditor
          key={active.id}
          section={active}
          initialValue={content[active.id] as Record<string, unknown>}
        />
      </div>
    </div>
  );
}
