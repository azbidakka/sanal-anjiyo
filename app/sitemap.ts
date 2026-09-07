import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getContent();
  const lastModified = new Date();

  return [
    {
      url: `${siteConfig.url}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...content.footer.legalLinks
      .filter((link) => link.href.startsWith("/"))
      .map((link) => ({
        url: `${siteConfig.url}${link.href}`,
        lastModified,
        changeFrequency: "yearly" as const,
        priority: 0.3,
      })),
  ];
}
