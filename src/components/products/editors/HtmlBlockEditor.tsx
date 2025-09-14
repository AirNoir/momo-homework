"use client";

import { useState } from "react";
import { HtmlBlock } from "@/types";
import {
  XMarkIcon,
  EyeIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";

interface HtmlBlockEditorProps {
  block: HtmlBlock;
  onUpdate: (updates: Partial<HtmlBlock>) => void;
  onClose: () => void;
}

export default function HtmlBlockEditor({
  block,
  onUpdate,
  onClose,
}: HtmlBlockEditorProps) {
  const [title, setTitle] = useState(block.title || "");
  const [htmlContent, setHtmlContent] = useState(block.htmlContent || "");
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = () => {
    onUpdate({
      title,
      htmlContent,
    });
    onClose();
  };

  const insertHtmlTag = (tag: string) => {
    const textarea = document.getElementById(
      "html-content"
    ) as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = htmlContent.substring(start, end);

      let newText = "";
      switch (tag) {
        case "h1":
          newText = `<h1 class="text-3xl font-bold mb-4">${
            selectedText || "標題"
          }</h1>`;
          break;
        case "h2":
          newText = `<h2 class="text-2xl font-semibold mb-3">${
            selectedText || "副標題"
          }</h2>`;
          break;
        case "p":
          newText = `<p class="mb-3">${selectedText || "段落文字"}</p>`;
          break;
        case "strong":
          newText = `<strong class="font-semibold">${
            selectedText || "粗體文字"
          }</strong>`;
          break;
        case "em":
          newText = `<em class="italic">${selectedText || "斜體文字"}</em>`;
          break;
        case "link":
          newText = `<a href="#" class="text-blue-600 hover:underline">${
            selectedText || "連結文字"
          }</a>`;
          break;
        case "button":
          newText = `<button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">${
            selectedText || "按鈕"
          }</button>`;
          break;
        case "div":
          newText = `<div class="p-4 bg-gray-100 rounded">${
            selectedText || "區塊內容"
          }</div>`;
          break;
        case "img":
          newText = `<img src="https://via.placeholder.com/400x200" alt="圖片描述" class="rounded">`;
          break;
        case "hr":
          newText = `<hr class="my-4 border-gray-300">`;
          break;
        default:
          newText = `<${tag}>${selectedText || "內容"}</${tag}>`;
      }

      const newHtmlContent =
        htmlContent.substring(0, start) + newText + htmlContent.substring(end);
      setHtmlContent(newHtmlContent);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">編輯 HTML 區塊</h3>
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
            placeholder="輸入區塊標題"
          />
        </div>

        {/* 工具列 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            HTML 內容
          </label>
          <div className="flex flex-wrap gap-2 mb-3 p-3 bg-gray-50 rounded-lg">
            <button
              onClick={() => insertHtmlTag("h1")}
              className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
              title="標題 1"
            >
              H1
            </button>
            <button
              onClick={() => insertHtmlTag("h2")}
              className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
              title="標題 2"
            >
              H2
            </button>
            <button
              onClick={() => insertHtmlTag("p")}
              className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
              title="段落"
            >
              P
            </button>
            <button
              onClick={() => insertHtmlTag("strong")}
              className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
              title="粗體"
            >
              <strong>B</strong>
            </button>
            <button
              onClick={() => insertHtmlTag("em")}
              className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
              title="斜體"
            >
              <em>I</em>
            </button>
            <button
              onClick={() => insertHtmlTag("link")}
              className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
              title="連結"
            >
              A
            </button>
            <button
              onClick={() => insertHtmlTag("button")}
              className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
              title="按鈕"
            >
              BTN
            </button>
            <button
              onClick={() => insertHtmlTag("div")}
              className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
              title="區塊"
            >
              DIV
            </button>
            <button
              onClick={() => insertHtmlTag("img")}
              className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
              title="圖片"
            >
              IMG
            </button>
            <button
              onClick={() => insertHtmlTag("hr")}
              className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
              title="分隔線"
            >
              HR
            </button>
          </div>
        </div>

        {/* 編輯區域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* HTML 編輯器 */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CodeBracketIcon className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                HTML 原始碼
              </span>
            </div>
            <textarea
              id="html-content"
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
              placeholder="輸入 HTML 內容..."
            />
          </div>

          {/* 預覽區域 */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <EyeIcon className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                即時預覽
              </span>
            </div>
            <div className="h-64 border border-gray-300 rounded-md p-4 overflow-y-auto bg-white">
              {htmlContent ? (
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
              ) : (
                <p className="text-gray-500 text-sm">預覽將在這裡顯示</p>
              )}
            </div>
          </div>
        </div>

        {/* 常用模板 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">常用模板</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() =>
                setHtmlContent(`
<div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
  <h2 class="text-2xl font-bold mb-2">特別優惠</h2>
  <p class="mb-4">限時特價，錯過就沒有了！</p>
  <button class="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100">立即購買</button>
</div>`)
              }
              className="p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50"
            >
              <h5 className="font-medium text-sm">優惠橫幅</h5>
              <p className="text-xs text-gray-500">漸層背景的優惠提示</p>
            </button>

            <button
              onClick={() =>
                setHtmlContent(`
<div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
  <h3 class="text-xl font-semibold mb-3">商品特色</h3>
  <ul class="space-y-2">
    <li class="flex items-center">
      <span class="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
      高品質材料
    </li>
    <li class="flex items-center">
      <span class="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
      快速配送
    </li>
    <li class="flex items-center">
      <span class="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
      售後服務
    </li>
  </ul>
</div>`)
              }
              className="p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50"
            >
              <h5 className="font-medium text-sm">特色列表</h5>
              <p className="text-xs text-gray-500">帶圖示的特色說明</p>
            </button>

            <button
              onClick={() =>
                setHtmlContent(`
<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
  <div class="flex items-center">
    <div class="flex-shrink-0">
      <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
    </div>
    <div class="ml-3">
      <p class="text-sm text-yellow-800">
        注意事項：請仔細閱讀商品說明
      </p>
    </div>
  </div>
</div>`)
              }
              className="p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50"
            >
              <h5 className="font-medium text-sm">注意事項</h5>
              <p className="text-xs text-gray-500">黃色警告框</p>
            </button>

            <button
              onClick={() =>
                setHtmlContent(`
<div class="text-center py-8">
  <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
    <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
    </svg>
  </div>
  <h3 class="text-lg font-semibold text-gray-900 mb-2">購買成功</h3>
  <p class="text-gray-600">感謝您的購買，我們將盡快處理您的訂單。</p>
</div>`)
              }
              className="p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50"
            >
              <h5 className="font-medium text-sm">成功訊息</h5>
              <p className="text-xs text-gray-500">帶圖示的成功提示</p>
            </button>
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
