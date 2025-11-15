/**
 * 评价管理类型定义
 * Comment Management Type Definitions
 * 
 * 对应后端: AdminCommentController
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
 */

/**
 * 评价状态枚举
 */
export enum CommentStatus {
  PENDING = 0,    // 待审核
  APPROVED = 1,   // 已通过
  REJECTED = 2,   // 已拒绝
}

/**
 * 评价实体
 */
export interface Comment {
  commentId: number;
  productId: number;
  productName: string;
  userId: number;
  userName: string;
  userNickname?: string;
  userAvatar?: string;
  orderId?: number;
  rating: number;              // 评分 1-5
  content: string;             // 评价内容
  images?: string[];           // 评价图片
  replyContent?: string;       // 商家回复
  replyTime?: string;          // 回复时间
  status: CommentStatus;       // 审核状态
  createTime: string;
  updateTime?: string;
}

/**
 * 评价列表查询参数
 */
export interface CommentListParams {
  page?: number;
  pageSize?: number;
  productId?: number;
  userId?: number;
  minRating?: number;
  maxRating?: number;
  status?: CommentStatus;
  orderId?: number;
}

/**
 * 评价分页响应
 */
export interface CommentPageResponse {
  records: Comment[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 评价统计数据
 */
export interface CommentStatistics {
  totalComments: number;       // 总评价数
  pendingComments: number;     // 待审核数
  approvedComments: number;    // 已通过数
  rejectedComments: number;    // 已拒绝数
  averageRating: number;       // 平均评分
  ratingDistribution: {        // 评分分布
    rating1: number;
    rating2: number;
    rating3: number;
    rating4: number;
    rating5: number;
  };
  recentComments: Comment[];   // 最近评价
}

/**
 * 回复评价参数
 */
export interface ReplyCommentParams {
  replyContent: string;
}

/**
 * 评价回复实体
 */
export interface CommentReply {
  replyId: number;
  commentId: number;
  replyContent: string;
  replyTime: string;
  adminId?: number;
  adminName?: string;
}

/**
 * 推荐评价模板
 */
export interface RecommendedTemplate {
  templateId: number;
  content: string;
  category: string;
}
