"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  CheckIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useCreateProduct } from "@/hooks/useProducts";
import { Product } from "@/types";
import Image from "next/image";

export default function CreateProduct() {
  const router = useRouter();
  const createProductMutation = useCreateProduct();
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 表單狀態
  const [formData, setFormData] = useState<Partial<Product>>({
    title: "",
    description: "",
    price: 0,
    originalPrice: undefined,
    discount: undefined,
    images: [],
    category: "",
    tags: [],
    stock: 0,
    status: "active",
    brand: "",
    weight: undefined,
    dimensions: undefined,
    rating: undefined,
    reviewCount: 0,
    seoTitle: "",
    seoDescription: "",
    seoKeywords: [],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (field: keyof Product, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 處理文件上傳的通用函數
  const handleFileUpload = useCallback((file: File) => {
    // 檢查文件類型
    if (!file.type.startsWith("image/")) {
      setUploadError("請選擇圖片文件");
      return;
    }

    // 檢查文件大小 (限制為 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("圖片大小不能超過 5MB");
      return;
    }

    setUploadError("");

    // 在實際應用中，這裡應該上傳到服務器並獲取 URL
    // 現在我們使用 FileReader 來創建本地預覽 URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      handleInputChange("images", [imageUrl]);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // 拖拉事件處理
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileUpload(files[0]);
      }
    },
    [handleFileUpload]
  );

  const handleSave = async () => {
    // 基本驗證
    if (!formData.title?.trim()) {
      alert("請輸入商品名稱");
      return;
    }

    if (!formData.category?.trim()) {
      alert("請輸入商品類別");
      return;
    }

    if (!formData.price || formData.price <= 0) {
      alert("請輸入有效的商品價格");
      return;
    }

    try {
      const productData = {
        ...formData,
        title: formData.title!,
        description: formData.description || "",
        price: formData.price!,
        category: formData.category!,
        images: formData.images || [],
        tags: formData.tags || [],
        stock: formData.stock || 0,
        status: formData.status as "active" | "inactive" | "out_of_stock",
        reviewCount: formData.reviewCount || 0,
        seoKeywords: formData.seoKeywords || [],
      } as Omit<Product, "id" | "createdAt" | "updatedAt">;

      const newProduct = await createProductMutation.mutateAsync(productData);
      alert("商品創建成功！");
      router.push("/products");
    } catch (error) {
      console.error("創建失敗:", error);
      alert("創建失敗，請稍後再試");
    }
  };

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
                <h1 className="text-2xl font-bold text-gray-900">新增商品</h1>
                <p className="mt-1 text-sm text-gray-600">創建新的商品資訊</p>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={createProductMutation.isPending}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              <CheckIcon className="h-4 w-4 mr-2" />
              {createProductMutation.isPending ? "創建中..." : "創建商品"}
            </button>
          </div>
        </div>

        {/* 表單內容 */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 左側：基本資訊 */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    產品名稱 *
                  </label>
                  <input
                    type="text"
                    value={formData.title || ""}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="輸入產品名稱"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    產品描述
                  </label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="輸入產品描述"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      價格 *
                    </label>
                    <input
                      type="number"
                      value={formData.price || ""}
                      onChange={(e) =>
                        handleInputChange("price", parseFloat(e.target.value))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      原價
                    </label>
                    <input
                      type="number"
                      value={formData.originalPrice || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "originalPrice",
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      品牌
                    </label>
                    <input
                      type="text"
                      value={formData.brand || ""}
                      onChange={(e) =>
                        handleInputChange("brand", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="輸入品牌"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      類別 *
                    </label>
                    <input
                      type="text"
                      value={formData.category || ""}
                      onChange={(e) =>
                        handleInputChange("category", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="輸入類別"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      庫存數量
                    </label>
                    <input
                      type="number"
                      value={formData.stock || ""}
                      onChange={(e) =>
                        handleInputChange("stock", parseInt(e.target.value))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      折扣百分比
                    </label>
                    <input
                      type="number"
                      value={formData.discount || ""}
                      onChange={(e) =>
                        handleInputChange("discount", parseInt(e.target.value))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="0"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    狀態
                  </label>
                  <select
                    value={formData.status || "active"}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="active">上架</option>
                    <option value="inactive">下架</option>
                    <option value="out_of_stock">缺貨</option>
                  </select>
                </div>
              </div>

              {/* 右側：詳細資訊 */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    產品圖片
                  </label>

                  {/* 圖片預覽 */}
                  {formData.images?.[0] ? (
                    <div className="mb-4">
                      <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden group">
                        <Image
                          src={formData.images[0]}
                          alt="產品圖片預覽"
                          fill
                          className="object-cover"
                        />

                        {/* 編輯按鈕 */}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100"
                        >
                          <div className="bg-white bg-opacity-90 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 shadow-lg">
                            <PhotoIcon className="h-4 w-4 inline mr-2" />
                            點擊更換圖片
                          </div>
                        </button>

                        {/* 移除按鈕 */}
                        <button
                          type="button"
                          onClick={() => {
                            handleInputChange("images", []);
                            setUploadError("");
                          }}
                          className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-all duration-200"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`w-full h-64 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 ${
                        isDragOver
                          ? "border-indigo-400 bg-indigo-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <div className="text-center">
                        <PhotoIcon
                          className={`h-12 w-12 mx-auto mb-2 ${
                            isDragOver ? "text-indigo-500" : "text-gray-400"
                          }`}
                        />
                        <p
                          className={`font-medium ${
                            isDragOver ? "text-indigo-600" : "text-gray-600"
                          }`}
                        >
                          {isDragOver
                            ? "放開以上傳圖片"
                            : "點擊上傳圖片或拖拽圖片到這裡"}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          支援 JPG, PNG, GIF 格式，最大 5MB
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 錯誤訊息 */}
                  {uploadError && (
                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{uploadError}</p>
                    </div>
                  )}

                  {/* 隱藏的文件輸入 */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {/* 圖片 URL 輸入 */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      或輸入圖片 URL
                    </label>
                    <input
                      type="url"
                      value={formData.images?.[0] || ""}
                      onChange={(e) =>
                        handleInputChange("images", [e.target.value])
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    標籤 (用逗號分隔)
                  </label>
                  <input
                    type="text"
                    value={formData.tags?.join(", ") || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "tags",
                        e.target.value
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter((tag) => tag)
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="標籤1, 標籤2, 標籤3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    重量 (克)
                  </label>
                  <input
                    type="number"
                    value={formData.weight || ""}
                    onChange={(e) =>
                      handleInputChange("weight", parseInt(e.target.value))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      長度 (cm)
                    </label>
                    <input
                      type="number"
                      value={formData.dimensions?.length || ""}
                      onChange={(e) =>
                        handleInputChange("dimensions", {
                          ...formData.dimensions,
                          length: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      寬度 (cm)
                    </label>
                    <input
                      type="number"
                      value={formData.dimensions?.width || ""}
                      onChange={(e) =>
                        handleInputChange("dimensions", {
                          ...formData.dimensions,
                          width: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      高度 (cm)
                    </label>
                    <input
                      type="number"
                      value={formData.dimensions?.height || ""}
                      onChange={(e) =>
                        handleInputChange("dimensions", {
                          ...formData.dimensions,
                          height: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                {/* SEO 資訊 */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    SEO 設定
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO 標題
                    </label>
                    <input
                      type="text"
                      value={formData.seoTitle || ""}
                      onChange={(e) =>
                        handleInputChange("seoTitle", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="SEO 標題"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO 描述
                    </label>
                    <textarea
                      value={formData.seoDescription || ""}
                      onChange={(e) =>
                        handleInputChange("seoDescription", e.target.value)
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="SEO 描述"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO 關鍵字 (用逗號分隔)
                    </label>
                    <input
                      type="text"
                      value={formData.seoKeywords?.join(", ") || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "seoKeywords",
                          e.target.value
                            .split(",")
                            .map((keyword) => keyword.trim())
                            .filter((keyword) => keyword)
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="關鍵字1, 關鍵字2, 關鍵字3"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
