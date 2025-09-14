"use client";

import { useState } from "react";
import Image from "next/image";
import { FlashSaleBlock, Product } from "@/types";
import { XMarkIcon, TrashIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useProducts } from "@/hooks/useProducts";

interface FlashSaleEditorProps {
  block: FlashSaleBlock;
  onUpdate: (updates: Partial<FlashSaleBlock>) => void;
  onClose: () => void;
}

export default function FlashSaleEditor({
  block,
  onUpdate,
  onClose,
}: FlashSaleEditorProps) {
  const [title, setTitle] = useState(block.title || "");
  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    block.products || []
  );
  const [startTime, setStartTime] = useState(
    block.startTime ? new Date(block.startTime).toISOString().slice(0, 16) : ""
  );
  const [endTime, setEndTime] = useState(
    block.endTime ? new Date(block.endTime).toISOString().slice(0, 16) : ""
  );
  const [searchTerm, setSearchTerm] = useState("");

  // 獲取商品列表用於選擇
  const { data: productsResponse, isLoading } = useProducts({
    page: 1,
    limit: 50,
  });

  const products = productsResponse?.data || [];

  // 篩選商品
  const filteredProducts = products.filter(
    (product: Product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 獲取已選擇的商品詳情
  const selectedProductDetails = products.filter((product: Product) =>
    selectedProducts.includes(product.id)
  );

  const handleSave = () => {
    onUpdate({
      title,
      products: selectedProducts,
      startTime: startTime ? new Date(startTime) : new Date(),
      endTime: endTime
        ? new Date(endTime)
        : new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    onClose();
  };

  const handleProductToggle = (productId: string) => {
    setSelectedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((id) => id !== productId));
  };

  const getTimeStatus = () => {
    if (!startTime || !endTime) return "未設定時間";

    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) {
      return `尚未開始 (${start.toLocaleString("zh-TW")})`;
    } else if (now > end) {
      return "已結束";
    } else {
      return "進行中";
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">編輯秒殺活動區塊</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-6">
        {/* 標題 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            活動標題
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="輸入活動標題，如：限時秒殺"
          />
        </div>

        {/* 時間設定 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ClockIcon className="h-5 w-5 text-gray-500" />
            <h4 className="text-sm font-medium text-gray-700">活動時間</h4>
            <span
              className={`text-sm px-2 py-1 rounded ${
                getTimeStatus().includes("進行中")
                  ? "bg-green-100 text-green-800"
                  : getTimeStatus().includes("已結束")
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {getTimeStatus()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                開始時間
              </label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                結束時間
              </label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* 已選擇的商品 */}
        {selectedProductDetails.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              秒殺商品 ({selectedProductDetails.length})
            </h4>
            <div className="space-y-2">
              {selectedProductDetails.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      width={48}
                      height={48}
                      className="object-cover rounded"
                    />
                    <div>
                      <p className="font-medium text-sm">{product.title}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-red-600 font-bold">
                          NT$ {product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-gray-500 line-through">
                            NT$ {product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveProduct(product.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 商品選擇 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700">選擇秒殺商品</h4>
            <span className="text-sm text-gray-500">
              已選擇 {selectedProducts.length} 個商品
            </span>
          </div>

          {/* 搜尋 */}
          <div className="mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="搜尋商品名稱或類別"
            />
          </div>

          {/* 商品列表 */}
          <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">載入商品中...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-4 text-center text-gray-500">沒有找到商品</div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <label
                    key={product.id}
                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleProductToggle(product.id)}
                      className="mr-3 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      width={40}
                      height={40}
                      className="object-cover rounded mr-3"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{product.title}</p>
                      <p className="text-xs text-gray-500">
                        {product.category}
                      </p>
                    </div>
                    <div className="text-sm">
                      <div className="text-red-600 font-bold">
                        NT$ {product.price.toLocaleString()}
                      </div>
                      {product.originalPrice && (
                        <div className="text-xs text-gray-500 line-through">
                          NT$ {product.originalPrice.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 操作按鈕 */}
        <div className="flex items-center justify-end gap-3 pt-6 pb-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            儲存
          </button>
        </div>
      </div>
    </div>
  );
}
