"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProduct, useUpdateProduct } from "@/hooks/useProducts";
import {
  ArrowLeftIcon,
  PencilSquareIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import Image from "next/image";
import ProductPageEditor from "@/components/products/ProductPageEditor";
import { Product } from "@/types";

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const { data: product, isLoading, error } = useProduct(productId);

  // 編輯器狀態
  const [showEditor, setShowEditor] = useState(false);
  
  // 更新商品的 mutation
  const updateProductMutation = useUpdateProduct();

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
      stars.push(<StarIconSolid key={i} className="h-5 w-5 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(
        <StarIconSolid
          key="half"
          className="h-5 w-5 text-yellow-400 opacity-50"
        />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarIconSolid key={i} className="h-5 w-5 text-gray-300" />);
    }

    return stars;
  };

  // 處理儲存
  const handleSave = async (updatedProduct: Product) => {
    try {
      await updateProductMutation.mutateAsync({
        id: productId,
        product: updatedProduct,
      });
      
      alert("產品已更新成功！");
      setShowEditor(false);
    } catch (error) {
      console.error("更新產品失敗:", error);
      alert("更新失敗，請稍後再試");
    }
  };

  // 處理取消
  const handleCancel = () => {
    setShowEditor(false);
  };

  if (isLoading) {
    return (
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">商品不存在</h2>
            <p className="text-gray-600 mb-6">
              找不到指定的商品，請檢查商品 ID 是否正確。
            </p>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              返回上一頁
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 返回按鈕和編輯器切換 */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            返回商品列表
          </button>

          <div className="flex items-center gap-3">
            {!showEditor ? (
              <button
                onClick={() => setShowEditor(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
              >
                <PencilSquareIcon className="h-4 w-4 mr-2" />
                編輯商品頁面
              </button>
            ) : (
              <button
                onClick={() => setShowEditor(false)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-600 bg-gray-100 hover:bg-gray-200"
              >
                <EyeIcon className="h-4 w-4 mr-2" />
                預覽頁面
              </button>
            )}
          </div>
        </div>

        {showEditor ? (
          /* 編輯器模式 */
          <ProductPageEditor
            productId={productId}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          /* 預覽模式 */
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                  {product.title}
                </h1>
              </div>
            </div>

            <div className="px-6 py-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 商品圖片 */}
                <div className="space-y-4">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    {product.discount && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white text-sm px-3 py-1 rounded">
                        -{product.discount}%
                      </div>
                    )}
                  </div>

                  {/* 商品縮圖 */}
                  {product.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {product.images.slice(1, 5).map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                        >
                          <Image
                            src={image}
                            alt={`${product.title} ${index + 2}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 25vw, 12.5vw"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 商品資訊 */}
                <div className="space-y-6">
                  {/* 價格 */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold text-red-600">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    {product.discount && (
                      <p className="text-sm text-green-600">
                        限時優惠，節省{" "}
                        {formatPrice(product.originalPrice! - product.price)}
                      </p>
                    )}
                  </div>

                  {/* 評分 */}
                  {product.rating && (
                    <div className="flex items-center gap-3">
                      <div className="flex">{renderStars(product.rating)}</div>
                      <span className="text-sm text-gray-600">
                        {product.rating} ({product.reviewCount} 個評價)
                      </span>
                    </div>
                  )}

                  {/* 商品描述 */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      商品描述
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* 商品詳情 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      商品詳情
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-900">
                          品牌：
                        </span>
                        <span className="text-gray-700">
                          {product.brand || "未指定"}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">
                          類別：
                        </span>
                        <span className="text-gray-700">
                          {product.category}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">
                          庫存狀態：
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
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
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">
                          庫存數量：
                        </span>
                        <span className="text-gray-700">{product.stock}</span>
                      </div>
                      {product.weight && (
                        <div>
                          <span className="font-medium text-gray-900">
                            重量：
                          </span>
                          <span className="text-gray-700">
                            {product.weight}g
                          </span>
                        </div>
                      )}
                      {product.dimensions && (
                        <div>
                          <span className="font-medium text-gray-900">
                            尺寸：
                          </span>
                          <span className="text-gray-700">
                            {product.dimensions.length} ×{" "}
                            {product.dimensions.width} ×{" "}
                            {product.dimensions.height} cm
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 標籤 */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      標籤
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* SEO 資訊 */}
                  {(product.seoTitle || product.seoDescription) && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        SEO 資訊
                      </h3>
                      {product.seoTitle && (
                        <div>
                          <span className="font-medium text-gray-900 text-sm">
                            SEO 標題：
                          </span>
                          <p className="text-sm text-gray-700">
                            {product.seoTitle}
                          </p>
                        </div>
                      )}
                      {product.seoDescription && (
                        <div>
                          <span className="font-medium text-gray-900 text-sm">
                            SEO 描述：
                          </span>
                          <p className="text-sm text-gray-700">
                            {product.seoDescription}
                          </p>
                        </div>
                      )}
                      {product.seoKeywords &&
                        product.seoKeywords.length > 0 && (
                          <div>
                            <span className="font-medium text-gray-900 text-sm">
                              SEO 關鍵字：
                            </span>
                            <p className="text-sm text-gray-700">
                              {product.seoKeywords.join(", ")}
                            </p>
                          </div>
                        )}
                    </div>
                  )}

                  {/* 時間資訊 */}
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">建立時間：</span>
                      {product.createdAt.toLocaleString("zh-TW")}
                    </div>
                    <div>
                      <span className="font-medium">更新時間：</span>
                      {product.updatedAt.toLocaleString("zh-TW")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
