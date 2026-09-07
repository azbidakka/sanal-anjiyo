import type { ReactNode } from "react";
import AccentText from "./AccentText";

type Props = {
  label: string;
  title: string;
  intro?: ReactNode;
  tone?: "light" | "dark";
  align?: "start" | "center";
};

export default function SectionHeading({
  label,
  title,
  intro,
  tone = "light",
  align = "start",
}: Props) {
  const isDark = tone === "dark";

  return (
    <div
      className={[
        "measure",
        align === "center" ? "mx-auto text-center" : "",
      ].join(" ")}
    >
      <p
        data-reveal
        className={[
          "mb-5 flex items-center gap-3 text-[0.75rem] font-medium uppercase tracking-[0.18em]",
          align === "center" ? "justify-center" : "",
          isDark ? "text-white/70" : "text-green-800",
        ].join(" ")}
      >
        <span
          aria-hidden="true"
          className={[
            "inline-block h-px w-8",
            isDark ? "bg-white/40" : "bg-green-800/40",
          ].join(" ")}
        />
        {label}
      </p>

      <h2
        data-reveal
        style={{ "--reveal-delay": "60ms" } as React.CSSProperties}
        className={["h2-display", isDark ? "text-white" : ""].join(" ")}
      >
        <AccentText text={title} tone={isDark ? "dark" : "light"} />
      </h2>

      {intro ? (
        <div
          data-reveal
          style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
          className={[
            "lead mt-6",
            isDark ? "text-white/80" : "text-text",
          ].join(" ")}
        >
          {intro}
        </div>
      ) : null}
    </div>
  );
}
