# 電商內容後台系統 (CMS)

一個基於 Next.js 的現代化電商內容管理系統，提供行銷與商品部門使用的完整解決方案。

## 🎯 專案概述

本專案為電商內容後台系統，實現了完整的頁面編輯器和前台渲染功能，支援多種區塊類型的拖拉排序編輯，並具備 SEO 優化和高效能渲染機制。

### 核心功能

1. **後台編輯器**：可編輯頁面 (Page) 與區塊 (Block)
   - Banner 橫幅廣告
   - 商品推薦區塊
   - 限時秒殺活動
   - HTML 自定義區塊

2. **即時預覽**：編輯過程中可即時查看頁面效果

3. **前台渲染器**：依據編輯器輸出資訊進行頁面渲染

4. **SEO 優化**：內建完整的 SEO 配置和元數據管理

5. **效能優化**：採用適當的渲染策略確保最佳效能

## 🏗️ 系統架構設計

### 整體架構

#### 🎨 前端應用層

**後台編輯器 (CMS)**
- 頁面編輯器
- 區塊編輯器
- 拖拉排序
- 即時預覽

**前台渲染器 (Frontend)**
- 頁面渲染
- 區塊渲染
- SEO 優化
- 效能優化

#### 📊 資料管理層
- React Query (狀態管理)
- Mock API (模擬後端)
- TypeScript 型別定義
- 資料快取與同步

#### 🏗️ 基礎設施層
- Next.js 14 (App Router)
- Tailwind CSS (樣式)
- DND Kit (拖拉功能)
- Headless UI (UI 組件)

### 資料流架構

```
編輯器 → 區塊資料 → 預覽渲染 → 儲存 → 前台渲染
   ↓         ↓         ↓        ↓        ↓
頁面編輯   區塊配置   即時預覽   API儲存   SEO渲染
```

## 🚀 渲染策略選型

### 採用策略：混合渲染 (Hybrid Rendering)

1. **靜態生成 (SSG)** - 用於行銷頁面
   - 預先生成靜態頁面，載入速度極快
   - 適合內容相對固定的行銷頁面
   - SEO 友善，搜尋引擎易於索引

2. **伺服器端渲染 (SSR)** - 用於動態內容
   - 即時渲染商品推薦等動態區塊
   - 確保內容即時性
   - 支援個人化推薦

3. **客戶端渲染 (CSR)** - 用於編輯器
   - 後台編輯器採用 CSR，提供最佳互動體驗
   - 即時預覽和拖拉排序功能

### 選型原因

- **SEO 優化**：靜態生成確保搜尋引擎友善
- **效能考量**：混合策略平衡載入速度和內容即時性
- **使用者體驗**：編輯器使用 CSR 提供流暢互動
- **擴展性**：支援未來多商店、多 Campaign 需求

## 📁 專案結構

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # 根布局
│   ├── page.tsx             # 首頁
│   ├── marketing/           # 行銷頁面管理
│   │   ├── page.tsx        # 行銷頁面列表
│   │   ├── create/         # 新建行銷頁面
│   │   └── [id]/           # 動態路由
│   │       ├── edit/       # 編輯頁面
│   │       └── preview/    # 預覽頁面
│   └── products/           # 商品管理
│       ├── page.tsx        # 商品列表
│       ├── create/         # 新建商品
│       └── [id]/           # 商品詳情
├── components/              # React 組件
│   ├── layout/             # 布局組件
│   │   ├── Header.tsx      # 頁首
│   │   └── Footer.tsx      # 頁尾
│   ├── marketing/          # 行銷相關組件
│   │   ├── BlockEditor.tsx    # 區塊編輯器
│   │   ├── VisualEditor.tsx   # 視覺化編輯器
│   │   ├── PagePreview.tsx    # 頁面預覽
│   │   └── ProductSelector.tsx # 商品選擇器
│   ├── products/           # 商品相關組件
│   │   ├── ProductCard.tsx    # 商品卡片
│   │   ├── ProductFilters.tsx # 商品篩選
│   │   └── editors/           # 各種編輯器
│   │       ├── BannerEditor.tsx
│   │       ├── FlashSaleEditor.tsx
│   │       ├── HtmlBlockEditor.tsx
│   │       └── ProductRecommendationEditor.tsx
│   ├── providers/          # Context Providers
│   │   ├── QueryProvider.tsx  # React Query
│   │   └── DragDropProvider.tsx # 拖拉功能
│   └── ui/                 # 基礎 UI 組件
├── hooks/                  # 自定義 Hooks
│   └── useProducts.ts      # 商品相關 Hook
├── lib/                    # 工具函數
│   ├── metadata.ts         # SEO 元數據配置
│   ├── mock-data.ts        # 模擬商品資料
│   └── marketing-mock-data.ts # 模擬行銷資料
├── types/                  # TypeScript 型別定義
│   └── index.ts            # 主要型別定義
├── utils/                  # 工具函數
│   └── classNames.ts       # CSS 類名工具
└── styles/                 # 樣式文件
```

## 🛠️ 技術棧

### 核心技術
- **框架**: Next.js 14 (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **狀態管理**: React Query (TanStack Query)

### UI 與互動
- **UI 組件**: Headless UI
- **圖標**: Heroicons
- **拖拉功能**: @dnd-kit
- **字體**: Inter

### 開發工具
- **程式碼檢查**: ESLint
- **型別檢查**: TypeScript
- **建構工具**: Turbopack (Next.js)

## 🚀 快速開始

### 環境需求
- Node.js 18.0 或更高版本
- npm 或 yarn

### 安裝步驟

1. **複製專案**
```bash
git clone <repository-url>
cd momo-homework
```

2. **安裝相依套件**
```bash
npm install
```

3. **啟動開發伺服器**
```bash
npm run dev
```

4. **開啟瀏覽器**
```
http://localhost:3000
```

### 可用指令

```bash
# 開發模式
npm run dev

# 建構生產版本
npm run build

# 啟動生產伺服器
npm start

# 程式碼檢查
npm run lint
```

## 📋 核心功能實作

### 1. 後台編輯器

#### 頁面編輯器 (`/marketing/create`)
- 支援新建行銷頁面
- 基本資訊設定（標題、描述、活動時間）
- 區塊管理和排序

#### 區塊編輯器
- **Banner 編輯器**: 圖片上傳、連結設定、替代文字
- **商品推薦編輯器**: 商品選擇、顯示數量設定
- **限時秒殺編輯器**: 秒殺商品、時間設定
- **HTML 編輯器**: 自定義 HTML 內容

#### 拖拉排序功能
- 使用 @dnd-kit 實現流暢的拖拉體驗
- 支援區塊重新排序
- 即時更新位置資訊

### 2. 前台渲染器

#### 頁面渲染 (`/marketing/[id]/preview`)
- 根據編輯器資料渲染完整頁面
- 支援各種區塊類型渲染
- 響應式設計適配各種裝置

#### 區塊渲染器
- **Banner 區塊**: 響應式圖片顯示
- **商品推薦**: 商品卡片網格佈局
- **限時秒殺**: 倒數計時器和特價顯示
- **HTML 區塊**: 安全的 HTML 內容渲染

### 3. SEO 優化

#### 元數據管理
- 動態生成頁面標題和描述
- Open Graph 和 Twitter Card 支援
- 結構化數據準備
- Canonical URL 設定

#### 效能優化
- 圖片懶載入和優化
- 程式碼分割和動態載入
- 快取策略實作
- Core Web Vitals 優化

## 🔧 擴展性設計

### 多商店支援
```typescript
interface StoreConfig {
  id: string;
  name: string;
  domain: string;
  theme: ThemeConfig;
  features: FeatureFlags;
}
```

### 多 Campaign 支援
```typescript
interface Campaign {
  id: string;
  storeId: string;
  type: 'seasonal' | 'flash_sale' | 'brand' | 'category';
  targeting: TargetingRules;
  schedule: CampaignSchedule;
}
```

### A/B 測試架構
建議在 **API 層** 實作 A/B 測試：

**原因**：
- 統一管理測試邏輯
- 避免前端快取影響
- 支援伺服器端個人化
- 便於數據收集和分析

```typescript
interface ABTestConfig {
  testId: string;
  variants: Variant[];
  trafficAllocation: number;
  targetingRules: TargetingRules;
}
```

## 🚀 效能優化方案

### 商品數量超過 10 萬筆的優化策略

1. **資料庫優化**
   - 建立適當索引
   - 分頁查詢和虛擬滾動
   - 資料快取策略

2. **前端優化**
   - 虛擬化列表渲染
   - 圖片懶載入
   - 無限滾動載入

3. **API 優化**
   - GraphQL 精確查詢
   - 資料預載和快取
   - CDN 加速靜態資源

4. **搜尋優化**
   - Elasticsearch 全文搜尋
   - 搜尋結果快取
   - 智能搜尋建議

## 🧪 測試策略

### 單元測試
- 組件功能測試
- Hook 邏輯測試
- 工具函數測試

### 整合測試
- API 整合測試
- 頁面渲染測試
- 使用者流程測試

### E2E 測試
- 完整編輯流程
- 頁面發布流程
- 跨瀏覽器相容性

## 📈 監控與分析

### 效能監控
- Core Web Vitals 追蹤
- 載入時間分析
- 錯誤監控和告警

### 使用者分析
- 編輯器使用情況
- 頁面瀏覽數據
- 轉換率追蹤

## 🔒 安全性考量

### 內容安全
- HTML 內容清理和過濾
- XSS 攻擊防護
- CSRF 保護機制

### 權限管理
- 角色權限控制
- API 存取限制
- 資料驗證和清理

## 📝 開發指南

### 新增區塊類型

1. **定義型別**
```typescript
// src/types/index.ts
interface CustomBlock {
  id: string;
  type: "custom_block";
  content: {
    // 自定義內容結構
  };
}
```

2. **建立編輯器**
```typescript
// src/components/products/editors/CustomBlockEditor.tsx
export default function CustomBlockEditor({ block, onUpdate, onClose }) {
  // 編輯器實作
}
```

3. **建立渲染器**
```typescript
// 在 PagePreview.tsx 中新增渲染邏輯
case "custom_block":
  return <CustomBlockRenderer block={block} />;
```

### 新增頁面路由

1. 在 `src/app/` 下建立資料夾結構
2. 新增 `page.tsx` 檔案
3. 配置頁面特定的 metadata
4. 實作頁面組件

## 🤝 貢獻指南

### 程式碼規範
- 使用 TypeScript 嚴格模式
- 遵循 ESLint 規則
- 使用 Prettier 格式化程式碼

### 提交規範
- 使用語意化提交訊息
- 包含適當的測試
- 更新相關文檔

## 📄 授權

MIT License

---

## 🎯 作業完成度檢查

- ✅ **架構設計**：完整的系統架構和資料流設計
- ✅ **渲染策略**：混合渲染策略，兼顧 SEO 和效能
- ✅ **後台編輯器**：支援多種區塊類型的拖拉排序編輯
- ✅ **即時預覽**：編輯過程中的即時頁面預覽
- ✅ **前台渲染器**：完整的頁面和區塊渲染系統
- ✅ **擴展性考量**：多商店、多 Campaign、A/B 測試架構
- ✅ **效能優化**：大量商品的優化策略
- ✅ **SEO 支援**：完整的 SEO 優化實作

本專案展示了完整的電商內容管理系統實作，從後台編輯到前台渲染，涵蓋了現代 Web 應用的各個面向。