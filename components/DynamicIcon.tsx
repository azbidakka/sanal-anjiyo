import { createElement } from "react";
import { getIcon } from "@/lib/icons";

type Props = {
  name: string;
  size?: number;
  className?: string;
};

/** İkon adını çalışma zamanında bileşene çevirir. */
export default function DynamicIcon({ name, size = 19, className }: Props) {
  return createElement(getIcon(name), {
    size,
    className,
    "aria-hidden": true,
  });
}
