"use client";

import {
  MarketingBlock,
  BannerBlock,
  ProductRecommendationBlock,
  FlashSaleBlock,
  HtmlBlock,
} from "@/types";
import BannerEditor from "@/components/products/editors/BannerEditor";
import FlashSaleEditor from "@/components/products/editors/FlashSaleEditor";
import HtmlBlockEditor from "@/components/products/editors/HtmlBlockEditor";
import ProductRecommendationEditor from "@/components/products/editors/ProductRecommendationEditor";

interface BlockEditorProps {
  block: MarketingBlock;
  onSave: (block: MarketingBlock) => void;
  onCancel: () => void;
}

export default function BlockEditor({
  block,
  onSave,
  onCancel,
}: BlockEditorProps) {
  const handleSave = (updatedBlock: MarketingBlock) => {
    onSave(updatedBlock);
  };

  const renderEditor = () => {
    switch (block.type) {
      case "banner":
        const bannerBlock: BannerBlock = {
          ...block,
          type: "banner",
          image: block.content?.image || "",
          link: block.content?.link || "",
          alt: block.content?.alt || "",
        };
        return (
          <BannerEditor
            block={bannerBlock}
            onUpdate={(updates) => {
              // 將 BannerBlock 的更新轉換為 MarketingBlock 的 content 格式
              const newBlock = {
                ...block,
                content: {
                  ...block.content,
                  image:
                    updates.image !== undefined
                      ? updates.image
                      : block.content?.image,
                  link:
                    updates.link !== undefined
                      ? updates.link
                      : block.content?.link,
                  alt:
                    updates.alt !== undefined
                      ? updates.alt
                      : block.content?.alt,
                },
                title:
                  updates.title !== undefined ? updates.title : block.title,
              };
              handleSave(newBlock);
            }}
            onClose={onCancel}
          />
        );

      case "product_recommendation":
        const productBlock: ProductRecommendationBlock = {
          ...block,
          type: "product_recommendation",
          products: block.content?.products || [],
          displayCount: block.content?.displayCount || 4,
        };
        return (
          <ProductRecommendationEditor
            block={productBlock}
            onUpdate={(updates) => {
              const newBlock = {
                ...block,
                content: {
                  ...block.content,
                  products: updates.content?.products || updates.products,
                  displayCount:
                    updates.content?.displayCount || updates.displayCount,
                },
                title:
                  updates.title !== undefined ? updates.title : block.title,
              };
              handleSave(newBlock);
            }}
            onClose={onCancel}
          />
        );

      case "flash_sale":
        const flashSaleBlock: FlashSaleBlock = {
          ...block,
          type: "flash_sale",
          products: block.content?.products || [],
          startTime: block.content?.startTime
            ? new Date(block.content.startTime)
            : new Date(),
          endTime: block.content?.endTime
            ? new Date(block.content.endTime)
            : new Date(),
        };
        return (
          <FlashSaleEditor
            block={flashSaleBlock}
            onUpdate={(updates) => {
              const newBlock = {
                ...block,
                content: {
                  ...block.content,
                  ...updates,
                },
              };
              handleSave(newBlock);
            }}
            onClose={onCancel}
          />
        );

      case "html_block":
        const htmlBlock: HtmlBlock = {
          ...block,
          type: "html_block",
          htmlContent: block.content?.htmlContent || "",
        };
        return (
          <HtmlBlockEditor
            block={htmlBlock}
            onUpdate={(updates) => {
              // 將 HtmlBlock 的更新轉換為 MarketingBlock 的 content 格式
              const newBlock = {
                ...block,
                content: {
                  ...block.content,
                  htmlContent:
                    updates.htmlContent !== undefined
                      ? updates.htmlContent
                      : block.content?.htmlContent,
                },
                title:
                  updates.title !== undefined ? updates.title : block.title,
              };
              handleSave(newBlock);
            }}
            onClose={onCancel}
          />
        );

      default:
        return (
          <div className="p-6">
            <div className="text-center py-8 text-gray-500">
              <p>不支援的區塊類型: {block.type}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] flex flex-col">
        <div className="overflow-y-auto flex-1">{renderEditor()}</div>
      </div>
    </div>
  );
}
