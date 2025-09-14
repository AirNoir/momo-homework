"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  PlusIcon,
  PhotoIcon,
  ShoppingBagIcon,
  ClockIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";
import type { MarketingPage } from "@/types";
import {
  mockMarketingPagesApi,
  mockDeleteMarketingPageApi,
} from "@/lib/marketing-mock-data";
import MarketingPageCard from "@/components/marketing/MarketingPageCard";

export default function MarketingPage() {
  const router = useRouter();
  const [pages, setPages] = useState<MarketingPage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        setLoading(true);
        const response = await mockMarketingPagesApi();
        setPages(response.data);
      } catch (error) {
        console.error("載入行銷頁面失敗:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, []);

  const handleView = (id: string) => {
    router.push(`/marketing/${id}/preview`);
  };

  const handleEdit = (id: string) => {
    router.push(`/marketing/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    try {
      const success = await mockDeleteMarketingPageApi(id);
      if (success) {
        setPages(pages.filter((page) => page.id !== id));
      }
    } catch (error) {
      console.error("刪除行銷頁面失敗:", error);
      alert("刪除失敗，請稍後再試");
    }
  };

  const handleCreate = () => {
    router.push("/marketing/create");
  };

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 頁面標題 */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">行銷廣告管理</h1>
              <p className="mt-1 text-sm text-gray-600">
                管理您的行銷頁面和廣告區塊
              </p>
            </div>
            <button
              onClick={handleCreate}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              新增行銷頁面
            </button>
          </div>
        </div>

        {/* 行銷頁面列表 */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              行銷頁面列表
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              管理您的行銷活動頁面和內容區塊
            </p>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="mt-2 text-sm text-gray-500">載入中...</p>
            </div>
          ) : pages.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-gray-500">尚無行銷頁面</p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {pages.map((page) => (
                <MarketingPageCard
                  key={page.id}
                  page={page}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
