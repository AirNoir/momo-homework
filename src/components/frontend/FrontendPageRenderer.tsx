import Image from "next/image";
import Link from "next/link";
import type { MarketingPage, Product, MarketingBlock } from "@/types";

interface FrontendPageRendererProps {
  page: MarketingPage;
  products: Product[];
}

export default function FrontendPageRenderer({
  page,
  products,
}: FrontendPageRendererProps) {
  const renderBlock = (block: MarketingBlock) => {
    switch (block.type) {
      case "banner":
        return (
          <section key={block.id} className="mb-8">
            {block.content.image ? (
              <div className="relative w-full h-64 md:h-96 lg:h-[500px] overflow-hidden rounded-lg">
                {block.content.link ? (
                  <Link
                    href={block.content.link}
                    className="block w-full h-full"
                  >
                    <Image
                      src={block.content.image}
                      alt={block.content.alt || block.title || "Banner"}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      priority={block.position <= 2} // 首屏優先載入
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                    />
                  </Link>
                ) : (
                  <Image
                    src={block.content.image}
                    alt={block.content.alt || block.title || "Banner"}
                    fill
                    className="object-cover"
                    priority={block.position <= 2}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                  />
                )}
              </div>
            ) : null}
          </section>
        );

      case "product_recommendation":
        const recommendationProducts = products.filter((product) =>
          block.content?.products?.includes(product.id)
        );

        if (recommendationProducts.length === 0) return null;

        return (
          <section key={block.id} className="mb-12">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                {block.title || "商品推薦"}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {recommendationProducts
                  .slice(0, block.content?.displayCount || 4)
                  .map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
              </div>
            </div>
          </section>
        );

      case "flash_sale":
        const flashSaleProducts = products.filter((product) =>
          block.content?.products?.includes(product.id)
        );

        if (flashSaleProducts.length === 0) return null;

        const now = new Date();
        const startTime = new Date(block.content.startTime);
        const endTime = new Date(block.content.endTime);
        const isActive = now >= startTime && now <= endTime;

        return (
          <section key={block.id} className="mb-12">
            <div className="container mx-auto px-4">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-6 md:p-8 text-white mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">
                      {block.title || "限時秒殺"}
                    </h2>
                    <p className="text-red-100">
                      活動時間: {startTime.toLocaleDateString("zh-TW")} -{" "}
                      {endTime.toLocaleDateString("zh-TW")}
                    </p>
                  </div>
                  <div
                    className={`mt-4 md:mt-0 px-4 py-2 rounded-full text-sm font-medium ${
                      isActive
                        ? "bg-white text-red-500"
                        : "bg-gray-500 text-white"
                    }`}
                  >
                    {isActive ? "🔥 進行中" : "已結束"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {flashSaleProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isFlashSale={isActive}
                  />
                ))}
              </div>
            </div>
          </section>
        );

      case "html_block":
        if (!block.content?.htmlContent) return null;

        return (
          <section key={block.id} className="mb-12">
            <div className="container mx-auto px-4">
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: block.content.htmlContent }}
              />
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頁面標題區域 */}
      {(page.title || page.description) && (
        <section className="bg-white border-b border-gray-200 py-8 md:py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {page.title}
            </h1>
            {page.description && (
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                {page.description}
              </p>
            )}
          </div>
        </section>
      )}

      {/* 區塊內容 */}
      <main className="py-8">
        {page.blocks
          .filter((block) => block.isVisible)
          .sort((a, b) => a.position - b.position)
          .map(renderBlock)}
      </main>
    </div>
  );
}

// 商品卡片組件
interface ProductCardProps {
  product: Product;
  isFlashSale?: boolean;
}

function ProductCard({ product, isFlashSale = false }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-square">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        {isFlashSale && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
            限時特價
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 text-sm md:text-base line-clamp-2 mb-2">
          {product.title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-red-600">
              NT$ {product.price.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                NT$ {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          {product.rating && (
            <div className="flex items-center text-xs text-gray-500">
              <span className="text-yellow-400 mr-1">★</span>
              <span>{product.rating}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
