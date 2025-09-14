# 渲染策略實現說明

## 🎯 渲染策略概覽

本專案實現了完整的混合渲染策略，針對不同類型的頁面採用最適合的渲染方式：

### 📊 渲染策略分配

| 頁面類型 | 渲染策略 | 路由 | 原因 |
|---------|---------|------|------|
| 前台行銷頁面 | SSG + ISR | `/page/[id]` | SEO 友善、載入速度快 |
| 後台管理列表 | SSR | `/marketing/list` | 即時數據、伺服器端渲染 |
| 後台編輯器 | CSR | `/marketing/create`, `/marketing/[id]/edit` | 複雜互動、即時編輯 |
| 商品頁面 | CSR | `/products` | 現有實現保持不變 |

## 🚀 SSG (靜態生成) 實現

### 1. 前台行銷頁面 (`/page/[id]`)

**特點：**
- 使用 `generateStaticParams()` 在 build 時預生成所有已發布的行銷頁面
- 使用 `generateMetadata()` 動態生成 SEO 標籤
- 支援 ISR (Incremental Static Regeneration)，每小時重新驗證
- 完整的結構化數據 (JSON-LD) 支援

**實現細節：**
```typescript
// 靜態參數生成
export async function generateStaticParams() {
  const pages = await getPublishedMarketingPagesServer();
  return pages.map((page) => ({ id: page.id }));
}

// 動態 SEO 標籤生成
export async function generateMetadata({ params }): Promise<Metadata> {
  const page = await getMarketingPageServer(params.id);
  return {
    title: page.title,
    description: page.description,
    openGraph: { /* ... */ },
    // 結構化數據
    other: {
      'application/ld+json': JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": page.title,
        // ...
      })
    }
  };
}

// ISR 設定
export const revalidate = 3600; // 每小時重新生成
```

**SEO 優化：**
- 動態生成頁面標題和描述
- Open Graph 和 Twitter Card 支援
- 結構化數據 (Schema.org)
- 自動生成 sitemap
- 圖片優化 (Next.js Image 組件)

## 🔄 SSR (伺服器端渲染) 實現

### 1. 後台管理列表 (`/marketing/list`)

**特點：**
- 每次請求時在伺服器端渲染
- 確保管理者看到最新的頁面狀態
- 支援頁面重新驗證 (5分鐘)

**實現細節：**
```typescript
// SSR 頁面組件 (無 "use client")
export default async function MarketingListPage() {
  const response = await getMarketingPagesServer();
  const pages = response.data;
  
  return (
    <div>
      {/* 伺服器端渲染的內容 */}
    </div>
  );
}

// 設定重新驗證時間
export const revalidate = 300; // 5分鐘
```

## 💻 CSR (客戶端渲染) 保留

### 1. 後台編輯器
- 保持現有的 `"use client"` 實現
- 支援複雜的拖拉排序互動
- 即時預覽功能
- 表單狀態管理

### 2. 商品管理頁面
- 保持現有實現不變
- 使用 React Query 進行狀態管理

## 🏗️ 架構優化

### 1. API 分層

**客戶端 API (`marketing-mock-data.ts`):**
- 包含模擬延遲
- 適用於客戶端調用
- 支援狀態管理

**伺服器端 API (`marketing-server-api.ts`):**
- 無延遲，適合 SSG/SSR
- 優化的數據獲取
- 專門的函數如 `getPublishedMarketingPagesServer()`

### 2. 組件分離

**前台渲染器 (`FrontendPageRenderer.tsx`):**
- 專門用於前台展示
- 優化的 SEO 和效能
- 響應式設計

**後台組件:**
- 保持現有的編輯器組件
- 支援管理功能

## 📈 效能優化

### 1. 圖片優化
```typescript
<Image
  src={product.images[0]}
  alt={product.title}
  fill
  className="object-cover"
  priority={block.position <= 2} // 首屏優先載入
  sizes="(max-width: 768px) 50vw, 25vw"
/>
```

### 2. 快取策略
```typescript
// Next.js 配置
async headers() {
  return [
    {
      source: '/page/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      ],
    },
  ];
}
```

### 3. 程式碼分割
- 自動的路由層級程式碼分割
- 優化的套件導入 (`optimizePackageImports`)

## 🔍 SEO 增強

### 1. 自動生成 Sitemap
```typescript
// /sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const publishedPages = await getPublishedMarketingPagesServer();
  return publishedPages.map((page) => ({
    url: `${baseUrl}/page/${page.id}`,
    lastModified: page.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));
}
```

### 2. Robots.txt 配置
```typescript
// /robots.ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/marketing/create', '/marketing/*/edit'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

## 🚀 使用方式

### 1. 開發環境
```bash
npm run dev
```

### 2. 訪問頁面
- **前台頁面 (SSG):** `http://localhost:3000/page/marketing-1`
- **後台管理 (SSR):** `http://localhost:3000/marketing/list`
- **編輯器 (CSR):** `http://localhost:3000/marketing/create`

### 3. 建構生產版本
```bash
npm run build
npm start
```

## 📊 效能指標

### 預期改善：
- **首屏載入時間:** 減少 60-80%（SSG vs CSR）
- **SEO 分數:** 提升到 95+ 分
- **Core Web Vitals:** 全部達到綠色標準
- **快取命中率:** 90%+ 的頁面請求

## 🔧 未來擴展

### 1. 進階快取
- Redis 快取層
- CDN 整合
- 邊緣運算

### 2. 個人化
- 動態內容注入
- A/B 測試支援
- 用戶行為分析

### 3. 國際化
- 多語言 SSG 支援
- 地區化內容

## 📝 注意事項

1. **開發模式:** 所有頁面都會使用 SSR，只有在生產環境才會看到真正的 SSG 效果
2. **Mock 數據:** 目前使用模擬數據，生產環境需要連接真實 API
3. **圖片服務:** 建議使用 CDN 和圖片優化服務
4. **監控:** 建議添加效能監控和錯誤追蹤
