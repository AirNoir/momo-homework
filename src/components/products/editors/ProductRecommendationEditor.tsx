"use client";

import { useState, useEffect } from "react";
import { ProductRecommendationBlock, Product } from "@/types";
import { XMarkIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useProducts } from "@/hooks/useProducts";

interface ProductRecommendationEditorProps {
  block: ProductRecommendationBlock;
  onUpdate: (updates: Partial<ProductRecommendationBlock>) => void;
  onClose: () => void;
}

export default function ProductRecommendationEditor({
  block,
  onUpdate,
  onClose,
}: ProductRecommendationEditorProps) {
  const [title, setTitle] = useState(block.title || "");
  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    block.content?.products || []
  );
  const [displayCount, setDisplayCount] = useState(
    block.content?.displayCount || 4
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
      content: {
        products: selectedProducts,
        displayCount,
      },
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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">編輯商品推薦區塊</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-6">
        {/* 標題 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            區塊標題
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="輸入區塊標題，如：熱門推薦"
          />
        </div>

        {/* 顯示數量 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            顯示商品數量
          </label>
          <select
            value={displayCount}
            onChange={(e) => setDisplayCount(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={2}>2 個商品</option>
            <option value={3}>3 個商品</option>
            <option value={4}>4 個商品</option>
            <option value={6}>6 個商品</option>
            <option value={8}>8 個商品</option>
          </select>
        </div>

        {/* 已選擇的商品 */}
        {selectedProductDetails.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              已選擇的商品 ({selectedProductDetails.length})
            </h4>
            <div className="space-y-2">
              {selectedProductDetails.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium text-sm">{product.title}</p>
                      <p className="text-xs text-gray-500">
                        {product.category}
                      </p>
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
            <h4 className="text-sm font-medium text-gray-700">選擇推薦商品</h4>
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
                      className="mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-10 h-10 object-cover rounded mr-3"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{product.title}</p>
                      <p className="text-xs text-gray-500">
                        {product.category}
                      </p>
                    </div>
                    <div className="text-sm text-gray-600">
                      NT$ {product.price.toLocaleString()}
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
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            儲存
          </button>
        </div>
      </div>
    </div>
  );
}
