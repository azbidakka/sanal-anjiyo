"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, Upload } from "lucide-react";
import { restoreContentAction, type SettingsState } from "@/app/admin/actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className="btn-secondary !h-12">
      <Upload size={16} aria-hidden="true" />
      {pending ? "Yükleniyor..." : "Yedeği geri yükle"}
    </button>
  );
}

export default function RestoreForm() {
  const [state, formAction] = useActionState<SettingsState, FormData>(
    restoreContentAction,
    {},
  );

  return (
    <form action={formAction} className="mt-5 border-t border-line pt-5">
      <label
        htmlFor="backup-file"
        className="mb-2 block text-sm font-medium text-ink"
      >
        Yedek dosyası (.json)
      </label>
      <input
        id="backup-file"
        name="backup"
        type="file"
        accept="application/json,.json"
        required
        className="block w-full text-sm text-text file:mr-4 file:rounded-full file:border file:border-line file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-text hover:file:border-green-800 hover:file:text-green-800"
      />

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <SubmitButton />

        {state.error ? (
          <span role="alert" className="flex items-center gap-2 text-sm text-[#b4483f]">
            <AlertCircle size={15} aria-hidden="true" />
            {state.error}
          </span>
        ) : null}

        {state.ok ? (
          <span className="flex items-center gap-2 text-sm text-green-800">
            <CheckCircle2 size={15} aria-hidden="true" />
            {state.message}
          </span>
        ) : null}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted">
        Yükleme mevcut içeriğin üzerine yazar. Önce güncel yedeği indirmeniz
        önerilir.
      </p>
    </form>
  );
}
