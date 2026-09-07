import { Fragment } from "react";
import Link from "next/link";

const LINK_PATTERN = /(\[[^\]]+\]\([^)]+\))/g;

/** Satır içi [metin](/yol) bağlantılarını çözer. */
function renderInline(text: string) {
  return text.split(LINK_PATTERN).map((part, index) => {
    const match = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (!match) return <Fragment key={index}>{part}</Fragment>;

    const [, label, href] = match;
    const className =
      "font-medium text-green-800 underline underline-offset-4";

    return href.startsWith("/") ? (
      <Link key={index} href={href} className={className}>
        {label}
      </Link>
    ) : (
      <a
        key={index}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {label}
      </a>
    );
  });
}

/**
 * Panelden girilen yasal metni biçimlendirir.
 * Desteklenenler: "## Başlık", "- madde" ve boş satırla ayrılan paragraflar.
 */
export default function LegalBody({ body }: { body: string }) {
  const blocks = body.replace(/\r\n/g, "\n").split(/\n{2,}/);

  return (
    <>
      {blocks.map((block, index) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith("## ")) {
          return <h2 key={index}>{renderInline(trimmed.slice(3).trim())}</h2>;
        }

        const lines = trimmed.split("\n");
        if (lines.every((line) => line.trim().startsWith("- "))) {
          return (
            <ul key={index}>
              {lines.map((line, item) => (
                <li key={item}>{renderInline(line.trim().slice(2))}</li>
              ))}
            </ul>
          );
        }

        return <p key={index}>{renderInline(lines.join(" "))}</p>;
      })}
    </>
  );
}
