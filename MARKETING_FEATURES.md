# 行銷廣告管理功能

## 功能概述

本系統實現了完整的行銷廣告管理功能，包括行銷頁面的創建、編輯、預覽和刪除。

## 主要功能

### 1. 行銷頁面列表 (`/marketing`)
- 顯示所有行銷頁面的卡片式列表
- 包含標題、狀態、活動日期、是否秒殺活動等資訊
- 提供檢視、編輯、刪除等操作按鈕
- 支援新增行銷頁面功能

### 2. 行銷頁面預覽 (`/marketing/[id]/preview`)
- 完整預覽行銷頁面的最終效果
- 支援多種區塊類型：Banner、商品推薦、秒殺活動、HTML 內容
- 即時顯示商品資訊和活動狀態

### 3. 行銷頁面編輯器 (`/marketing/[id]/edit`)
- 分標籤頁的編輯介面
- **基本資訊**：頁面標題、描述、狀態、活動日期、是否秒殺活動
- **Banner 編輯**：圖片網址、連結、替代文字，支援即時預覽
- **商品推薦**：選擇推薦商品，設定顯示數量
- **內容編輯**：HTML 編輯器，支援即時預覽

### 4. 新增行銷頁面 (`/marketing/create`)
- 與編輯器相同的介面
- 支援創建全新的行銷頁面

## 技術實現

### Mock API
- `mockMarketingPagesApi()`: 獲取行銷頁面列表
- `mockMarketingPageApi()`: 獲取單一行銷頁面
- `mockCreateMarketingPageApi()`: 創建新行銷頁面
- `mockUpdateMarketingPageApi()`: 更新行銷頁面
- `mockDeleteMarketingPageApi()`: 刪除行銷頁面

### 組件架構
- `MarketingPageCard`: 行銷頁面卡片組件
- `ProductSelector`: 商品選擇器組件
- 支援響應式設計和現代 UI 體驗

### 資料結構
```typescript
interface MarketingPage {
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
```

## 使用方式

1. 訪問 `/marketing` 查看行銷頁面列表
2. 點擊「新增行銷頁面」創建新頁面
3. 在編輯器中設定基本資訊、Banner、商品推薦和內容
4. 點擊「預覽」查看最終效果
5. 點擊「儲存」完成編輯

## 特色功能

- **商品選擇器**: 支援從所有商品中選擇推薦商品
- **即時預覽**: Banner 和 HTML 內容支援即時預覽
- **響應式設計**: 適配各種螢幕尺寸
- **狀態管理**: 支援草稿、已發布、已封存等狀態
- **秒殺活動**: 支援限時特價活動標記
- **HTML 編輯**: 支援自定義 HTML 內容

## 注意事項

- HTML 內容編輯器請小心使用，避免 XSS 攻擊
- 商品選擇器會載入所有商品，建議在實際應用中加入分頁和搜尋優化
- Mock API 模擬了真實的網路延遲，提供更真實的用戶體驗
