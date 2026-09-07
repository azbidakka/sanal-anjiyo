"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Images,
  Inbox,
  LayoutDashboard,
  Settings,
} from "lucide-react";

const items = [
  { href: "/admin", label: "Özet", icon: LayoutDashboard, exact: true },
  { href: "/admin/icerik", label: "İçerik", icon: FileText, exact: false },
  { href: "/admin/gorseller", label: "Görseller", icon: Images, exact: false },
  { href: "/admin/talepler", label: "Talepler", icon: Inbox, exact: false },
  { href: "/admin/ayarlar", label: "Ayarlar", icon: Settings, exact: false },
];

export default function AdminNav({ unread }: { unread: number }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Panel menüsü" className="flex flex-wrap items-center gap-1">
      {items.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={[
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-green-800 text-white"
                : "text-text hover:bg-green-050 hover:text-green-900",
            ].join(" ")}
          >
            <item.icon size={16} aria-hidden="true" />
            {item.label}
            {item.href === "/admin/talepler" && unread > 0 ? (
              <span
                className={[
                  "ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[0.6875rem] font-semibold",
                  active ? "bg-white text-green-900" : "bg-green-800 text-white",
                ].join(" ")}
              >
                {unread}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
