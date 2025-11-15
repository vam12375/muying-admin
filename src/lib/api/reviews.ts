/**
 * Comments API - 评价管理
 * 对应后端: AdminCommentController (/admin/comments)
 * 
 * 基于 Swagger 接口文档实现
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
 */

import { fetchApi, type ApiResponse } from './index';
import type {
  Comment,
  CommentListParams,
  CommentPageResponse,
  CommentStatistics,
  ReplyCommentParams,
  CommentReply,
  RecommendedTemplate,
} from '@/types/comment';

/**
 * 获取评价分页列表
 * GET /admin/comments/page
 */
export async function getCommentList(
  params: CommentListParams
): Promise<ApiResponse<CommentPageResponse>> {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
  if (params.productId) queryParams.append('productId', params.productId.toString());
  if (params.userId) queryParams.append('userId', params.userId.toString());
  if (params.minRating) queryParams.append('minRating', params.minRating.toString());
  if (params.maxRating) queryParams.append('maxRating', params.maxRating.toString());
  if (params.status !== undefined) queryParams.append('status', params.status.toString());
  if (params.orderId) queryParams.append('orderId', params.orderId.toString());
  
  return fetchApi<CommentPageResponse>(`/admin/comments/page?${queryParams}`);
}

/**
 * 获取评价详情
 * GET /admin/comments/{id}
 */
export async function getCommentDetail(id: number): Promise<ApiResponse<Comment>> {
  return fetchApi<Comment>(`/admin/comments/${id}`);
}

/**
 * 删除评价
 * DELETE /admin/comments/{id}
 */
export async function deleteComment(id: number): Promise<ApiResponse<boolean>> {
  return fetchApi<boolean>(`/admin/comments/${id}`, {
    method: 'DELETE'
  });
}

/**
 * 获取评价回复列表
 * GET /admin/comments/{id}/replies
 */
export async function getCommentReplies(id: number): Promise<ApiResponse<CommentReply[]>> {
  return fetchApi<CommentReply[]>(`/admin/comments/${id}/replies`);
}

/**
 * 更新评价状态
 * PUT /admin/comments/{id}/status
 */
export async function updateCommentStatus(
  id: number,
  status: number
): Promise<ApiResponse<boolean>> {
  const params = new URLSearchParams({ status: status.toString() });
  return fetchApi<boolean>(`/admin/comments/${id}/status?${params}`, {
    method: 'PUT'
  });
}

/**
 * 回复评价
 * POST /admin/comments/reply
 */
export async function replyComment(
  commentId: number,
  replyContent: string
): Promise<ApiResponse<boolean>> {
  return fetchApi<boolean>('/admin/comments/reply', {
    method: 'POST',
    body: JSON.stringify({ commentId, replyContent })
  });
}

/**
 * 更新评价回复
 * PUT /admin/comments/reply/{replyId}
 */
export async function updateCommentReply(
  replyId: number,
  replyContent: string
): Promise<ApiResponse<boolean>> {
  return fetchApi<boolean>(`/admin/comments/reply/${replyId}`, {
    method: 'PUT',
    body: JSON.stringify({ replyContent })
  });
}

/**
 * 删除评价回复
 * DELETE /admin/comments/reply/{replyId}
 */
export async function deleteCommentReply(replyId: number): Promise<ApiResponse<boolean>> {
  return fetchApi<boolean>(`/admin/comments/reply/${replyId}`, {
    method: 'DELETE'
  });
}

/**
 * 获取评价统计数据
 * GET /admin/comments/stats
 */
export async function getCommentStatistics(): Promise<ApiResponse<CommentStatistics>> {
  return fetchApi<CommentStatistics>('/admin/comments/stats');
}

/**
 * 获取推荐评价模板
 * GET /admin/comments/templates/recommended
 */
export async function getRecommendedTemplates(): Promise<ApiResponse<RecommendedTemplate[]>> {
  return fetchApi<RecommendedTemplate[]>('/admin/comments/templates/recommended');
}

// 导出为对象形式（兼容旧代码）
export const reviewsApi = {
  getList: (
    page: number = 1,
    pageSize: number = 10,
    productId?: number,
    userId?: number,
    minRating?: number,
    maxRating?: number,
    status?: number,
    orderId?: number
  ) => {
    return getCommentList({ page, pageSize, productId, userId, minRating, maxRating, status, orderId });
  },
  getDetail: getCommentDetail,
  updateStatus: updateCommentStatus,
  reply: replyComment,
  delete: deleteComment,
  getStats: getCommentStatistics,
  getReplies: getCommentReplies,
  updateReply: updateCommentReply,
  deleteReply: deleteCommentReply,
  getTemplates: getRecommendedTemplates,
};

// 新的命名导出
export const commentsApi = reviewsApi;
