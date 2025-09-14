"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  Bars3Icon,
  PhotoIcon,
  ShoppingBagIcon,
  CodeBracketIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { MarketingBlock } from "@/types";
import ProductSelector from "./ProductSelector";

interface VisualEditorProps {
  blocks: MarketingBlock[];
  onBlocksChange: (blocks: MarketingBlock[]) => void;
  onEditBlock: (block: MarketingBlock) => void;
}

interface BlockItemProps {
  block: MarketingBlock;
  onEdit: () => void;
  onDelete: () => void;
}

function BlockItem({ block, onEdit, onDelete }: BlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getBlockIcon = (type: string) => {
    switch (type) {
      case "banner":
        return <PhotoIcon className="h-5 w-5" />;
      case "product_recommendation":
        return <ShoppingBagIcon className="h-5 w-5" />;
      case "html_block":
        return <CodeBracketIcon className="h-5 w-5" />;
      case "flash_sale":
        return <ClockIcon className="h-5 w-5" />;
      default:
        return <Bars3Icon className="h-5 w-5" />;
    }
  };

  const getBlockTitle = (type: string) => {
    switch (type) {
      case "banner":
        return "Banner 區塊";
      case "product_recommendation":
        return "商品推薦";
      case "html_block":
        return "HTML 內容";
      case "flash_sale":
        return "限時秒殺";
      default:
        return "未知區塊";
    }
  };

  const renderBlockPreview = () => {
    switch (block.type) {
      case "banner":
        return (
          <div className="bg-gray-100 rounded-lg p-4 h-32 flex items-center justify-center">
            {block.content.image ? (
              <img
                src={block.content.image}
                alt={block.content.alt || "Banner"}
                className="max-h-full max-w-full object-contain rounded"
              />
            ) : (
              <div className="text-gray-500 text-center">
                <PhotoIcon className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">未設定圖片</p>
              </div>
            )}
          </div>
        );
      case "product_recommendation":
        return (
          <div className="bg-gray-100 rounded-lg p-4 h-32 flex items-center justify-center">
            <div className="text-gray-500 text-center">
              <ShoppingBagIcon className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">
                {block.content.products?.length || 0} 個商品
              </p>
            </div>
          </div>
        );
      case "html_block":
        return (
          <div className="bg-gray-100 rounded-lg p-4 h-32 flex items-center justify-center">
            <div className="text-gray-500 text-center">
              <CodeBracketIcon className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">HTML 內容</p>
            </div>
          </div>
        );
      case "flash_sale":
        return (
          <div className="bg-gray-100 rounded-lg p-4 h-32 flex items-center justify-center">
            <div className="text-gray-500 text-center">
              <ClockIcon className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">
                {block.content.products?.length || 0} 個秒殺商品
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 rounded-lg p-4 h-32 flex items-center justify-center">
            <div className="text-gray-500 text-center">
              <Bars3Icon className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">未知區塊</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-gray-200 rounded-lg p-4 mb-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab hover:cursor-grabbing p-1 text-gray-400 hover:text-gray-600"
          >
            <Bars3Icon className="h-5 w-5" />
          </div>
          <div className="flex items-center space-x-2">
            {getBlockIcon(block.type)}
            <span className="font-medium text-gray-900">
              {block.title || getBlockTitle(block.type)}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
            title="編輯"
          >
            <PencilSquareIcon className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="刪除"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      {renderBlockPreview()}
    </div>
  );
}

export default function VisualEditor({
  blocks,
  onBlocksChange,
  onEditBlock,
}: VisualEditorProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id);
      const newIndex = blocks.findIndex((block) => block.id === over?.id);

      onBlocksChange(arrayMove(blocks, oldIndex, newIndex));
    }
  };

  const addBlock = (type: MarketingBlock["type"]) => {
    const newBlock: MarketingBlock = {
      id: `block-${Date.now()}`,
      type,
      title: getDefaultTitle(type),
      content: getDefaultContent(type),
      position: blocks.length + 1,
      isVisible: true,
    };

    onBlocksChange([...blocks, newBlock]);
    setShowAddMenu(false);
  };

  const getDefaultTitle = (type: MarketingBlock["type"]) => {
    switch (type) {
      case "banner":
        return "Banner 區塊";
      case "product_recommendation":
        return "商品推薦";
      case "html_block":
        return "HTML 內容";
      case "flash_sale":
        return "限時秒殺";
      default:
        return "新區塊";
    }
  };

  const getDefaultContent = (type: MarketingBlock["type"]) => {
    switch (type) {
      case "banner":
        return {
          image: "",
          link: "",
          alt: "",
        };
      case "product_recommendation":
        return {
          products: [],
          displayCount: 4,
        };
      case "html_block":
        return {
          htmlContent: "",
        };
      case "flash_sale":
        return {
          products: [],
          startTime: new Date(),
          endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24小時後
        };
      default:
        return {};
    }
  };

  const deleteBlock = (blockId: string) => {
    if (window.confirm("確定要刪除這個區塊嗎？")) {
      onBlocksChange(blocks.filter((block) => block.id !== blockId));
    }
  };

  const blockTypes = [
    {
      type: "banner" as const,
      name: "Banner 區塊",
      description: "圖片橫幅廣告",
      icon: <PhotoIcon className="h-6 w-6" />,
    },
    {
      type: "product_recommendation" as const,
      name: "商品推薦",
      description: "推薦商品列表",
      icon: <ShoppingBagIcon className="h-6 w-6" />,
    },
    {
      type: "flash_sale" as const,
      name: "限時秒殺",
      description: "限時特價活動",
      icon: <ClockIcon className="h-6 w-6" />,
    },
    {
      type: "html_block" as const,
      name: "HTML 內容",
      description: "自定義 HTML 內容",
      icon: <CodeBracketIcon className="h-6 w-6" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 添加區塊按鈕 */}
      <div className="relative">
        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
        >
          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <PlusIcon className="h-5 w-5" />
            <span className="font-medium">添加新區塊</span>
          </div>
        </button>

        {showAddMenu && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                選擇區塊類型
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {blockTypes.map((blockType) => (
                  <button
                    key={blockType.type}
                    onClick={() => addBlock(blockType.type)}
                    className="flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <div className="text-indigo-600">{blockType.icon}</div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {blockType.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {blockType.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 區塊列表 */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map((block) => block.id)}
          strategy={verticalListSortingStrategy}
        >
          {blocks.map((block) => (
            <BlockItem
              key={block.id}
              block={block}
              onEdit={() => onEditBlock(block)}
              onDelete={() => deleteBlock(block.id)}
            />
          ))}
        </SortableContext>
      </DndContext>

      {blocks.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Bars3Icon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">尚未添加任何區塊</p>
          <p className="text-sm">點擊上方按鈕開始添加區塊</p>
        </div>
      )}
    </div>
  );
}
