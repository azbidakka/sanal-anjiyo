"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction, type LoginState } from "@/app/admin/actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className="btn-primary mt-6 w-full">
      {pending ? "Giriş yapılıyor..." : "Giriş Yap"}
    </button>
  );
}

export default function LoginForm() {
  const [state, formAction] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <form action={formAction} className="mt-7">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="admin-username"
            className="mb-2 block text-sm font-medium text-ink"
          >
            Kullanıcı adı
          </label>
          <input
            id="admin-username"
            name="username"
            type="text"
            autoComplete="username"
            required
            autoFocus
            className="field"
          />
        </div>

        <div>
          <label
            htmlFor="admin-password"
            className="mb-2 block text-sm font-medium text-ink"
          >
            Şifre
          </label>
          <input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="field"
          />
        </div>
      </div>

      {state.error ? (
        <p role="alert" className="mt-4 text-sm text-[#b4483f]">
          {state.error}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
