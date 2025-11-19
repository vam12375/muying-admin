/**
 * 商品管理类型定义
 * Product Management Type Definitions
 * 
 * Source: 基于后端 ProductDTO 和 Product 实体
 */

/**
 * 商品信息
 */
export interface Product {
  productId: number;           // 商品ID
  categoryId: number;          // 分类ID
  brandId: number;             // 品牌ID
  productName: string;         // 商品名称
  productSn: string;           // 商品编号
  productImg: string;          // 商品主图
  productDetail: string;       // 商品详情
  priceNew: number;            // 现价
  priceOld: number;            // 原价
  stock: number;               // 库存
  sales: number;               // 销量
  support: number;             // 点赞数
  rating: number;              // 评分
  reviewCount: number;         // 评价数
  productStatus: string;       // 状态：上架/下架
  isHot: number;               // 是否热销：0-否，1-是
  isNew: number;               // 是否新品：0-否，1-是
  isRecommend: number;         // 是否推荐：0-否，1-是
  createTime: string;          // 创建时间
  updateTime: string;          // 更新时间
  images?: string[] | null;    // 商品图片列表
  specsList?: any[] | null;    // 规格列表
  categoryName?: string;       // 分类名称
  brandName?: string;          // 品牌名称
  brandLogo?: string;          // 品牌Logo
}

/**
 * 商品列表查询参数
 */
export interface ProductListParams {
  page?: number;               // 页码
  size?: number;               // 每页大小
  keyword?: string;            // 搜索关键词
  categoryId?: number;         // 分类ID
  brandId?: number;            // 品牌ID
  status?: number;             // 状态：0-下架，1-上架
}

/**
 * 商品表单数据
 */
export interface ProductFormData {
  categoryId: number;          // 分类ID（必填）
  brandId: number;             // 品牌ID（必填）
  productName: string;         // 商品名称（必填）
  productSn: string;           // 商品编号（必填）
  productImg: string;          // 商品主图（必填）
  productDetail: string;       // 商品详情（必填）
  priceNew: number;            // 现价（必填）
  priceOld: number;            // 原价（必填）
  stock: number;               // 库存（必填）
  productStatus?: string;      // 状态
  isHot?: number;              // 是否热销
  isNew?: number;              // 是否新品
  isRecommend?: number;        // 是否推荐
  images?: string[];           // 商品图片列表
  specsList?: any[];           // 规格列表
  detailImages?: string[];     // 商品详情图列表（最多6张）
}

/**
 * 商品分析数据
 */
export interface ProductAnalysis {
  totalProducts: number;       // 商品总数
  newProducts: number;         // 新品数量
  outOfStock: number;          // 缺货数量
  totalSales: number;          // 总销量
  topCategories: Array<{       // 热门分类
    name: string;
    count: number;
  }>;
  topBrands: Array<{           // 热门品牌
    name: string;
    count: number;
  }>;
}
