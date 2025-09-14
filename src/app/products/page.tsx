"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/products/ProductCard";
import Pagination from "@/components/products/Pagination";
import ProductFilters from "@/components/products/ProductFilters";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Products() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const limit = 10;

  const { data, isLoading, error } = useProducts({
    page: currentPage,
    limit,
    sortBy,
    sortOrder,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // 重置到第一頁
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  const handleSortOrderChange = (newSortOrder: "asc" | "desc") => {
    setSortOrder(newSortOrder);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="py-6 bg-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6 bg-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">載入失敗</h2>
            <p className="text-gray-600">無法載入商品列表，請稍後再試。</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 頁面標題 */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">商品管理</h1>
              <p className="mt-1 text-sm text-gray-600">
                管理您的商品庫存和資訊
              </p>
            </div>
            <Link
              href="/products/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              新增商品
            </Link>
          </div>
        </div>

        {/* 篩選器 */}
        <ProductFilters
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          sortOrder={sortOrder}
          onSortOrderChange={handleSortOrderChange}
        />

        {/* 商品列表 */}
        <div className="space-y-4">
          {data?.data && data.data.length > 0 ? (
            data.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">沒有找到商品</p>
            </div>
          )}
        </div>

        {/* 分頁 */}
        {data?.pagination && data.pagination.totalPages > 1 && (
          <Pagination
            currentPage={data.pagination.page}
            totalPages={data.pagination.totalPages}
            hasNext={data.pagination.hasNext}
            hasPrev={data.pagination.hasPrev}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
