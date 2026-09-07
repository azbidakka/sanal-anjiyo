"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import {
  saveMailSettingsAction,
  testMailAction,
  type SettingsState,
} from "@/app/admin/actions";
import type { MailSettings } from "@/lib/settings";

type Props = {
  settings: MailSettings;
  hasPassword: boolean;
};

function Feedback({ state }: { state: SettingsState }) {
  const { pending } = useFormStatus();
  if (pending) return null;

  if (state.error) {
    return (
      <p
        role="alert"
        className="flex items-start gap-2 text-sm leading-relaxed text-[#b4483f]"
      >
        <AlertCircle size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
        {state.error}
      </p>
    );
  }

  if (state.ok && state.message) {
    return (
      <p className="flex items-center gap-2 text-sm text-green-800">
        <CheckCircle2 size={16} aria-hidden="true" />
        {state.message}
      </p>
    );
  }

  return null;
}

function Buttons({ testAction }: { testAction: (formData: FormData) => void }) {
  const { pending } = useFormStatus();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="submit" disabled={pending} className="btn-primary !h-12 !px-7">
        {pending ? "Kaydediliyor..." : "Ayarları Kaydet"}
      </button>
      <button
        type="submit"
        formAction={testAction}
        disabled={pending}
        className="btn-secondary !h-12"
      >
        <Send size={16} aria-hidden="true" />
        Test e-postası gönder
      </button>
    </div>
  );
}

export default function MailSettingsForm({ settings, hasPassword }: Props) {
  const [saveState, saveAction] = useActionState<SettingsState, FormData>(
    saveMailSettingsAction,
    {},
  );
  const [testState, testAction] = useActionState<SettingsState, FormData>(
    testMailAction,
    {},
  );

  const knownPorts = ["587", "25", "465"];
  const [port, setPort] = useState(
    knownPorts.includes(String(settings.port)) ? String(settings.port) : "587",
  );

  return (
    <form action={saveAction} className="rounded-[20px] border border-line bg-white p-6 md:p-7">
      <label className="flex items-start gap-3 rounded-2xl bg-green-050 p-4">
        <input
          type="checkbox"
          name="enabled"
          defaultChecked={settings.enabled}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[#0d6734]"
        />
        <span className="text-sm leading-relaxed text-text">
          <span className="font-medium text-ink">
            Form talepleri e-posta ile bildirilsin
          </span>
          <br />
          Kapalıyken talepler yalnızca panelde birikir, e-posta gönderilmez.
        </span>
      </label>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="mail-host" className="mb-2 block text-sm font-medium text-ink">
            Sunucu adresi
          </label>
          <input
            id="mail-host"
            name="host"
            type="text"
            required
            defaultValue={settings.host}
            className="field !h-11 text-sm"
          />
        </div>

        <div>
          <label htmlFor="mail-port" className="mb-2 block text-sm font-medium text-ink">
            Port
          </label>
          <select
            id="mail-port"
            name="port"
            value={port}
            onChange={(event) => setPort(event.target.value)}
            className="field !h-11 text-sm"
          >
            <option value="587">587 — STARTTLS (önerilen)</option>
            <option value="25">25 — şifresiz / iç relay</option>
            <option value="465">465 — örtük TLS</option>
          </select>
        </div>

        <div>
          <label htmlFor="mail-user" className="mb-2 block text-sm font-medium text-ink">
            Kullanıcı adı
          </label>
          <input
            id="mail-user"
            name="user"
            type="text"
            required
            autoComplete="off"
            defaultValue={settings.user}
            className="field !h-11 text-sm"
          />
          <p className="mt-1.5 text-xs leading-relaxed text-muted">
            E-posta adresi değil, <strong>oturum açma adı</strong> girilir.
            Sunucunuzun Active Directory alan adı{" "}
            <code>gisbirhastanesi.local</code> olduğu için doğru biçim
            genellikle <code>GISBIRHASTANESI\kullanici</code> veya{" "}
            <code>kullanici@gisbirhastanesi.local</code> olur.
          </p>
        </div>

        <div>
          <label htmlFor="mail-pass" className="mb-2 block text-sm font-medium text-ink">
            Şifre
          </label>
          <input
            id="mail-pass"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder={hasPassword ? "•••••••• (kayıtlı)" : "Posta kutusu şifresi"}
            className="field !h-11 text-sm"
          />
          <p className="mt-1.5 text-xs leading-relaxed text-muted">
            {hasPassword
              ? "Boş bırakırsanız kayıtlı şifre korunur."
              : "Şifre sunucuda şifrelenerek saklanır."}
          </p>
        </div>

        <div>
          <label htmlFor="mail-from-name" className="mb-2 block text-sm font-medium text-ink">
            Gönderen adı
          </label>
          <input
            id="mail-from-name"
            name="fromName"
            type="text"
            defaultValue={settings.fromName}
            className="field !h-11 text-sm"
          />
        </div>

        <div>
          <label htmlFor="mail-from" className="mb-2 block text-sm font-medium text-ink">
            Gönderen adresi
          </label>
          <input
            id="mail-from"
            name="fromAddress"
            type="email"
            defaultValue={settings.fromAddress}
            className="field !h-11 text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="mail-to" className="mb-2 block text-sm font-medium text-ink">
            Bildirim alacak adresler
          </label>
          <input
            id="mail-to"
            name="to"
            type="text"
            defaultValue={settings.to}
            className="field !h-11 text-sm"
          />
          <p className="mt-1.5 text-xs text-muted">
            Birden fazla adres için virgülle ayırın.
          </p>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="mail-subject"
            className="mb-2 block text-sm font-medium text-ink"
          >
            Konu ön eki
          </label>
          <input
            id="mail-subject"
            name="subjectPrefix"
            type="text"
            defaultValue={settings.subjectPrefix}
            className="field !h-11 text-sm"
          />
          <p className="mt-1.5 text-xs text-muted">
            Outlook kurallarıyla klasörlemeyi kolaylaştırır. Örn. [Sanal Anjiyo]
          </p>
        </div>
      </div>

      <fieldset className="mt-6 space-y-3 border-t border-line pt-5">
        <legend className="sr-only">Bağlantı seçenekleri</legend>

        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            name="requireTls"
            defaultChecked={settings.requireTls}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#0d6734]"
          />
          <span className="text-sm leading-relaxed text-text">
            STARTTLS zorunlu olsun{" "}
            <span className="text-muted">
              — 587 portu için açık kalmalı, şifreler şifreli kanaldan gider.
            </span>
          </span>
        </label>

        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            name="rejectUnauthorized"
            defaultChecked={settings.rejectUnauthorized}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#0d6734]"
          />
          <span className="text-sm leading-relaxed text-text">
            Sertifika doğrulamasını zorunlu tut{" "}
            <span className="text-muted">
              — sunucunun sertifikası geçerli olduğu için açık bırakılmalı.
            </span>
          </span>
        </label>

        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            name="replyToSubmitter"
            defaultChecked={settings.replyToSubmitter}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#0d6734]"
          />
          <span className="text-sm leading-relaxed text-text">
            Yanıtla, talebi bırakan kişiye gitsin{" "}
            <span className="text-muted">
              — yalnızca e-posta paylaşan kişiler için geçerlidir.
            </span>
          </span>
        </label>
      </fieldset>

      <div className="mt-7 space-y-4 border-t border-line pt-6">
        <Buttons testAction={testAction} />
        <Feedback state={saveState} />
        <Feedback state={testState} />
      </div>
    </form>
  );
}
