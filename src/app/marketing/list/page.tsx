import { Metadata } from "next";
import Link from "next/link";
import {
  PlusIcon,
  EyeIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { getMarketingPagesServer } from "@/lib/marketing-server-api";
import type { MarketingPage } from "@/types";

export const metadata: Metadata = {
  title: "行銷頁面管理 | 電商後台",
  description: "管理您的行銷頁面和廣告區塊",
};

// SSR 頁面組件
export default async function MarketingListPage() {
  let pages: MarketingPage[] = [];
  let error: string | null = null;

  try {
    const response = await getMarketingPagesServer();
    pages = response.data;
  } catch (err) {
    console.error("載入行銷頁面失敗:", err);
    error = "載入頁面時發生錯誤";
  }

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 頁面標題 */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">行銷頁面管理</h1>
              <p className="mt-1 text-sm text-gray-600">
                管理您的行銷頁面和廣告區塊
              </p>
            </div>
            <Link
              href="/marketing/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              新增行銷頁面
            </Link>
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

          {error ? (
            <div className="p-8 text-center">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          ) : pages.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-gray-500">尚無行銷頁面</p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {pages.map((page) => (
                <MarketingPageCardSSR key={page.id} page={page} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// SSR 版本的頁面卡片組件
function MarketingPageCardSSR({ page }: { page: MarketingPage }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "published":
        return "已發布";
      case "draft":
        return "草稿";
      case "archived":
        return "已封存";
      default:
        return "未知";
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-medium text-gray-900">{page.title}</h3>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                page.status
              )}`}
            >
              {getStatusText(page.status)}
            </span>
            {page.isFlashSale && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                秒殺活動
              </span>
            )}
          </div>

          {page.description && (
            <p className="text-sm text-gray-600 mb-2">{page.description}</p>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>區塊數: {page.blocks.length}</span>
            {page.startDate && (
              <span>
                開始: {new Date(page.startDate).toLocaleDateString("zh-TW")}
              </span>
            )}
            {page.endDate && (
              <span>
                結束: {new Date(page.endDate).toLocaleDateString("zh-TW")}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          {page.status === "published" && (
            <Link
              href={`/page/${page.id}`}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              target="_blank"
              rel="noopener noreferrer"
            >
              <EyeIcon className="h-4 w-4 mr-1" />
              查看前台
            </Link>
          )}

          <Link
            href={`/marketing/${page.id}/preview`}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <EyeIcon className="h-4 w-4 mr-1" />
            預覽
          </Link>

          <Link
            href={`/marketing/${page.id}/edit`}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PencilSquareIcon className="h-4 w-4 mr-1" />
            編輯
          </Link>
        </div>
      </div>
    </div>
  );
}

// 設定頁面重新驗證時間
export const revalidate = 300; // 5分鐘重新驗證一次
