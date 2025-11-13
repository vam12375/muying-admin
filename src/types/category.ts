/**
 * 分类管理类型定义
 * Category Management Type Definitions
 * 
 * Source: 基于后端 CategoryDTO 和 Category 实体
 */

/**
 * 分类信息
 */
export interface Category {
  categoryId: number;          // 分类ID
  name: string;                // 分类名称
  parentId: number;            // 父级分类ID
  level: number;               // 层级：1-一级，2-二级，3-三级
  sort: number;                // 排序
  status: number;              // 状态：0-禁用，1-启用
  icon?: string;               // 图标
  description?: string;        // 描述
  createTime: string;          // 创建时间
  updateTime?: string;         // 更新时间
  children?: Category[];       // 子分类列表
  productCount?: number;       // 商品数量
}

/**
 * 分类列表查询参数
 */
export interface CategoryListParams {
  keyword?: string;            // 搜索关键词
  status?: number;             // 状态筛选
  level?: number;              // 层级筛选
}

/**
 * 分类表单数据
 */
export interface CategoryFormData {
  name: string;                // 分类名称（必填）
  parentId: number;            // 父级分类ID（必填）
  level: number;               // 层级（必填）
  sort?: number;               // 排序
  status?: number;             // 状态
  icon?: string;               // 图标
  description?: string;        // 描述
}
