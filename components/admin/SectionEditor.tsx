"use client";

import { useActionState, useId, useState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowDown, ArrowUp, Check, Plus, Trash2 } from "lucide-react";
import { saveSectionAction, type SaveState } from "@/app/admin/actions";
import type { AdminField, AdminSection } from "@/lib/admin-schema";
import IconSelect from "./IconSelect";
import ImageField from "./ImageField";

type Values = Record<string, unknown>;
type Item = Record<string, unknown>;

function asText(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.join("\n");
  return "";
}

function emptyItem(fields: AdminField[]): Item {
  return Object.fromEntries(fields.map((field) => [field.name, ""]));
}

function SaveBar({ state }: { state: SaveState }) {
  const { pending } = useFormStatus();

  return (
    <div className="sticky bottom-4 z-10 mt-8 flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-white/95 p-4 backdrop-blur">
      <button type="submit" disabled={pending} className="btn-primary !h-12 !px-7">
        {pending ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
      </button>

      {state.ok && !pending ? (
        <span className="inline-flex items-center gap-2 text-sm text-green-800">
          <Check size={16} aria-hidden="true" />
          Kaydedildi{state.savedAt ? ` · ${state.savedAt}` : ""}
        </span>
      ) : null}

      {state.error ? (
        <span role="alert" className="text-sm text-[#b4483f]">
          {state.error}
        </span>
      ) : null}

      <span className="text-xs text-muted">
        Kayıt sonrası site anında güncellenir.
      </span>
    </div>
  );
}

export default function SectionEditor({
  section,
  initialValue,
}: {
  section: AdminSection;
  initialValue: Values;
}) {
  const baseId = useId();
  const [values, setValues] = useState<Values>(initialValue);
  const [state, formAction] = useActionState<SaveState, FormData>(
    saveSectionAction,
    {},
  );

  function setField(name: string, value: unknown) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function updateItem(listName: string, index: number, field: string, value: string) {
    setValues((current) => {
      const list = [...((current[listName] as Item[]) ?? [])];
      list[index] = { ...list[index], [field]: value };
      return { ...current, [listName]: list };
    });
  }

  function addItem(listName: string, fields: AdminField[]) {
    setValues((current) => ({
      ...current,
      [listName]: [...((current[listName] as Item[]) ?? []), emptyItem(fields)],
    }));
  }

  function removeItem(listName: string, index: number) {
    setValues((current) => ({
      ...current,
      [listName]: ((current[listName] as Item[]) ?? []).filter(
        (_, i) => i !== index,
      ),
    }));
  }

  function moveItem(listName: string, index: number, direction: -1 | 1) {
    setValues((current) => {
      const list = [...((current[listName] as Item[]) ?? [])];
      const target = index + direction;
      if (target < 0 || target >= list.length) return current;
      [list[index], list[target]] = [list[target], list[index]];
      return { ...current, [listName]: list };
    });
  }

  function renderField(
    field: AdminField,
    value: unknown,
    onChange: (next: string) => void,
    idSuffix: string,
  ) {
    const fieldId = `${baseId}-${idSuffix}`;
    const text = asText(value);

    return (
      <div key={fieldId}>
        <label
          htmlFor={fieldId}
          className="mb-2 block text-sm font-medium text-ink"
        >
          {field.label}
        </label>

        {field.type === "textarea" || field.type === "lines" ? (
          <textarea
            id={fieldId}
            rows={field.rows ?? 4}
            value={text}
            onChange={(event) => onChange(event.target.value)}
            className="field !h-auto resize-y py-3 text-sm leading-relaxed"
          />
        ) : field.type === "icon" ? (
          <IconSelect id={fieldId} value={text} onChange={onChange} />
        ) : field.type === "image" ? (
          <ImageField id={fieldId} value={text} onChange={onChange} />
        ) : (
          <input
            id={fieldId}
            type={field.type === "url" ? "url" : "text"}
            value={text}
            onChange={(event) => onChange(event.target.value)}
            className="field !h-11 text-sm"
          />
        )}

        {field.help ? (
          <p className="mt-1.5 text-xs leading-relaxed text-muted">{field.help}</p>
        ) : null}
      </div>
    );
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="sectionId" value={section.id} />
      <input type="hidden" name="payload" value={JSON.stringify(values)} />

      {section.fields.length > 0 ? (
        <div className="rounded-[20px] border border-line bg-white p-6 md:p-7">
          <div className="grid gap-5">
            {section.fields.map((field) =>
              renderField(
                field,
                values[field.name],
                (next) =>
                  setField(
                    field.name,
                    field.type === "lines"
                      ? next.split("\n").map((line) => line.trim())
                      : next,
                  ),
                field.name,
              ),
            )}
          </div>
        </div>
      ) : null}

      {section.lists.map((list) => {
        const items = (values[list.name] as Item[]) ?? [];

        return (
          <section key={list.name} className="mt-6">
            <div className="mb-3 flex items-center justify-between gap-4">
              <h2 className="text-[1.0625rem] font-semibold text-ink">
                {list.label}
                <span className="ml-2 text-sm font-normal text-muted">
                  ({items.length})
                </span>
              </h2>
              <button
                type="button"
                onClick={() => addItem(list.name, list.fields)}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-text transition-colors hover:border-green-800 hover:text-green-800"
              >
                <Plus size={15} aria-hidden="true" />
                {list.addLabel}
              </button>
            </div>

            <ul className="space-y-4">
              {items.map((item, index) => (
                <li
                  key={`${list.name}-${index}`}
                  className="rounded-[20px] border border-line bg-white p-6"
                >
                  <div className="mb-5 flex items-start justify-between gap-4 border-b border-line pb-4">
                    <p className="min-w-0 text-sm font-medium text-ink">
                      <span className="text-muted">
                        {list.itemLabel} {index + 1}
                      </span>
                      {asText(item[list.titleField]) ? (
                        <span className="ml-2 block truncate sm:ml-3 sm:inline">
                          {asText(item[list.titleField])}
                        </span>
                      ) : null}
                    </p>

                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveItem(list.name, index, -1)}
                        disabled={index === 0}
                        aria-label="Yukarı taşı"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:text-green-800 disabled:opacity-40"
                      >
                        <ArrowUp size={15} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem(list.name, index, 1)}
                        disabled={index === items.length - 1}
                        aria-label="Aşağı taşı"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:text-green-800 disabled:opacity-40"
                      >
                        <ArrowDown size={15} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(list.name, index)}
                        aria-label={`${list.itemLabel} ${index + 1} sil`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-[#b4483f] hover:text-[#b4483f]"
                      >
                        <Trash2 size={15} aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-5">
                    {list.fields.map((field) =>
                      renderField(
                        field,
                        item[field.name],
                        (next) => updateItem(list.name, index, field.name, next),
                        `${list.name}-${index}-${field.name}`,
                      ),
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {items.length === 0 ? (
              <p className="rounded-[20px] border border-dashed border-line bg-white p-8 text-center text-sm text-muted">
                Henüz kayıt yok.
              </p>
            ) : null}
          </section>
        );
      })}

      <SaveBar state={state} />
    </form>
  );
}
