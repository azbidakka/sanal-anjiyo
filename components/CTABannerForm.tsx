"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import {
  formatPhone,
  isValidName,
  isValidPhone,
  submitContact,
} from "@/lib/contact";

type Props = {
  title: string;
  text: string;
  submitLabel: string;
  successTitle: string;
  successText: string;
  phoneDisplay: string;
  phoneHref: string;
};

type Errors = { name?: string; phone?: string; kvkk?: string; form?: string };

export default function CTABannerForm({
  title,
  text,
  submitLabel,
  successTitle,
  successText,
  phoneDisplay,
  phoneHref,
}: Props) {
  const nameId = useId();
  const phoneId = useId();
  const kvkkId = useId();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [kvkk, setKvkk] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: Errors = {};
    if (!isValidName(name)) nextErrors.name = "Lütfen adınızı ve soyadınızı girin.";
    if (!isValidPhone(phone))
      nextErrors.phone = "Lütfen geçerli bir telefon numarası girin.";
    if (!kvkk)
      nextErrors.kvkk =
        "Devam etmek için Aydınlatma Metni'ni okuduğunuzu onaylayın.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("loading");

    const result = await submitContact({
      name: name.trim(),
      phone: phone.trim(),
      kvkkAccepted: kvkk,
      source: "cta-banner",
    });

    if (result.ok) {
      setStatus("success");
      return;
    }

    setStatus("idle");
    setErrors({ form: result.message });
  }

  if (status === "success") {
    return (
      <div
        aria-live="polite"
        className="flex h-full flex-col justify-center rounded-[24px] border border-green-100 bg-white p-8 text-center md:p-10"
      >
        <CheckCircle2
          size={40}
          aria-hidden="true"
          className="mx-auto text-green-800"
        />
        <h3 className="h3-display mt-5 text-[1.25rem]">{successTitle}</h3>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
          {successText}
        </p>
        <p className="mt-6 text-sm text-muted">
          Dilerseniz{" "}
          <a
            href={phoneHref}
            data-cta="banner-phone"
            className="font-medium text-green-800 underline underline-offset-4"
          >
            {phoneDisplay}
          </a>{" "}
          numaralı telefondan da bize ulaşabilirsiniz.
        </p>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      data-cta="banner-form"
      data-form-source="cta-banner"
      className="rounded-[24px] border border-line bg-white p-7 transition-[transform,box-shadow,border-color] duration-300 ease-out md:p-9 md:hover:-translate-y-[3px] md:hover:border-green-800/25 md:hover:shadow-[0_24px_60px_rgba(10,81,53,0.12)]"
    >
      <h3 className="h3-display text-[1.375rem]">{title}</h3>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{text}</p>

      <div className="mt-6 space-y-4">
        <div>
          <label
            htmlFor={nameId}
            className="mb-2 block text-sm font-medium text-ink"
          >
            Ad Soyad
          </label>
          <input
            id={nameId}
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="Adınız Soyadınız"
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${nameId}-error` : undefined}
            className="field"
          />
          {errors.name ? (
            <p id={`${nameId}-error`} className="mt-1.5 text-xs text-[#b4483f]">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor={phoneId}
            className="mb-2 block text-sm font-medium text-ink"
          >
            Telefon
          </label>
          <input
            id={phoneId}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder="05XX XXX XX XX"
            value={phone}
            onChange={(event) => setPhone(formatPhone(event.target.value))}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? `${phoneId}-error` : undefined}
            className="field"
          />
          {errors.phone ? (
            <p id={`${phoneId}-error`} className="mt-1.5 text-xs text-[#b4483f]">
              {errors.phone}
            </p>
          ) : null}
        </div>

        <div>
          <div className="flex items-start gap-3">
            <input
              id={kvkkId}
              name="kvkk"
              type="checkbox"
              checked={kvkk}
              onChange={(event) => setKvkk(event.target.checked)}
              aria-invalid={Boolean(errors.kvkk)}
              aria-describedby={errors.kvkk ? `${kvkkId}-error` : undefined}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#0d6734]"
            />
            <label htmlFor={kvkkId} className="text-sm leading-relaxed text-muted">
              <Link
                href="/aydinlatma-metni"
                className="font-medium text-green-800 underline underline-offset-4"
              >
                Aydınlatma Metni
              </Link>
              &apos;ni okudum.
            </label>
          </div>
          {errors.kvkk ? (
            <p id={`${kvkkId}-error`} className="mt-1.5 text-xs text-[#b4483f]">
              {errors.kvkk}
            </p>
          ) : null}
        </div>
      </div>

      {errors.form ? (
        <p role="alert" className="mt-4 text-xs text-[#b4483f]">
          {errors.form}
        </p>
      ) : null}

      <button
        type="submit"
        data-cta="banner-submit"
        disabled={status === "loading"}
        className="btn-primary group mt-6 w-full"
      >
        {status === "loading" ? "Gönderiliyor..." : submitLabel}
        {status === "loading" ? null : (
          <ArrowRight
            size={17}
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        )}
      </button>
    </form>
  );
}
