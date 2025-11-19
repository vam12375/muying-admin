/**
 * 图片URL处理工具函数
 * Image URL utility functions
 */

/**
 * 获取商品图片的完整URL
 * @param imageUrl 图片URL或文件名
 * @returns 完整的图片URL
 */
export function getProductImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) {
    return '/placeholder.svg';
  }
  
  // 如果已经是完整URL，直接返回
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Next.js 客户端请求需要使用完整URL（因为rewrites只对服务端有效）
  // 图片文件存储在 muying-web 项目的 public 目录，通过 5173 端口访问
  return `http://localhost:5173/products/${imageUrl}`;
}

/**
 * 获取用户头像的完整URL
 * @param avatarUrl 头像URL
 * @returns 完整的头像URL
 */
export function getUserAvatarUrl(avatarUrl: string | null | undefined): string {
  if (!avatarUrl) {
    return '/placeholder-avatar.png';
  }
  
  // 用户头像通常已经是完整URL
  return avatarUrl;
}

/**
 * 获取通用图片URL
 * @param imageUrl 图片URL或文件名
 * @param folder 图片所在文件夹（如 'products', 'avatars', 'brands'）
 * @returns 完整的图片URL
 */
export function getImageUrl(
  imageUrl: string | null | undefined,
  folder: string = 'products'
): string {
  if (!imageUrl) {
    return '/placeholder.svg';
  }
  
  // 如果已经是完整URL，直接返回
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Next.js 客户端请求需要使用完整URL
  return `http://localhost:5173/${folder}/${imageUrl}`;
}

/**
 * 获取品牌Logo的完整URL
 * @param logoUrl Logo URL或文件名
 * @returns 完整的Logo URL
 */
export function getBrandLogoUrl(logoUrl: string | null | undefined): string {
  if (!logoUrl) {
    return 'https://via.placeholder.com/60?text=No+Logo';
  }
  
  // 删除URL中的空白字符
  const trimmedUrl = logoUrl.trim();
  
  // 如果已经是完整URL，直接返回
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    return trimmedUrl;
  }
  
  // 如果已经包含brands路径，则提取文件名
  if (trimmedUrl.includes('/brands/') || trimmedUrl.startsWith('brands/')) {
    const fileName = trimmedUrl.split('/').pop(); // 获取文件名部分
    if (!fileName) {
      return 'https://via.placeholder.com/60?text=No+Logo';
    }
    return `http://localhost:5173/brands/${fileName}`;
  }
  
  // 如果只是文件名，则添加品牌图片路径前缀
  if (!trimmedUrl.includes('/')) {
    return `http://localhost:5173/brands/${trimmedUrl}`;
  }
  
  // 其他情况，返回默认图片
  return 'https://via.placeholder.com/60?text=No+Logo';
}
