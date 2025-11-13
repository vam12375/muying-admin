/**
 * 品牌管理类型定义
 * Brand Management Type Definitions
 * 
 * Source: 基于后端 BrandDTO 和 Brand 实体
 */

/**
 * 品牌信息
 */
export interface Brand {
  brandId: number;           // 品牌ID
  name: string;              // 品牌名称
  logo?: string;             // 品牌Logo URL
  description?: string;      // 品牌描述
  sort?: number;             // 排序
  status?: number;           // 状态：0-禁用，1-启用
  productCount?: number;     // 关联商品数量
  createTime?: string;       // 创建时间
  updateTime?: string;       // 更新时间
}

/**
 * 品牌列表查询参数
 */
export interface BrandListParams {
  page?: number;             // 页码
  size?: number;             // 每页大小
  keyword?: string;          // 搜索关键词
}

/**
 * 品牌表单数据
 */
export interface BrandFormData {
  name: string;              // 品牌名称（必填）
  logo?: string;             // 品牌Logo URL
  description?: string;      // 品牌描述
  sort?: number;             // 排序
  status?: number;           // 状态
}
