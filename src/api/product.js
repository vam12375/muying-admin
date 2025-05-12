import request from '@/utils/request';

/**
 * 分页获取商品列表
 * @param {number} page 页码
 * @param {number} size 每页数量
 * @param {string} keyword 搜索关键字
 * @param {number} categoryId 分类ID
 * @param {number} brandId 品牌ID
 * @param {string} status 状态筛选
 * @param {number} timestamp 时间戳，用于防止缓存
 * @returns {Promise} 请求结果
 */
export function getProductPage(page = 1, size = 10, keyword, categoryId, brandId, status, timestamp) {
  console.log('请求商品列表参数:', { page, size, keyword, categoryId, brandId, status, timestamp });
  return request({
    url: '/admin/products/page',
    method: 'get',
    params: {
      page,
      size,
      keyword: keyword || '',
      categoryId: categoryId || '',
      brandId: brandId || '',
      status: status || '',
      _t: timestamp || new Date().getTime() // 添加时间戳参数防止缓存
    }
  });
}

/**
 * 获取商品详情
 * @param {number} id 商品ID
 * @param {number} timestamp 时间戳，用于防止缓存
 * @returns {Promise} 请求结果
 */
export function getProduct(id, timestamp) {
  return request({
    url: `/admin/products/${id}`,
    method: 'get',
    params: {
      _t: timestamp || new Date().getTime() // 添加时间戳参数防止缓存
    }
  });
}

/**
 * 添加商品
 * @param {Object} data 商品数据
 * @returns {Promise} 请求结果
 */
export function addProduct(data) {
  return request({
    url: '/admin/products',
    method: 'post',
    data
  });
}

/**
 * 更新商品
 * @param {number} id 商品ID
 * @param {Object} data 商品数据
 * @returns {Promise} 请求结果
 */
export function updateProduct(id, data) {
  return request({
    url: `/admin/products/${id}`,
    method: 'put',
    data
  });
}

/**
 * 删除商品
 * @param {number} id 商品ID
 * @returns {Promise} 请求结果
 */
export function deleteProduct(id) {
  return request({
    url: `/admin/products/${id}`,
    method: 'delete'
  });
}

/**
 * 修改商品状态
 * @param {number} id 商品ID
 * @param {number} status 状态值：0-下架，1-上架
 * @returns {Promise} 请求结果
 */
export function toggleProductStatus(id, status) {
  return request({
    url: `/admin/products/${id}/status`,
    method: 'put',
    params: { status }
  });
}

/**
 * 添加/更新商品库存
 * @param {number} id 商品ID
 * @param {number} stock 库存数量
 * @param {string} type 操作类型：add-增加，set-设置
 * @returns {Promise} 请求结果
 */
export function updateProductStock(id, stock, type = 'add') {
  return request({
    url: `/admin/products/${id}/stock`,
    method: 'put',
    params: { stock, type }
  });
}

/**
 * 获取商品分类列表
 * @returns {Promise} 请求结果
 */
export function getCategoryList() {
  return request({
    url: '/admin/categories',
    method: 'get'
  });
}

/**
 * 添加商品分类
 * @param {Object} data 分类数据
 * @returns {Promise} 请求结果
 */
export function addCategory(data) {
  return request({
    url: '/admin/categories',
    method: 'post',
    data
  });
}

/**
 * 更新商品分类
 * @param {number} id 分类ID
 * @param {Object} data 分类数据
 * @returns {Promise} 请求结果
 */
export function updateCategory(id, data) {
  return request({
    url: `/admin/categories/${id}`,
    method: 'put',
    data
  });
}

/**
 * 删除商品分类
 * @param {number} id 分类ID
 * @returns {Promise} 请求结果
 */
export function deleteCategory(id) {
  return request({
    url: `/admin/categories/${id}`,
    method: 'delete'
  });
}

/**
 * 获取品牌列表
 * @returns {Promise} 请求结果
 */
export function getBrandList() {
  return request({
    url: '/admin/brands',
    method: 'get'
  });
}

/**
 * 添加品牌
 * @param {Object} data 品牌数据
 * @returns {Promise} 请求结果
 */
export function addBrand(data) {
  return request({
    url: '/admin/brands',
    method: 'post',
    data
  });
}

/**
 * 更新品牌
 * @param {number} id 品牌ID
 * @param {Object} data 品牌数据
 * @returns {Promise} 请求结果
 */
export function updateBrand(id, data) {
  return request({
    url: `/admin/brands/${id}`,
    method: 'put',
    data
  });
}

/**
 * 删除品牌
 * @param {number} id 品牌ID
 * @returns {Promise} 请求结果
 */
export function deleteBrand(id) {
  return request({
    url: `/admin/brands/${id}`,
    method: 'delete'
  });
}

/**
 * 更新商品分类状态
 * @param {number} id 分类ID
 * @param {number} status 状态：0-禁用，1-正常
 * @returns {Promise} 请求结果
 */
export function updateCategoryStatus(id, status) {
  return request({
    url: `/admin/categories/${id}/status`,
    method: 'put',
    params: { status }
  });
}

/**
 * 获取分类下的商品数量
 * @param {number} id 分类ID
 * @returns {Promise} 请求结果
 */
export function getCategoryProductCount(id) {
  return request({
    url: `/admin/categories/${id}/product-count`,
    method: 'get'
  });
} 