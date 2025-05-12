/**
 * Token工具模块
 * 处理用户token的存储、获取和删除
 */

const TOKEN_KEY = 'muying_admin_token';
const USER_KEY = 'muying_admin_user';

/**
 * 保存token到localStorage
 * @param {string} token 
 */
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * 从localStorage获取token
 * @returns {string} token
 */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * 从localStorage删除token
 */
export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * 保存用户信息到localStorage
 * @param {Object} user 用户信息
 */
export function setUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * 用户信息保存的别名方法（兼容性）
 * @param {Object} userInfo 用户信息
 */
export function setUserInfo(userInfo) {
  setUser(userInfo);
}

/**
 * 从localStorage获取用户信息
 * @returns {Object} 用户信息
 */
export function getUser() {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

/**
 * 从localStorage删除用户信息
 */
export function removeUser() {
  localStorage.removeItem(USER_KEY);
}

/**
 * 清除所有认证相关的存储
 */
export function clearAuth() {
  removeToken();
  removeUser();
}

/**
 * 检查用户是否已登录
 * @returns {boolean} 是否已登录
 */
export function isLoggedIn() {
  return !!getToken();
}

// 检查是否为管理员
export function isAdmin() {
  const userInfo = getUser()
  return userInfo && userInfo.role === 'admin'
}

// 登出操作
export function logout() {
  removeToken()
  removeUser()
  // 可以在这里添加其他登出操作，如清除其他本地存储等
} 