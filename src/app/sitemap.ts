import { MetadataRoute } from "next";
import { getPublishedMarketingPagesServer } from "@/lib/marketing-server-api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.com";

  // 基本頁面
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/marketing`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  // 動態生成行銷頁面
  try {
    const publishedPages = await getPublishedMarketingPagesServer();
    const marketingPages: MetadataRoute.Sitemap = publishedPages.map(
      (page) => ({
        url: `${baseUrl}/page/${page.id}`,
        lastModified: page.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })
    );

    return [...staticPages, ...marketingPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticPages;
  }
}
