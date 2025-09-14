"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MarketingBlock, Product } from "@/types";
import { mockProductApi } from "@/lib/mock-data";

interface PagePreviewProps {
  blocks: MarketingBlock[];
  title?: string;
  description?: string;
}

export default function PagePreview({
  blocks,
  title,
  description,
}: PagePreviewProps) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      // 載入相關商品資料
      const productPromises = blocks
        .filter(
          (block) =>
            block.type === "product_recommendation" ||
            block.type === "flash_sale"
        )
        .flatMap((block) => {
          if (block.type === "product_recommendation") {
            return block.content.products.map((productId: string) =>
              mockProductApi(productId)
            );
          } else if (block.type === "flash_sale") {
            return block.content.products.map((productId: string) =>
              mockProductApi(productId)
            );
          }
          return [];
        });

      const productResults = await Promise.all(productPromises);
      setProducts(productResults.filter(Boolean) as Product[]);
    };

    fetchProducts();
  }, [blocks]);

  // 簡化的商品卡片組件
  const SimpleProductCard = ({ product }: { product: Product }) => (
    <div className="flex-shrink-0 w-48 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="aspect-square relative">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
          {product.title}
        </h3>
      </div>
    </div>
  );

  const renderBlock = (block: MarketingBlock) => {
    switch (block.type) {
      case "banner":
        return (
          <div key={block.id} className="mb-8">
            {block.content.image ? (
              <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
                <Image
                  src={block.content.image}
                  alt={block.content.alt || block.title}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-64 md:h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-gray-500 text-center">
                  <div className="text-4xl mb-2">📷</div>
                  <p>未設定圖片</p>
                </div>
              </div>
            )}
          </div>
        );

      case "product_recommendation":
        const recommendationProducts = products.filter((product) =>
          block.content?.products?.includes(product.id)
        );

        return (
          <div key={block.id} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {block.title || "商品推薦"}
            </h2>
            {!block.content?.products || block.content.products.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                尚未選擇任何商品
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="flex space-x-4 pb-4">
                  {recommendationProducts
                    .slice(0, block.content?.displayCount || 4)
                    .map((product) => (
                      <SimpleProductCard key={product.id} product={product} />
                    ))}
                </div>
              </div>
            )}
          </div>
        );

      case "flash_sale":
        const flashSaleProducts = products.filter((product) =>
          block.content.products.includes(product.id)
        );
        const now = new Date();
        const startTime = new Date(block.content.startTime);
        const endTime = new Date(block.content.endTime);
        const isActive = now >= startTime && now <= endTime;

        return (
          <div key={block.id} className="mb-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-red-900 mb-4">
                {block.title || "限時秒殺"}
              </h2>
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm text-red-700">
                  活動時間:{" "}
                  {startTime.toLocaleString("zh-TW", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}{" "}
                  -{" "}
                  {endTime.toLocaleString("zh-TW", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isActive
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {isActive ? "進行中" : "已結束"}
                </div>
              </div>
              <div className="overflow-x-auto">
                <div className="flex space-x-4 pb-4">
                  {flashSaleProducts.map((product) => (
                    <SimpleProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "html_block":
        return (
          <div key={block.id} className="mb-8">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: block.content.htmlContent }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-8">
      {title && (
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          {description && (
            <p className="text-lg text-gray-700">{description}</p>
          )}
        </div>
      )}

      {blocks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-4">📄</div>
          <p className="text-lg font-medium mb-2">尚未添加任何區塊</p>
          <p className="text-sm">請在左側編輯器中添加區塊</p>
        </div>
      ) : (
        blocks.map(renderBlock)
      )}
    </div>
  );
}
