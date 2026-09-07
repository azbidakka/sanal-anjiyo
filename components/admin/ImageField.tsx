"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { uploadImageAction } from "@/app/admin/actions";

type Props = {
  id: string;
  value: string;
  onChange: (value: string) => void;
};

export default function ImageField({ id, value, onChange }: Props) {
  const inputId = useId();
  const fileInput = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setStatus("loading");
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadImageAction(formData);
    setStatus("idle");

    if (result.ok) {
      onChange(result.url);
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="relative h-[92px] w-[132px] shrink-0 overflow-hidden rounded-xl border border-line bg-green-050">
          {value ? (
            <Image
              src={value}
              alt=""
              fill
              sizes="132px"
              className="object-cover"
            />
          ) : (
            <span className="flex h-full items-center justify-center text-xs text-muted">
              Görsel yok
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <input
            id={id}
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="/images/ornek.webp"
            className="field !h-11 text-sm"
          />

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <input
              id={inputId}
              ref={fileInput}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void handleFile(file);
                event.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={status === "loading"}
              className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-text transition-colors hover:border-green-800 hover:text-green-800 disabled:opacity-60"
            >
              <Upload size={15} aria-hidden="true" />
              {status === "loading" ? "Yükleniyor..." : "Görsel yükle"}
            </button>
            <span className="text-xs text-muted">
              JPG, PNG, WebP veya AVIF · en fazla 8 MB
            </span>
          </div>

          {error ? (
            <p role="alert" className="mt-2 text-xs text-[#b4483f]">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
