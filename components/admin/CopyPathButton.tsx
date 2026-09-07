"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyPathButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* pano kullanılamıyorsa sessizce geç */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-text transition-colors hover:border-green-800 hover:text-green-800"
    >
      {copied ? (
        <>
          <Check size={13} aria-hidden="true" />
          Kopyalandı
        </>
      ) : (
        <>
          <Copy size={13} aria-hidden="true" />
          Yolu kopyala
        </>
      )}
    </button>
  );
}
