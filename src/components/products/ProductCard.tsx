"use client";

import { Product } from "@/types";
import { PencilSquareIcon, StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("zh-TW", {
      style: "currency",
      currency: "TWD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIconSolid key={i} className="h-4 w-4 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(
        <StarIconSolid
          key="half"
          className="h-4 w-4 text-yellow-400 opacity-50"
        />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarIcon key={i} className="h-4 w-4 text-gray-300" />);
    }

    return stars;
  };

  return (
    <Link href={`/products/${product.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 cursor-pointer hover:border-indigo-300 hover:scale-[1.02]">
        <div className="flex">
          {/* 商品圖片 */}
          <div className="relative w-32 h-32 flex-shrink-0">
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-cover rounded-l-lg"
              sizes="(max-width: 768px) 128px, 128px"
            />
            {product.discount && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                -{product.discount}%
              </div>
            )}
          </div>

          {/* 商品資訊 */}
          <div className="flex-1 pt-3 pl-4 pr-4 flex flex-col justify-between">
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                    {product.title}
                  </h3>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {product.description}
                  </p>

                  {/* 價格 */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-red-600">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* 評分 */}
                    {product.rating && (
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {renderStars(product.rating)}
                        </div>
                        <span className="text-xs text-gray-600">
                          ({product.reviewCount})
                        </span>
                      </div>
                    )}

                    {/* 庫存狀態 */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          product.status === "active"
                            ? "bg-green-100 text-green-800"
                            : product.status === "inactive"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.status === "active"
                          ? "有庫存"
                          : product.status === "inactive"
                          ? "下架"
                          : "缺貨"}
                      </span>
                      <span className="text-xs text-gray-600">
                        庫存: {product.stock}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 編輯按鈕 */}
                <div className="ml-4">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // 這裡可以添加編輯商品的邏輯
                      console.log("編輯商品:", product.id);
                    }}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                    title="編輯商品"
                  >
                    <PencilSquareIcon className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
