"use client";

import { useState, useRef, useCallback } from "react";
import { BannerBlock } from "@/types";
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";

interface BannerEditorProps {
  block: BannerBlock;
  onUpdate: (updates: Partial<BannerBlock>) => void;
  onClose: () => void;
}

export default function BannerEditor({
  block,
  onUpdate,
  onClose,
}: BannerEditorProps) {
  const [image, setImage] = useState(block.image || "");
  const [link, setLink] = useState(block.link || "");
  const [alt, setAlt] = useState(block.alt || "");
  const [title, setTitle] = useState(block.title || "");
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onUpdate({
      title,
      image,
      link,
      alt,
    });
    onClose();
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
      setImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleImageUrlChange = (url: string) => {
    setImage(url);
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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">編輯橫幅區塊</h3>
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

        {/* 圖片上傳 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            橫幅圖片
          </label>

          {/* 圖片預覽 */}
          {image ? (
            <div className="mb-4">
              <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden group">
                <img
                  src={image}
                  alt="預覽圖片"
                  className="w-full h-full object-cover"
                />

                {/* 編輯按鈕 */}
                <button
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
                  onClick={() => {
                    setImage("");
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
              className={`w-full h-48 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 ${
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
              value={image}
              onChange={(e) => handleImageUrlChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        {/* 連結設定 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            連結 URL（可選）
          </label>
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="https://example.com"
          />
          <p className="text-sm text-gray-500 mt-1">
            點擊橫幅時會跳轉到這個連結
          </p>
        </div>

        {/* 圖片替代文字 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            圖片替代文字
          </label>
          <input
            type="text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="描述這張圖片的內容"
          />
          <p className="text-sm text-gray-500 mt-1">用於 SEO 和無障礙訪問</p>
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
