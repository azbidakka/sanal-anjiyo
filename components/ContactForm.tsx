"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import {
  formatPhone,
  isValidEmail,
  isValidName,
  isValidPhone,
  submitContact,
} from "@/lib/contact";

type Props = {
  kvkkLabel: string;
  formNote: string;
  submitLabel: string;
  successTitle: string;
  successText: string;
  phoneDisplay: string;
  phoneHref: string;
};

type Errors = {
  name?: string;
  phone?: string;
  email?: string;
  kvkk?: string;
  form?: string;
};

export default function ContactForm({
  kvkkLabel,
  formNote,
  submitLabel,
  successTitle,
  successText,
  phoneDisplay,
  phoneHref,
}: Props) {
  const nameId = useId();
  const phoneId = useId();
  const emailId = useId();
  const messageId = useId();
  const kvkkId = useId();

  const [values, setValues] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [kvkk, setKvkk] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  function update(key: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: Errors = {};
    if (!isValidName(values.name))
      nextErrors.name = "Lütfen adınızı ve soyadınızı girin.";
    if (!isValidPhone(values.phone))
      nextErrors.phone = "Lütfen geçerli bir telefon numarası girin.";
    if (!isValidEmail(values.email))
      nextErrors.email = "Lütfen geçerli bir e-posta adresi girin.";
    if (!kvkk)
      nextErrors.kvkk =
        "Devam etmek için aydınlatma metnini okuduğunuzu onaylayın.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("loading");

    const result = await submitContact({
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email.trim() || undefined,
      message: values.message.trim() || undefined,
      kvkkAccepted: kvkk,
      source: "contact-section",
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
        className="flex min-h-[420px] flex-col items-center justify-center rounded-[24px] border border-green-100 bg-white p-8 text-center md:p-12"
      >
        <CheckCircle2
          size={44}
          aria-hidden="true"
          className="text-green-800"
        />
        <h3 className="h3-display mt-6 text-[1.375rem]">{successTitle}</h3>
        <p className="measure mt-3 text-[0.9375rem] leading-relaxed text-muted">
          {successText}
        </p>
        <p className="mt-7 text-sm text-muted">
          Dilerseniz{" "}
          <a
            href={phoneHref}
            data-cta="contact-success-phone"
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
      data-form-source="contact-section"
      className="rounded-[24px] border border-line bg-white p-7 md:p-10"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor={nameId}
            className="mb-2 block text-sm font-medium text-ink"
          >
            Ad Soyad <span className="text-green-800">*</span>
          </label>
          <input
            id={nameId}
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="Adınız ve soyadınız"
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
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
            Telefon <span className="text-green-800">*</span>
          </label>
          <input
            id={phoneId}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder="05XX XXX XX XX"
            value={values.phone}
            onChange={(event) => update("phone", formatPhone(event.target.value))}
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

        <div className="sm:col-span-2">
          <label
            htmlFor={emailId}
            className="mb-2 block text-sm font-medium text-ink"
          >
            E-posta{" "}
            <span className="font-normal text-muted">(isteğe bağlı)</span>
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="ornek@eposta.com"
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${emailId}-error` : undefined}
            className="field"
          />
          {errors.email ? (
            <p id={`${emailId}-error`} className="mt-1.5 text-xs text-[#b4483f]">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor={messageId}
            className="mb-2 block text-sm font-medium text-ink"
          >
            Mesajınız{" "}
            <span className="font-normal text-muted">(isteğe bağlı)</span>
          </label>
          <textarea
            id={messageId}
            name="message"
            rows={4}
            placeholder="Sormak istediğiniz konu..."
            value={values.message}
            onChange={(event) => update("message", event.target.value)}
            className="field !h-auto resize-y py-3.5"
          />
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-start gap-3">
          <input
            id={kvkkId}
            name="kvkk"
            type="checkbox"
            required
            checked={kvkk}
            onChange={(event) => setKvkk(event.target.checked)}
            aria-invalid={Boolean(errors.kvkk)}
            aria-describedby={errors.kvkk ? `${kvkkId}-error` : undefined}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#0d6734]"
          />
          <label htmlFor={kvkkId} className="text-sm leading-relaxed text-muted">
            {kvkkLabel}{" "}
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

      {errors.form ? (
        <p role="alert" className="mt-4 text-xs text-[#b4483f]">
          {errors.form}
        </p>
      ) : null}

      <button
        type="submit"
        data-cta="contact-submit"
        disabled={status === "loading"}
        className="btn-primary group mt-7 w-full sm:w-auto"
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

      {formNote ? (
        <p className="mt-6 border-t border-line pt-6 text-xs leading-relaxed text-muted">
          {formNote}
        </p>
      ) : null}
    </form>
  );
}
