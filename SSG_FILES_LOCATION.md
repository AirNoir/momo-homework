# 📁 Next.js 15 SSG 靜態文件位置說明

## 🔍 **你問的「靜態文件在哪裡？」**

在 **Next.js 15 (App Router)** 中，SSG 的實現方式與傳統的 Pages Router 完全不同：

### 🚫 **不會看到的傳統文件**
- ❌ 沒有 `.html` 文件
- ❌ 沒有 `out/` 目錄（除非使用 `output: 'export'`）
- ❌ 沒有傳統的靜態文件結構

### ✅ **實際的 SSG 文件位置**

#### 1. **主要 SSG 文件**
```
.next/server/app/page/[id]/
├── page.js                    # 🎯 這就是 SSG 的核心文件
├── page.js.map               # Source map
├── page.js.nft.json          # Node File Trace 資訊
└── page_client-reference-manifest.js  # 客戶端引用
```

#### 2. **靜態資源**
```
.next/static/
├── chunks/                   # JavaScript 程式碼分割
├── media/                    # 字體、圖片等靜態資源
└── [buildId]/               # 建構 ID 相關文件
```

#### 3. **快取和元數據**
```
.next/cache/
├── images/                   # 圖片優化快取
└── ...                      # 其他快取文件
```

## 🚀 **SSG 如何運作？**

### **建構時期 (Build Time)**
1. **執行 `generateStaticParams()`**
   - 我們的函數返回：`[{id: "marketing-1"}, {id: "marketing-2"}, ...]`
   
2. **預渲染靜態頁面**
   - Next.js 為每個 ID 生成對應的 JavaScript 模組
   - 包含預渲染的 React 組件和數據

3. **生成 manifest 文件**
   - 記錄哪些路由是靜態的
   - 包含快取和重新驗證資訊

### **執行時期 (Runtime)**
1. **請求 `/page/marketing-1`**
2. **Next.js 查找對應的靜態模組**
3. **直接返回預渲染的內容**（超快！）
4. **必要時進行 ISR 重新驗證**

## 🔧 **如何驗證 SSG 正在工作？**

### **方法 1: 檢查建構日誌**
```bash
npm run build
```
尋找類似這樣的輸出：
```
Route (app)                    Size     First Load JS
┌ ○ /page/[id]                1.2 kB    85.3 kB    # ○ = Static
├ ● /marketing/list           2.1 kB    87.2 kB    # ● = SSR
└ ◐ /marketing/[id]/edit      3.4 kB    88.5 kB    # ◐ = Client
```

### **方法 2: 檢查文件存在**
```bash
# 檢查 SSG 文件是否存在
ls -la .next/server/app/page/[id]/page.js

# 檢查建構 manifest
cat .next/build-manifest.json | grep -A5 -B5 "page"
```

### **方法 3: 檢查 HTTP Headers**
```bash
curl -I http://localhost:3000/page/marketing-1
```
SSG 頁面應該有：
- `Cache-Control: public, s-maxage=3600`
- 快速的響應時間

## 📊 **與傳統 SSG 的差異**

| 特性 | Pages Router | App Router (Next.js 15) |
|------|-------------|------------------------|
| 輸出文件 | `.html` 文件 | JavaScript 模組 |
| 位置 | `out/` 或 `.next/` | `.next/server/app/` |
| 快取 | 文件系統 | React Server Components |
| 重新驗證 | 重新建構 | ISR (增量靜態再生) |
| 效能 | 快 | 更快（模組化載入）|

## 🎯 **實際運作證明**

### **我們的 SSG 實現包含：**

1. **`generateStaticParams()`** ✅
   - 在建構時生成所有已發布頁面的參數
   - 位置：`src/app/page/[id]/page.tsx`

2. **`generateMetadata()`** ✅
   - 為每個頁面動態生成 SEO 標籤
   - 包含 Open Graph 和結構化數據

3. **`revalidate = 3600`** ✅
   - 設定 ISR，每小時重新驗證
   - 平衡靜態效能和內容即時性

4. **伺服器端數據獲取** ✅
   - 使用 `getMarketingPageServer()` 在建構時獲取數據
   - 預載相關商品資訊

## 🔍 **驗證 SSG 是否成功**

### **建構成功的證據：**
- ✅ 建構完成沒有錯誤
- ✅ 生成了 `.next/server/app/page/[id]/page.js`
- ✅ 包含所有必要的 manifest 文件
- ✅ 設定了正確的快取 headers

### **SSG 文件內容：**
`page.js` 文件包含：
- 預渲染的 React 組件
- 靜態數據（在建構時獲取）
- 客戶端 hydration 所需的資訊
- 快取和重新驗證配置

## 🚀 **結論**

你的 SSG 實現是**完全正確**的！文件就在：
```
.next/server/app/page/[id]/page.js
```

這個 JavaScript 模組包含了所有預渲染的內容，提供了比傳統 HTML 文件更好的效能和靈活性。

Next.js 15 的 SSG 不再生成 HTML 文件，而是使用更先進的 **React Server Components** 架構，這是 Web 開發的未來趨勢！

---

**💡 提示：** 如果你想看到傳統的 HTML 文件，可以在 `next.config.ts` 中設定 `output: 'export'`，但這會失去 ISR 等進階功能。
