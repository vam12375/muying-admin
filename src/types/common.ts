/**
 * 通用类型定义
 * Common Type Definitions
 */

/**
 * 分页结果
 */
export interface PageResult<T> {
  records: T[];              // 记录列表
  total: number;             // 总记录数
  current: number;           // 当前页码
  size: number;              // 每页大小
  pages: number;             // 总页数
}

/**
 * API 响应
 */
export interface ApiResponse<T = any> {
  success: boolean;          // 是否成功
  code?: number;             // 状态码
  message?: string;          // 消息
  data?: T;                  // 数据
}

/**
 * 列表查询参数基类
 */
export interface ListParams {
  page?: number;             // 页码
  size?: number;             // 每页大小
  keyword?: string;          // 搜索关键词
}

/**
 * 状态枚举
 */
export enum Status {
  DISABLED = 0,              // 禁用
  ENABLED = 1,               // 启用
}

/**
 * 排序方向
 */
export enum SortOrder {
  ASC = 'asc',               // 升序
  DESC = 'desc',             // 降序
}
