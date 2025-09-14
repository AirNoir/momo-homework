// 產品相關類型定義
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  category: string;
  tags: string[];
  stock: number;
  status: "active" | "inactive" | "out_of_stock";
  brand?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  rating?: number;
  reviewCount?: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// 分頁相關類型定義
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// 廣告相關類型定義
export interface Advertisement {
  id: string;
  productId: string;
  title: string;
  content: string;
  targetAudience: string;
  budget: number;
  startDate: Date;
  endDate: Date;
  status: "draft" | "active" | "paused" | "completed";
  metrics: AdvertisementMetrics;
}

// 廣告指標類型定義
export interface AdvertisementMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number; // Click-through rate
  cpc: number; // Cost per click
  roas: number; // Return on ad spend
}

// SEO 相關類型定義
export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: Record<string, unknown>;
}

// 表單相關類型定義
export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  images: File[];
  category: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
}

export interface AdvertisementFormData {
  productId: string;
  title: string;
  content: string;
  targetAudience: string;
  budget: number;
  startDate: string;
  endDate: string;
}

// 行銷廣告管理相關類型定義
export interface MarketingPage {
  id: string;
  title: string;
  description?: string;
  blocks: MarketingBlock[];
  status: "draft" | "published" | "archived";
  startDate?: Date;
  endDate?: Date;
  isFlashSale: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MarketingBlock {
  id: string;
  type:
    | "banner"
    | "product_recommendation"
    | "flash_sale"
    | "html_block"
    | "carousel";
  title?: string;
  content: Record<string, unknown>; // 可以是不同類型的內容
  position: number;
  isVisible: boolean;
  config?: Record<string, unknown>;
}

// 商品頁面區塊類型定義
export type ProductPageBlock = MarketingBlock;

export interface BannerBlock {
  id: string;
  type: "banner";
  title?: string;
  image: string;
  link?: string;
  alt?: string;
  position: number;
  isVisible: boolean;
}

export interface ProductRecommendationBlock {
  id: string;
  type: "product_recommendation";
  title?: string;
  products: string[]; // Product IDs
  displayCount: number;
  position: number;
  isVisible: boolean;
}

export interface FlashSaleBlock {
  id: string;
  type: "flash_sale";
  title?: string;
  products: string[]; // Product IDs with special pricing
  startTime: Date;
  endTime: Date;
  position: number;
  isVisible: boolean;
}

export interface HtmlBlock {
  id: string;
  type: "html_block";
  title?: string;
  htmlContent: string;
  position: number;
  isVisible: boolean;
}
