"use client";

import { iconNames } from "@/lib/icons";
import DynamicIcon from "@/components/DynamicIcon";

type Props = {
  id: string;
  value: string;
  onChange: (value: string) => void;
};

export default function IconSelect({ id, value, onChange }: Props) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-green-050 text-green-800">
        <DynamicIcon name={value} />
      </span>
      <select
        id={id}
        value={iconNames.includes(value as never) ? value : ""}
        onChange={(event) => onChange(event.target.value)}
        className="field"
      >
        <option value="">Seçiniz</option>
        {iconNames.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}
