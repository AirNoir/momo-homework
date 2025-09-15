import { MarketingPage, PaginatedResponse } from "@/types";

// 生成隨機行銷頁面資料
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
      status: "draft",
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
              "<h2>春季特惠活動</h2><p>全館商品8折起，滿額再送精美禮品！</p>",
          },
          position: 2,
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
          id: "block-6",
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
          id: "block-7",
          type: "product_recommendation",
          title: "新用戶推薦商品",
          content: {
            products: ["product-7", "product-8", "product-9"],
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
          id: "block-8",
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
          id: "block-9",
          type: "flash_sale",
          title: "週末限時秒殺",
          content: {
            products: ["product-10", "product-11", "product-12"],
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

// 模擬 API 延遲
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 模擬行銷頁面列表 API
export const mockMarketingPagesApi = async (
  page: number = 1,
  limit: number = 10,
  sortBy?: string,
  sortOrder: "asc" | "desc" = "desc"
): Promise<PaginatedResponse<MarketingPage>> => {
  await delay(500);

  initializeStorage();
  const allPages = [...mockPagesStorage];

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

// 模擬單一行銷頁面 API
export const mockMarketingPageApi = async (
  id: string
): Promise<MarketingPage | null> => {
  await delay(300);

  initializeStorage();
  return mockPagesStorage.find((page) => page.id === id) || null;
};

// 模擬創建行銷頁面 API
export const mockCreateMarketingPageApi = async (
  pageData: Omit<MarketingPage, "id" | "createdAt" | "updatedAt">
): Promise<MarketingPage> => {
  await delay(800);

  initializeStorage();

  const newPage: MarketingPage = {
    ...pageData,
    id: `marketing-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // 將新頁面添加到存儲中
  mockPagesStorage.push(newPage);

  return newPage;
};

// 模擬更新行銷頁面 API
// 模擬內存存儲
let mockPagesStorage: MarketingPage[] = [];

// 初始化存儲
const initializeStorage = () => {
  if (mockPagesStorage.length === 0) {
    mockPagesStorage = generateMockMarketingPages();
  }
};

export const mockUpdateMarketingPageApi = async (
  id: string,
  pageData: Partial<MarketingPage>
): Promise<MarketingPage | null> => {
  await delay(600);

  initializeStorage();
  const existingPageIndex = mockPagesStorage.findIndex(
    (page) => page.id === id
  );

  if (existingPageIndex === -1) {
    return null;
  }

  const updatedPage: MarketingPage = {
    ...mockPagesStorage[existingPageIndex],
    ...pageData,
    updatedAt: new Date(),
  };

  // 更新存儲中的數據
  mockPagesStorage[existingPageIndex] = updatedPage;

  return updatedPage;
};

// 模擬刪除行銷頁面 API
export const mockDeleteMarketingPageApi = async (
  id: string
): Promise<boolean> => {
  await delay(400);

  const allPages = generateMockMarketingPages();
  const pageExists = allPages.some((page) => page.id === id);

  return pageExists;
};
