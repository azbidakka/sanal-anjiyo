import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const content = await getContent();
  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(JSON.stringify(content, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="sanalanjiyo-icerik-${stamp}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
