import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { CONTENT_DIR } from "@/lib/content";

export const dynamic = "force-dynamic";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

/**
 * Panelden yüklenen görselleri servis eder. Dosyalar public/ dışında
 * tutulduğu için yeni yüklemeler sunucu yeniden başlatılmadan yayına girer.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;

  // Yalnızca düz dosya adı kabul edilir; dizin geçişi engellenir.
  if (!/^[a-z0-9][a-z0-9._-]{0,120}$/i.test(file) || file.includes("..")) {
    return new NextResponse("Bulunamadı", { status: 404 });
  }

  const extension = path.extname(file).toLowerCase();
  const contentType = CONTENT_TYPES[extension];
  if (!contentType) return new NextResponse("Bulunamadı", { status: 404 });

  try {
    const data = await fs.readFile(path.join(CONTENT_DIR, "uploads", file));

    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Bulunamadı", { status: 404 });
  }
}
