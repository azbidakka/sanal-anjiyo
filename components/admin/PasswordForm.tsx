"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle } from "lucide-react";
import { changePasswordAction, type SettingsState } from "@/app/admin/actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className="btn-primary !h-12 !px-7">
      {pending ? "Güncelleniyor..." : "Şifreyi Güncelle"}
    </button>
  );
}

export default function PasswordForm({ username }: { username: string }) {
  const [state, formAction] = useActionState<SettingsState, FormData>(
    changePasswordAction,
    {},
  );

  return (
    <form
      action={formAction}
      className="rounded-[20px] border border-line bg-white p-6 md:p-7"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label
            htmlFor="account-username"
            className="mb-2 block text-sm font-medium text-ink"
          >
            Kullanıcı adı
          </label>
          <input
            id="account-username"
            name="username"
            type="text"
            autoComplete="username"
            defaultValue={username}
            className="field !h-11 text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="account-current"
            className="mb-2 block text-sm font-medium text-ink"
          >
            Mevcut şifre
          </label>
          <input
            id="account-current"
            name="currentPassword"
            type="password"
            required
            autoComplete="current-password"
            className="field !h-11 text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="account-new"
            className="mb-2 block text-sm font-medium text-ink"
          >
            Yeni şifre
          </label>
          <input
            id="account-new"
            name="newPassword"
            type="password"
            required
            minLength={10}
            autoComplete="new-password"
            className="field !h-11 text-sm"
          />
          <p className="mt-1.5 text-xs text-muted">En az 10 karakter.</p>
        </div>

        <div>
          <label
            htmlFor="account-repeat"
            className="mb-2 block text-sm font-medium text-ink"
          >
            Yeni şifre (tekrar)
          </label>
          <input
            id="account-repeat"
            name="repeatPassword"
            type="password"
            required
            minLength={10}
            autoComplete="new-password"
            className="field !h-11 text-sm"
          />
        </div>
      </div>

      {state.error ? (
        <p
          role="alert"
          className="mt-5 flex items-start gap-2 text-sm text-[#b4483f]"
        >
          <AlertCircle size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
          {state.error}
        </p>
      ) : null}

      <div className="mt-6 border-t border-line pt-6">
        <SubmitButton />
        <p className="mt-3 text-xs leading-relaxed text-muted">
          Şifre değiştikten sonra oturumunuz kapanır ve yeni bilgilerle giriş
          yapmanız istenir.
        </p>
      </div>
    </form>
  );
}
