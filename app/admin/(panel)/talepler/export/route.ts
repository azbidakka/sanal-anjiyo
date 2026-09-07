import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { getSubmissions } from "@/lib/content";

export const dynamic = "force-dynamic";

function csvCell(value: string | undefined): string {
  const text = (value ?? "").replace(/"/g, '""');
  return `"${text}"`;
}

export async function GET() {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const submissions = await getSubmissions();

  const rows = [
    ["Tarih", "Ad Soyad", "Telefon", "E-posta", "Mesaj", "Kaynak", "Durum"],
    ...submissions.map((item) => [
      new Date(item.createdAt).toLocaleString("tr-TR"),
      item.name,
      item.phone,
      item.email ?? "",
      item.message ?? "",
      item.source,
      item.read ? "Okundu" : "Yeni",
    ]),
  ];

  // Excel'in Türkçe karakterleri doğru açması için BOM eklenir.
  const csv =
    "﻿" + rows.map((row) => row.map(csvCell).join(";")).join("\r\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="talepler-${new Date()
        .toISOString()
        .slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
