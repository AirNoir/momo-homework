"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/types";
import { mockProductsApi } from "@/lib/mock-data";

interface ProductSelectorProps {
  selectedProducts: string[];
  onSelectionChange: (productIds: string[]) => void;
  maxSelection?: number;
  title?: string;
}

export default function ProductSelector({
  selectedProducts,
  onSelectionChange,
  maxSelection,
  title = "選擇商品",
}: ProductSelectorProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await mockProductsApi(currentPage, 12);
        setProducts(response.data);
        setTotalPages(response.pagination.totalPages);
      } catch (error) {
        console.error("載入商品失敗:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage]);

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const handleProductToggle = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      onSelectionChange(selectedProducts.filter((id) => id !== productId));
    } else {
      if (maxSelection && selectedProducts.length >= maxSelection) {
        alert(`最多只能選擇 ${maxSelection} 個商品`);
        return;
      }
      onSelectionChange([...selectedProducts, productId]);
    }
  };

  const clearSelection = () => {
    onSelectionChange([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            已選擇 {selectedProducts.length} 個商品
            {maxSelection && ` / ${maxSelection}`}
          </span>
          {selectedProducts.length > 0 && (
            <button
              onClick={clearSelection}
              className="text-sm text-red-600 hover:text-red-800"
            >
              清除選擇
            </button>
          )}
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="搜尋商品..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-sm text-gray-500">載入中...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => {
              const isSelected = selectedProducts.includes(product.id);
              return (
                <div
                  key={product.id}
                  className={`relative cursor-pointer transition-all border rounded-lg p-3 hover:shadow-md ${
                    isSelected
                      ? "ring-2 ring-indigo-500 bg-indigo-50"
                      : "border-gray-200 bg-white"
                  }`}
                  onClick={() => handleProductToggle(product.id)}
                >
                  <div
                    className={`absolute top-2 right-2 z-10 ${
                      isSelected
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-400"
                    } rounded-full p-1`}
                  >
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>

                  <div className="space-y-3">
                    <div className="aspect-square relative overflow-hidden rounded-lg">
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                        {product.title}
                      </h4>
                      <p className="text-xs text-gray-500 font-mono">
                        ID: {product.id}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一頁
              </button>
              <span className="px-3 py-2 text-sm font-medium text-gray-700">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一頁
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
