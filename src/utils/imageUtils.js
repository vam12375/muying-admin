/**
 * 格式化图片URL，将本地绝对路径转换为可访问的相对路径
 * 例如：将 "E:\11\muying-web\public\products\xxx.jpg" 转换为 "/products/xxx.jpg"
 * 或者：将 "brands/wyeth.png" 转换为 "/brands/wyeth.png"
 * 
 * @param {string} url 原始图片URL
 * @returns {string} 格式化后的图片URL
 */
export function formatImageUrl(url) {
  if (!url) return '';
  
  // 检查是否已经是正确格式的 URL
  if (url.startsWith('/products/') || url.startsWith('/brands/') || url.startsWith('http')) {
    return url;
  }
  
  // 处理品牌图片路径
  if (url.startsWith('brands/')) {
    return `/${url}`;
  }
  
  // 处理绝对路径 - 产品图片
  if (url.includes('\\products\\') || url.includes('/products/')) {
    // 提取products后面的路径部分
    const productPathMatch = url.match(/[\/\\]products[\/\\](.*)/);
    if (productPathMatch && productPathMatch[1]) {
      return `/products/${productPathMatch[1].replace(/\\/g, '/')}`;
    }
  }
  
  // 处理绝对路径 - 品牌图片
  if (url.includes('\\brands\\') || url.includes('/brands/')) {
    // 提取brands后面的路径部分
    const brandPathMatch = url.match(/[\/\\]brands[\/\\](.*)/);
    if (brandPathMatch && brandPathMatch[1]) {
      return `/brands/${brandPathMatch[1].replace(/\\/g, '/')}`;
    }
  }
  
  // 处理只有文件名的情况 - 默认作为产品图片处理
  if (!url.includes('/') && !url.includes('\\')) {
    return `/products/${url}`;
  }
  
  // 如果不是特定格式的路径，则返回原始URL
  return url;
}