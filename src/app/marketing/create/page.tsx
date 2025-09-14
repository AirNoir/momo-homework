"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, CheckIcon } from "@heroicons/react/24/outline";
import { MarketingBlock } from "@/types";
import { mockCreateMarketingPageApi } from "@/lib/marketing-mock-data";
import VisualEditor from "@/components/marketing/VisualEditor";
import BlockEditor from "@/components/marketing/BlockEditor";
import PagePreview from "@/components/marketing/PagePreview";

export default function CreateMarketingPage() {
  const router = useRouter();
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

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert("請輸入頁面標題");
      return;
    }

    try {
      setSaving(true);

      // 更新區塊位置
      const updatedBlocks = blocks.map((block, index) => ({
        ...block,
        position: index + 1,
      }));

      const pageData = {
        ...formData,
        startDate: formData.startDate
          ? new Date(formData.startDate)
          : undefined,
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
        blocks: updatedBlocks,
      };

      const newPage = await mockCreateMarketingPageApi(pageData);
      alert("創建成功！");
      // 創建成功後導航到編輯頁面，這樣用戶可以繼續編輯
      router.push(`/marketing/${newPage.id}/edit`);
    } catch (error) {
      console.error("創建失敗:", error);
      alert("創建失敗，請稍後再試");
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
                <p className="mt-1 text-sm text-gray-600">
                  創建新的行銷活動頁面
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                <CheckIcon className="h-4 w-4 mr-2" />
                {saving ? "新增中..." : "新增行銷頁面"}
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
