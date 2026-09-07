import { Fragment } from "react";

type Props = {
  text: string;
  /** Koyu zeminli bölümlerde vurgunun rengi değişir. */
  tone?: "light" | "dark";
};

const ACCENT_PATTERN = /(\*[^*]+\*)/g;

/**
 * Metindeki * ... * bölümlerini italik serif vurguya çevirir.
 * Yıldız kullanılmayan metinler olduğu gibi basılır.
 */
export default function AccentText({ text, tone = "light" }: Props) {
  if (!text.includes("*")) return <>{text}</>;

  const parts = text.split(ACCENT_PATTERN);

  return (
    <>
      {parts.map((part, index) => {
        const isAccent =
          part.length > 2 && part.startsWith("*") && part.endsWith("*");

        if (!isAccent) return <Fragment key={index}>{part}</Fragment>;

        return (
          <span
            key={index}
            className={[
              "accent-display",
              tone === "dark" ? "text-white/85" : "text-green-800",
            ].join(" ")}
          >
            {part.slice(1, -1)}
          </span>
        );
      })}
    </>
  );
}
