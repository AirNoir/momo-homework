"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeftIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { MarketingPage, Product, MarketingBlock } from "@/types";
import { mockMarketingPageApi } from "@/lib/marketing-mock-data";
import { mockProductApi } from "@/lib/mock-data";

export default function MarketingPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const [page, setPage] = useState<MarketingPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        const pageData = await mockMarketingPageApi(params.id as string);
        setPage(pageData);

        if (pageData) {
          // 載入相關商品資料
          const productPromises = pageData.blocks
            .filter(
              (block) =>
                block.type === "product_recommendation" ||
                block.type === "flash_sale"
            )
            .flatMap((block) => {
              if (block.type === "product_recommendation") {
                return (block.content.products as string[]).map(
                  (productId: string) => mockProductApi(productId)
                );
              } else if (block.type === "flash_sale") {
                return (block.content.products as string[]).map(
                  (productId: string) => mockProductApi(productId)
                );
              }
              return [];
            });

          const productResults = await Promise.all(productPromises);
          setProducts(productResults.filter(Boolean) as Product[]);
        }
      } catch (error) {
        console.error("載入行銷頁面失敗:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [params.id]);

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
            <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
              <Image
                src={block.content.image as string}
                alt={(block.content.alt as string) || block.title || "Banner"}
                fill
                className="object-cover"
              />
            </div>
          </div>
        );

      case "product_recommendation":
        const recommendationProducts = products.filter((product) =>
          (block.content.products as string[])?.includes(product.id)
        );
        return (
          <div key={block.id} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {block.title || "商品推薦"}
            </h2>
            <div className="overflow-x-auto">
              <div className="flex space-x-4 pb-4">
                {recommendationProducts
                  .slice(0, (block.content.displayCount as number) || 4)
                  .map((product) => (
                    <SimpleProductCard key={product.id} product={product} />
                  ))}
              </div>
            </div>
          </div>
        );

      case "flash_sale":
        const flashSaleProducts = products.filter((product) =>
          (block.content.products as string[])?.includes(product.id)
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

  if (loading) {
    return (
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-sm text-gray-500">載入中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">頁面不存在</h1>
            <p className="mt-2 text-sm text-gray-500">找不到指定的行銷頁面</p>
            <button
              onClick={() => router.back()}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              返回
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 頁面標題和操作 */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 inline-flex items-center p-2 border border-gray-300 rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                <ArrowLeftIcon className="h-4 w-4" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {page.title}
                </h1>
                <p className="mt-1 text-sm text-gray-600">行銷頁面預覽</p>
              </div>
            </div>
            <button
              onClick={() => router.push(`/marketing/${page.id}/edit`)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <PencilSquareIcon className="h-4 w-4 mr-2" />
              編輯頁面
            </button>
          </div>
        </div>

        {/* 頁面內容 */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-8">
          {page.description && (
            <div className="mb-8">
              <p className="text-lg text-gray-700">{page.description}</p>
            </div>
          )}

          {page.blocks.map(renderBlock)}
        </div>
      </div>
    </div>
  );
}
