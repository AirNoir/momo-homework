# 電商行銷平台

一個基於 Next.js 的現代化電商行銷網站，提供產品廣告編輯與 SEO 優化功能。

## 技術棧

- **框架**: Next.js 14 (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **UI 組件**: Headless UI
- **圖標**: Heroicons
- **字體**: Inter

## 功能特色

- 📦 **產品管理**: 完整的產品資訊管理系統
- 📢 **廣告編輯**: 直觀的廣告編輯器
- 🔍 **SEO 優化**: 內建 SEO 優化工具
- 📊 **數據分析**: 廣告效果追蹤與分析
- 🎨 **響應式設計**: 支援各種裝置尺寸

## 項目結構

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首頁
├── components/            # React 組件
│   ├── layout/           # 布局組件
│   │   ├── Header.tsx    # 頁首
│   │   └── Footer.tsx    # 頁尾
│   ├── ui/               # UI 組件
│   ├── forms/            # 表單組件
│   └── ...
├── lib/                  # 工具函數
│   └── metadata.ts       # SEO 元數據配置
├── types/                # TypeScript 類型定義
│   └── index.ts
├── hooks/                # 自定義 Hooks
├── utils/                # 工具函數
│   └── classNames.ts     # CSS 類名工具
└── styles/               # 樣式文件
```

## 開始使用

1. 安裝依賴:
```bash
npm install
```

2. 啟動開發服務器:
```bash
npm run dev
```

3. 在瀏覽器中打開 [http://localhost:3000](http://localhost:3000)

## 可用腳本

- `npm run dev` - 啟動開發服務器
- `npm run build` - 建構生產版本
- `npm run start` - 啟動生產服務器
- `npm run lint` - 執行 ESLint 檢查

## SEO 配置

項目已配置完整的 SEO 設定，包括：

- Meta 標籤自動生成
- Open Graph 支援
- Twitter Card 支援
- 結構化數據準備
- 響應式設計

## 開發指南

### 添加新頁面

1. 在 `src/app/` 目錄下創建新的路由文件夾
2. 添加 `page.tsx` 文件
3. 配置頁面特定的 metadata

### 添加新組件

1. 在 `src/components/` 下創建組件文件
2. 使用 TypeScript 和 Tailwind CSS
3. 遵循現有的命名慣例

### 樣式指南

- 使用 Tailwind CSS 進行樣式設計
- 遵循響應式設計原則
- 使用 `classNames` 工具函數處理條件樣式

## 部署

項目已配置好部署設定，支援：

- Vercel (推薦)
- Netlify
- 其他支援 Next.js 的平台

## 授權

MIT License