import { Product, PaginatedResponse } from "@/types";

// 全域商品資料儲存，確保資料一致性
let globalProducts: Product[] | null = null;

// 生成隨機商品資料
export const generateMockProducts = (): Product[] => {
  // 如果已經生成過資料，直接返回
  if (globalProducts) {
    return globalProducts;
  }
  const categories = [
    "電子產品",
    "服飾",
    "家居用品",
    "美妝保養",
    "運動用品",
    "書籍",
    "食品",
    "玩具",
  ];
  const brands = [
    "Apple",
    "Samsung",
    "Nike",
    "Adidas",
    "Uniqlo",
    "MUJI",
    "SK-II",
    "Canon",
  ];
  const statuses: ("active" | "inactive" | "out_of_stock")[] = [
    "active",
    "inactive",
    "out_of_stock",
  ];

  const products: Product[] = [];

  for (let i = 1; i <= 30; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const originalPrice = Math.floor(Math.random() * 50000) + 1000;
    const discount =
      Math.random() > 0.5 ? Math.floor(Math.random() * 50) + 5 : 0;
    const price =
      discount > 0
        ? Math.floor(originalPrice * (1 - discount / 100))
        : originalPrice;
    const rating = Math.random() * 2 + 3; // 3-5星
    const reviewCount = Math.floor(Math.random() * 500) + 10;

    products.push({
      id: `product-${i}`,
      title: `${brand} ${category}產品 ${i}`,
      description: `這是一個高品質的${category}，採用最新技術製造，提供卓越的使用體驗。適合各種場合使用，是您的最佳選擇。`,
      price,
      originalPrice: discount > 0 ? originalPrice : undefined,
      discount: discount > 0 ? discount : undefined,
      images: [
        `https://picsum.photos/400/300?random=${i}`,
        `https://picsum.photos/400/300?random=${i + 100}`,
        `https://picsum.photos/400/300?random=${i + 200}`,
      ],
      category,
      tags: [category, brand, "熱銷", "推薦"],
      stock: Math.floor(Math.random() * 100) + 1,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      brand,
      weight: Math.floor(Math.random() * 2000) + 100,
      dimensions: {
        length: Math.floor(Math.random() * 50) + 10,
        width: Math.floor(Math.random() * 40) + 8,
        height: Math.floor(Math.random() * 30) + 5,
      },
      rating: Math.round(rating * 10) / 10,
      reviewCount,
      seoTitle: `${brand} ${category}產品 ${i} - 高品質商品`,
      seoDescription: `購買${brand} ${category}產品 ${i}，享受優質購物體驗`,
      seoKeywords: [category, brand, "線上購物", "優惠"],
      createdAt: new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
      ),
      updatedAt: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ),
    });
  }

  // 儲存生成的資料到全域變數
  globalProducts = products;
  return products;
};

// 模擬 API 延遲
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 模擬商品列表 API
export const mockProductsApi = async (
  page: number = 1,
  limit: number = 10,
  sortBy?: string,
  sortOrder: "asc" | "desc" = "desc"
): Promise<PaginatedResponse<Product>> => {
  await delay(500); // 模擬網路延遲

  const allProducts = generateMockProducts();

  // 排序 - 如果沒有指定排序，默認按建立時間降序排列
  const actualSortBy = sortBy || "createdAt";
  allProducts.sort((a, b) => {
    const aValue = a[actualSortBy as keyof Product];
    const bValue = b[actualSortBy as keyof Product];

    // 處理日期類型
    if (aValue instanceof Date && bValue instanceof Date) {
      return sortOrder === "asc"
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }

    // 處理數字類型
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }

    // 處理字符串類型
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  const total = allProducts.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const data = allProducts.slice(startIndex, endIndex);

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

// 模擬單一商品 API
export const mockProductApi = async (id: string): Promise<Product | null> => {
  await delay(300);

  const allProducts = generateMockProducts();
  return allProducts.find((product) => product.id === id) || null;
};

// 模擬商品搜尋 API
export const mockSearchProductsApi = async (
  query: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<Product>> => {
  await delay(400);

  const allProducts = generateMockProducts();
  const filteredProducts = allProducts.filter(
    (product) =>
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()) ||
      product.tags.some((tag) =>
        tag.toLowerCase().includes(query.toLowerCase())
      )
  );

  const total = filteredProducts.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const data = filteredProducts.slice(startIndex, endIndex);

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

// 模擬更新商品 API
export const mockUpdateProductApi = async (
  id: string,
  updatedProduct: Partial<Product>
): Promise<Product | null> => {
  await delay(500);

  const allProducts = generateMockProducts();
  const productIndex = allProducts.findIndex((product) => product.id === id);

  if (productIndex === -1) {
    return null;
  }

  // 更新商品資料
  const currentProduct = allProducts[productIndex];
  const newProduct = {
    ...currentProduct,
    ...updatedProduct,
    id: currentProduct.id, // 确保 ID 不被修改
    updatedAt: new Date(), // 更新时间戳
  };

  // 更新全域資料
  if (globalProducts) {
    globalProducts[productIndex] = newProduct;
  }

  return newProduct;
};

// 模擬創建商品 API
export const mockCreateProductApi = async (
  productData: Omit<Product, "id" | "createdAt" | "updatedAt">
): Promise<Product> => {
  await delay(500);

  const allProducts = generateMockProducts();
  const newId = `product-${allProducts.length + 1}`;
  const now = new Date();

  const newProduct: Product = {
    ...productData,
    id: newId,
    createdAt: now,
    updatedAt: now,
  };

  // 新增到全域資料
  if (globalProducts) {
    globalProducts.push(newProduct);
  }

  return newProduct;
};
