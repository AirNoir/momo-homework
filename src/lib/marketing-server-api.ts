import { MarketingPage, MarketingBlock, PaginatedResponse } from "@/types";

// 生成隨機行銷頁面資料 (與原版相同，但針對伺服器端優化)
export const generateMockMarketingPages = (): MarketingPage[] => {
  const pages: MarketingPage[] = [
    {
      id: "marketing-1",
      title: "首頁行銷活動",
      description: "包含 Banner、商品推薦和秒殺活動",
      status: "published",
      startDate: new Date("2024-01-15"),
      endDate: new Date("2024-02-15"),
      isFlashSale: true,
      blocks: [
        {
          id: "block-1",
          type: "banner",
          title: "主橫幅廣告",
          content: {
            image: "https://picsum.photos/1200/400?random=1",
            link: "/products",
            alt: "春季特惠活動",
          },
          position: 1,
          isVisible: true,
        },
        {
          id: "block-2",
          type: "product_recommendation",
          title: "熱銷商品推薦",
          content: {
            products: ["product-1", "product-2", "product-3", "product-4"],
            displayCount: 4,
          },
          position: 2,
          isVisible: true,
        },
        {
          id: "block-3",
          type: "flash_sale",
          title: "限時秒殺",
          content: {
            products: ["product-5", "product-6"],
            startTime: new Date("2024-01-15T10:00:00"),
            endTime: new Date("2024-01-15T22:00:00"),
          },
          position: 3,
          isVisible: true,
        },
      ],
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-20"),
    },
    {
      id: "marketing-2",
      title: "春季特惠頁面",
      description: "春季商品特價活動專頁",
      status: "published", // 改為 published 以便測試
      startDate: new Date("2024-02-01"),
      endDate: new Date("2024-03-31"),
      isFlashSale: false,
      blocks: [
        {
          id: "block-4",
          type: "banner",
          title: "春季特惠橫幅",
          content: {
            image: "https://picsum.photos/1200/400?random=2",
            link: "/spring-sale",
            alt: "春季特惠",
          },
          position: 1,
          isVisible: true,
        },
        {
          id: "block-5",
          type: "html_block",
          title: "活動說明",
          content: {
            htmlContent:
              "<h2>春季特惠活動</h2><p>全館商品8折起，滿額再送精美禮品！</p><ul><li>全館商品 8 折起</li><li>滿 $2000 免運費</li><li>滿 $5000 送限量禮品</li></ul>",
          },
          position: 2,
          isVisible: true,
        },
        {
          id: "block-6",
          type: "product_recommendation",
          title: "春季推薦商品",
          content: {
            products: ["product-7", "product-8", "product-9", "product-10"],
            displayCount: 4,
          },
          position: 3,
          isVisible: true,
        },
      ],
      createdAt: new Date("2024-01-18"),
      updatedAt: new Date("2024-01-22"),
    },
    {
      id: "marketing-3",
      title: "新用戶專區",
      description: "新用戶註冊優惠和推薦商品",
      status: "archived",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-01-31"),
      isFlashSale: false,
      blocks: [
        {
          id: "block-7",
          type: "banner",
          title: "新用戶歡迎",
          content: {
            image: "https://picsum.photos/1200/400?random=3",
            link: "/register",
            alt: "新用戶專區",
          },
          position: 1,
          isVisible: true,
        },
        {
          id: "block-8",
          type: "product_recommendation",
          title: "新用戶推薦商品",
          content: {
            products: ["product-11", "product-12", "product-13"],
            displayCount: 3,
          },
          position: 2,
          isVisible: true,
        },
      ],
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-25"),
    },
    {
      id: "marketing-4",
      title: "週末特賣",
      description: "週末限時特賣活動",
      status: "published",
      startDate: new Date("2024-01-27"),
      endDate: new Date("2024-01-28"),
      isFlashSale: true,
      blocks: [
        {
          id: "block-9",
          type: "banner",
          title: "週末特賣橫幅",
          content: {
            image: "https://picsum.photos/1200/400?random=4",
            link: "/weekend-sale",
            alt: "週末特賣",
          },
          position: 1,
          isVisible: true,
        },
        {
          id: "block-10",
          type: "flash_sale",
          title: "週末限時秒殺",
          content: {
            products: ["product-14", "product-15", "product-16"],
            startTime: new Date("2024-01-27T09:00:00"),
            endTime: new Date("2024-01-28T23:59:59"),
          },
          position: 2,
          isVisible: true,
        },
      ],
      createdAt: new Date("2024-01-25"),
      updatedAt: new Date("2024-01-26"),
    },
  ];

  return pages;
};

// 伺服器端 API 函數 (無延遲，適合 SSG/SSR)
const mockPagesData = generateMockMarketingPages();

// 獲取行銷頁面列表 (伺服器端版本)
export const getMarketingPagesServer = async (
  page: number = 1,
  limit: number = 10,
  sortBy?: string,
  sortOrder: "asc" | "desc" = "desc"
): Promise<PaginatedResponse<MarketingPage>> => {
  const allPages = [...mockPagesData];

  // 排序
  if (sortBy) {
    allPages.sort((a, b) => {
      const aValue = a[sortBy as keyof MarketingPage];
      const bValue = b[sortBy as keyof MarketingPage];

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortOrder === "asc"
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });
  }

  const total = allPages.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const data = allPages.slice(startIndex, endIndex);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

// 獲取單一行銷頁面 (伺服器端版本)
export const getMarketingPageServer = async (
  id: string
): Promise<MarketingPage | null> => {
  return mockPagesData.find((page) => page.id === id) || null;
};

// 獲取已發布的頁面列表 (用於 generateStaticParams)
export const getPublishedMarketingPagesServer = async (): Promise<
  MarketingPage[]
> => {
  return mockPagesData.filter((page) => page.status === "published");
};

// 為了與現有的客戶端 API 保持兼容，重新導出原始函數
export {
  mockMarketingPagesApi,
  mockMarketingPageApi,
  mockCreateMarketingPageApi,
  mockUpdateMarketingPageApi,
  mockDeleteMarketingPageApi,
} from "./marketing-mock-data";
