"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useProduct, useUpdateProduct } from "@/hooks/useProducts";
import { Product } from "@/types";
import { CheckIcon, XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

interface ProductPageEditorProps {
  productId: string;
  onSave?: (product: Product) => void;
  onCancel?: () => void;
}

export default function ProductPageEditor({
  productId,
  onSave,
  onCancel,
}: ProductPageEditorProps) {
  const { data: product, isLoading } = useProduct(productId);
  const updateProductMutation = useUpdateProduct();
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 初始化表單數據
  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

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
    if (!product) return;

    try {
      const result = await updateProductMutation.mutateAsync({
        id: productId,
        product: formData,
      });

      if (result) {
        onSave?.(result);
        console.log("產品已更新:", result);
      }
    } catch (error) {
      console.error("更新失敗:", error);
      alert("更新失敗，請稍後再試");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">無法載入產品資料</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">編輯產品</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <XMarkIcon className="h-4 w-4 mr-2" />
              取消
            </button>
            <button
              onClick={handleSave}
              disabled={updateProductMutation.isPending}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              <CheckIcon className="h-4 w-4 mr-2" />
              {updateProductMutation.isPending ? "儲存中..." : "儲存"}
            </button>
          </div>
        </div>
      </div>

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
                  onChange={(e) => handleInputChange("brand", e.target.value)}
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
                onChange={(e) => handleInputChange("status", e.target.value)}
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  評分
                </label>
                <input
                  type="number"
                  value={formData.rating || ""}
                  onChange={(e) =>
                    handleInputChange("rating", parseFloat(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0"
                  min="0"
                  max="5"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  評價數量
                </label>
                <input
                  type="number"
                  value={formData.reviewCount || ""}
                  onChange={(e) =>
                    handleInputChange("reviewCount", parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0"
                  min="0"
                />
              </div>
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
              <h3 className="text-lg font-medium text-gray-900">SEO 設定</h3>

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
  );
}
