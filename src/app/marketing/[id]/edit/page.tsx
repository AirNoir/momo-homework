"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon, CheckIcon, EyeIcon } from "@heroicons/react/24/outline";
import { MarketingPage, MarketingBlock } from "@/types";
import {
  mockMarketingPageApi,
  mockUpdateMarketingPageApi,
} from "@/lib/marketing-mock-data";
import VisualEditor from "@/components/marketing/VisualEditor";
import BlockEditor from "@/components/marketing/BlockEditor";
import PagePreview from "@/components/marketing/PagePreview";

export default function MarketingEditPage() {
  const params = useParams();
  const router = useRouter();
  const [page, setPage] = useState<MarketingPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [blocks, setBlocks] = useState<MarketingBlock[]>([]);
  const [editingBlock, setEditingBlock] = useState<MarketingBlock | null>(null);

  // 表單狀態
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "draft" as "draft" | "published" | "archived",
    startDate: "",
    endDate: "",
    isFlashSale: false,
  });

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        const pageData = await mockMarketingPageApi(params.id as string);
        if (pageData) {
          setPage(pageData);
          setBlocks(pageData.blocks);
          setFormData({
            title: pageData.title,
            description: pageData.description || "",
            status: pageData.status,
            startDate: pageData.startDate
              ? pageData.startDate.toISOString().split("T")[0]
              : "",
            endDate: pageData.endDate
              ? pageData.endDate.toISOString().split("T")[0]
              : "",
            isFlashSale: pageData.isFlashSale,
          });
        }
      } catch (error) {
        console.error("載入行銷頁面失敗:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [params.id]);

  const handleSave = async () => {
    try {
      setSaving(true);

      // 更新區塊位置
      const updatedBlocks = blocks.map((block, index) => ({
        ...block,
        position: index + 1,
      }));

      const updateData = {
        ...formData,
        startDate: formData.startDate
          ? new Date(formData.startDate)
          : undefined,
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
        blocks: updatedBlocks,
      };

      await mockUpdateMarketingPageApi(params.id as string, updateData);
      alert("儲存成功！");
      router.push("/marketing");
    } catch (error) {
      console.error("儲存失敗:", error);
      alert("儲存失敗，請稍後再試");
    } finally {
      setSaving(false);
    }
  };

  const handleBlocksChange = (newBlocks: MarketingBlock[]) => {
    setBlocks(newBlocks);
  };

  const handleEditBlock = (block: MarketingBlock) => {
    setEditingBlock(block);
  };

  const handleSaveBlock = (updatedBlock: MarketingBlock) => {
    setBlocks(
      blocks.map((block) =>
        block.id === updatedBlock.id ? updatedBlock : block
      )
    );
    setEditingBlock(null);
  };

  const handleCancelEdit = () => {
    setEditingBlock(null);
  };

  if (loading) {
    return (
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-sm text-gray-500">載入中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">頁面不存在</h1>
            <p className="mt-2 text-sm text-gray-500">找不到指定的行銷頁面</p>
            <button
              onClick={() => router.back()}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              返回
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                <h1 className="text-2xl font-bold text-gray-900">
                  可視化編輯器
                </h1>
                <p className="mt-1 text-sm text-gray-600">{page.title}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={async () => {
                  try {
                    // 先保存當前的編輯狀態
                    const updateData = {
                      ...page,
                      title: formData.title,
                      description: formData.description,
                      status: formData.status as
                        | "draft"
                        | "published"
                        | "archived",
                      startDate: formData.startDate
                        ? new Date(formData.startDate)
                        : undefined,
                      endDate: formData.endDate
                        ? new Date(formData.endDate)
                        : undefined,
                      blocks: blocks,
                    };

                    await mockUpdateMarketingPageApi(
                      params.id as string,
                      updateData
                    );
                    // 保存成功後導航到預覽頁面
                    router.push(`/marketing/${page.id}/preview`);
                  } catch (error) {
                    console.error("保存失敗:", error);
                    alert("保存失敗，請稍後再試");
                  }
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                <EyeIcon className="h-4 w-4 mr-2" />
                預覽
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                <CheckIcon className="h-4 w-4 mr-2" />
                {saving ? "儲存中..." : "儲存"}
              </button>
            </div>
          </div>
        </div>

        {/* 基本資訊編輯 */}
        <div className="mb-6 bg-white shadow-sm border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">基本資訊</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                頁面標題 *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="輸入頁面標題"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                狀態
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as
                      | "draft"
                      | "published"
                      | "archived",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="draft">草稿</option>
                <option value="published">已發布</option>
                <option value="archived">已封存</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                活動開始日期
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                活動結束日期
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              活動內容
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="輸入活動內容"
            />
          </div>

          <div className="mt-6 flex items-center">
            <input
              type="checkbox"
              id="isFlashSale"
              checked={formData.isFlashSale}
              onChange={(e) =>
                setFormData({ ...formData, isFlashSale: e.target.checked })
              }
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isFlashSale"
              className="ml-2 block text-sm text-gray-900"
            >
              是否為秒殺活動
            </label>
          </div>
        </div>

        {/* 可視化編輯器和預覽 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左側：區塊編輯器 */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              區塊編輯器
            </h3>
            <VisualEditor
              blocks={blocks}
              onBlocksChange={handleBlocksChange}
              onEditBlock={handleEditBlock}
            />
          </div>

          {/* 右側：即時預覽 */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">即時預覽</h3>
            <PagePreview
              blocks={blocks}
              title={formData.title}
              description={formData.description}
            />
          </div>
        </div>

        {/* 區塊編輯彈窗 */}
        {editingBlock && (
          <BlockEditor
            block={editingBlock}
            onSave={handleSaveBlock}
            onCancel={handleCancelEdit}
          />
        )}
      </div>
    </div>
  );
}
