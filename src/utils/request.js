import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getToken, removeToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: '/api', // 接口统一前缀
  timeout: 15000, // 请求超时时间
  headers: {
    'Cache-Control': 'no-cache', // 禁用缓存
    'Pragma': 'no-cache'
  }
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 如果存在token，请求头携带token
    const token = getToken()
    // console.log('[Request Interceptor] Token:', token);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
      // console.log('[Request Interceptor] Authorization Header:', config.headers['Authorization']);
    }
    
    // 为每个请求添加时间戳，防止缓存
    if (config.method === 'get') {
      config.params = config.params || {};
      config.params._t = new Date().getTime();
    }
    
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    
    // 如果响应的content-type是application/octet-stream，表示是文件下载，直接返回
    if (response.headers['content-type'] && response.headers['content-type'].includes('application/octet-stream')) {
      return response
    }
    
    // 处理返回结果
    if (res.code === 200 || res.code === 0 || res.success === true) {
      return res
    } else {
      // 处理错误
      showError(res.message || '操作失败')
      return Promise.reject(new Error(res.message || '操作失败'))
    }
  },
  error => {
    const { status, data } = error.response || {}
    
    // 处理401错误（未授权）
    if (status === 401) {
      removeToken()
      ElMessageBox.alert('您的登录已失效，请重新登录', '登录失效', {
        confirmButtonText: '重新登录',
        type: 'error',
        callback: () => {
          window.location.href = '/login'
        }
      })
      return Promise.reject(error)
    }
    
    // 处理403错误（禁止访问）
    if (status === 403) {
      ElMessage.error('无权限访问')
      return Promise.reject(error)
    }
    
    // 处理404错误（资源不存在）
    if (status === 404) {
      ElMessage.error('请求的资源不存在')
      return Promise.reject(error)
    }
    
    // 处理其他错误
    const errorMsg = (data && data.message) || error.message || '请求错误'
    showError(errorMsg)
    return Promise.reject(error)
  }
)

// 显示错误消息
const showError = msg => {
  ElMessage.error(msg)
}

export default service 