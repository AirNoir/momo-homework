import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getMarketingPageServer,
  getPublishedMarketingPagesServer,
} from "@/lib/marketing-server-api";
import { mockProductApi } from "@/lib/mock-data";
import FrontendPageRenderer from "@/components/frontend/FrontendPageRenderer";
import type { MarketingPage, Product } from "@/types";

// 這是 SSG 的關鍵：generateStaticParams
export async function generateStaticParams() {
  try {
    const pages = await getPublishedMarketingPagesServer();

    return pages.map((page) => ({
      id: page.id,
    }));
  } catch (error) {
    console.error("Failed to generate static params:", error);
    return [];
  }
}

// 動態生成每個頁面的 metadata (SEO)
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const page = await getMarketingPageServer(params.id);

    if (!page) {
      return {
        title: "頁面不存在",
        description: "找不到指定的頁面",
      };
    }

    return {
      title: page.title,
      description: page.description || `${page.title} - 專業電商行銷頁面`,
      keywords: ["電商", "行銷", page.title],
      openGraph: {
        title: page.title,
        description: page.description || `${page.title} - 專業電商行銷頁面`,
        type: "website",
        url: `/page/${page.id}`,
        images: page.blocks
          .filter((block) => block.type === "banner" && block.content.image)
          .map((block) => ({
            url: block.content.image,
            alt: block.content.alt || page.title,
          })),
      },
      twitter: {
        card: "summary_large_image",
        title: page.title,
        description: page.description || `${page.title} - 專業電商行銷頁面`,
      },
      // 結構化數據
      other: {
        "application/ld+json": JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: page.title,
          description: page.description,
          url: `/page/${page.id}`,
          datePublished: page.createdAt,
          dateModified: page.updatedAt,
        }),
      },
    };
  } catch (error) {
    console.error("Failed to generate metadata:", error);
    return {
      title: "載入錯誤",
      description: "頁面載入時發生錯誤",
    };
  }
}

// SSG 頁面組件 (沒有 "use client")
export default async function FrontendPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    // 在伺服器端獲取資料
    const page = await getMarketingPageServer(params.id);

    if (!page || page.status !== "published") {
      notFound();
    }

    // 預先載入相關商品資料
    const productIds = page.blocks
      .filter(
        (block) =>
          (block.type === "product_recommendation" ||
            block.type === "flash_sale") &&
          block.content.products
      )
      .flatMap((block) => block.content.products);

    const products: Product[] = [];
    for (const productId of productIds) {
      try {
        const product = await mockProductApi(productId);
        if (product) {
          products.push(product);
        }
      } catch (error) {
        console.error(`Failed to load product ${productId}:`, error);
      }
    }

    return <FrontendPageRenderer page={page} products={products} />;
  } catch (error) {
    console.error("Failed to load page:", error);
    notFound();
  }
}

// 設定重新驗證時間 (ISR - Incremental Static Regeneration)
export const revalidate = 3600; // 每小時重新生成一次

// 添加重新驗證標籤
export const tags = ["marketing-pages"];
